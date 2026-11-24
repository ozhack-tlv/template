# OZ HACK: installs the tools this project needs on Windows, without admin rights.
# Node.js -> %USERPROFILE%\.ozhack\tools\node (official zip from nodejs.org, checksum verified)
# Git     -> %USERPROFILE%\.ozhack\tools\git  (official PortableGit from git-for-windows)
# Adds them to the user's PATH (user level only) and tells Claude Code where Git Bash is.
# Prints a final line: OZHACK_STATUS: READY | RESTART
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # makes Invoke-WebRequest much faster
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$Tools = Join-Path $env:USERPROFILE '.ozhack\tools'
New-Item -ItemType Directory -Force -Path $Tools | Out-Null
$arch = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x64' }
$restart = $false
function Say($msg) { Write-Output "OZHACK: $msg" }
function Has($cmd) { $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue) }

# --- Node.js ---
$nodeDir = Join-Path $Tools 'node'
if (Has 'node') {
  Say "Node.js $(node -v) is installed"
} elseif (Test-Path (Join-Path $nodeDir 'node.exe')) {
  Say "Node.js is in $nodeDir"
  $restart = $true
} else {
  $base = 'https://nodejs.org/dist/latest-v24.x'
  Say "Downloading Node.js ($arch)..."
  $sums = (Invoke-WebRequest "$base/SHASUMS256.txt" -UseBasicParsing).Content -split "`n"
  $line = $sums | Where-Object { $_ -match "win-$arch\.zip\s*$" } | Select-Object -First 1
  $parts = $line.Trim() -split '\s+'
  $sum = $parts[0]; $file = $parts[1]
  $zip = Join-Path $Tools 'node.zip'
  Invoke-WebRequest "$base/$file" -OutFile $zip -UseBasicParsing
  if ((Get-FileHash $zip -Algorithm SHA256).Hash -ne $sum.ToUpper()) { throw 'Node.js download is corrupted (checksum mismatch)' }
  $tmp = Join-Path $Tools 'node-unpack'
  if (Test-Path $tmp) { Remove-Item $tmp -Recurse -Force }
  Expand-Archive $zip -DestinationPath $tmp -Force
  Move-Item (Get-ChildItem $tmp -Directory | Select-Object -First 1).FullName $nodeDir
  Remove-Item $tmp -Recurse -Force
  Remove-Item $zip -Force
  Say "Node.js installed in $nodeDir"
  $restart = $true
}

# --- Git (PortableGit) ---
$gitDir = Join-Path $Tools 'git'
if (Has 'git') {
  Say "Git is installed"
} elseif (Test-Path (Join-Path $gitDir 'cmd\git.exe')) {
  Say "Git is in $gitDir"
  $restart = $true
} else {
  $kind = if ($arch -eq 'arm64') { 'arm64' } else { '64-bit' }
  $url = $null
  try {
    $rel = Invoke-RestMethod 'https://api.github.com/repos/git-for-windows/git/releases/latest' -Headers @{ 'User-Agent' = 'ozhack-setup' }
    $url = ($rel.assets | Where-Object { $_.name -match "^PortableGit-.*-$kind\.7z\.exe$" } | Select-Object -First 1).browser_download_url
  } catch { }
  if (-not $url) {
    # Fallback when the GitHub API is rate-limited (many students on one network)
    $url = "https://github.com/git-for-windows/git/releases/download/v2.56.0.windows.4/PortableGit-2.56.0.4-$kind.7z.exe"
  }
  Say "Downloading Git..."
  $exe = Join-Path $Tools 'PortableGit.7z.exe'
  Invoke-WebRequest $url -OutFile $exe -UseBasicParsing
  $sig = Get-AuthenticodeSignature $exe
  if ($sig.Status -ne 'Valid') { throw "Git download is not validly signed ($($sig.Status))" }
  Start-Process -FilePath $exe -ArgumentList "-o`"$gitDir`" -y" -Wait -NoNewWindow
  Remove-Item $exe -Force
  if (-not (Test-Path (Join-Path $gitDir 'cmd\git.exe'))) { throw 'Git was not extracted' }
  Say "Git installed in $gitDir"
  $restart = $true
}

# --- PATH (user level only) ---
$userPath = [Environment]::GetEnvironmentVariable('Path', 'User')
if (-not $userPath) { $userPath = '' }
$entries = $userPath -split ';' | Where-Object { $_ }
foreach ($p in @($nodeDir, (Join-Path $gitDir 'cmd'))) {
  if ((Test-Path $p) -and ($entries -notcontains $p)) { $entries = @($p) + $entries; $restart = $true }
}
[Environment]::SetEnvironmentVariable('Path', ($entries -join ';'), 'User')

$bash = Join-Path $gitDir 'bin\bash.exe'
if ((Test-Path $bash) -and -not [Environment]::GetEnvironmentVariable('CLAUDE_CODE_GIT_BASH_PATH', 'User')) {
  [Environment]::SetEnvironmentVariable('CLAUDE_CODE_GIT_BASH_PATH', $bash, 'User')
  $restart = $true
}

if ($restart) { Write-Output 'OZHACK_STATUS: RESTART' } else { Write-Output 'OZHACK_STATUS: READY' }
