#!/bin/bash
# OZ HACK: installs the tools this project needs on macOS, without admin rights.
# Node.js -> ~/.ozhack/tools/node (official build from nodejs.org, checksum verified)
# Git     -> Apple's Command Line Tools (macOS shows its own "Install" dialog)
# Prints a final line: OZHACK_STATUS: READY | RESTART | WAIT_FOR_GIT
set -euo pipefail

TOOLS="$HOME/.ozhack/tools"
mkdir -p "$TOOLS"
say() { echo "OZHACK: $*"; }
restart=0

node_ok() {
  command -v node >/dev/null 2>&1 &&
    node -e 'process.exit(Number(process.versions.node.split(".")[0]) >= 20 ? 0 : 1)' 2>/dev/null
}

# --- Node.js ---
if node_ok; then
  say "Node.js $(node -v) is installed"
elif [ -x "$TOOLS/node/bin/node" ]; then
  say "Node.js is in $TOOLS/node (needs a restart of the Claude app to be found)"
  restart=1
else
  arch="$(uname -m)"
  [ "$arch" = "arm64" ] && a="arm64" || a="x64"
  base="https://nodejs.org/dist/latest-v24.x"
  say "Downloading Node.js ($a)..."
  line="$(curl -fsSL "$base/SHASUMS256.txt" | grep "darwin-$a.tar.gz$" | head -n 1)"
  sum="${line%% *}"
  file="${line##* }"
  curl -fsSL "$base/$file" -o "$TOOLS/node.tgz"
  echo "$sum  $TOOLS/node.tgz" | shasum -a 256 -c - >/dev/null
  rm -rf "$TOOLS/node"
  mkdir -p "$TOOLS/node"
  tar -xzf "$TOOLS/node.tgz" -C "$TOOLS/node" --strip-components 1
  rm -f "$TOOLS/node.tgz"
  say "Node.js $("$TOOLS/node/bin/node" -v) installed in $TOOLS/node"
  restart=1
fi

# Make the tools folder part of PATH for new shells (user files only).
if [ -d "$TOOLS/node/bin" ]; then
  line='export PATH="$HOME/.ozhack/tools/node/bin:$PATH" # OZ HACK'
  for f in "$HOME/.zprofile" "$HOME/.zshrc" "$HOME/.bash_profile"; do
    touch "$f"
    grep -q "# OZ HACK" "$f" || echo "$line" >>"$f"
  done
fi

# --- Git ---
if xcode-select -p >/dev/null 2>&1; then
  say "Git is installed"
else
  say "Git is missing: opening Apple's installer (Command Line Tools)"
  xcode-select --install >/dev/null 2>&1 || true
  echo "OZHACK_STATUS: WAIT_FOR_GIT"
  exit 0
fi

if [ "$restart" = 1 ]; then
  echo "OZHACK_STATUS: RESTART"
else
  echo "OZHACK_STATUS: READY"
fi
