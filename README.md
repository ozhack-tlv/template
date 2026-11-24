# &lt;OZ/&gt; HACK – פרויקט הצוות

<!-- TODO(צוות): שם האפליקציה, הבעיה שהיא פותרת, ומי בצוות -->

## הפעלה בפעם הראשונה

1. מתקינים: [Node.js](https://nodejs.org) (גרסת LTS), [Git](https://git-scm.com) ו-[Claude Code](https://claude.com/claude-code).
2. מורידים את הריפו של הצוות:
   ```bash
   git clone https://github.com/ozhack-tlv/teamXX.git
   cd teamXX
   ```
3. מעתיקים לתיקייה את שני הקבצים הסודיים שקיבלתם מהמורה:
   - `.env.local` לתיקייה הראשית
   - `settings.local.json` לתוך התיקייה `.claude`
4. מתקינים ובודקים:
   ```bash
   npm install
   npm run check
   ```
5. מריצים: `npm run dev`, ופותחים את http://localhost:3000

## עבודה יומיומית

| מה | פקודה |
|---|---|
| להריץ את האתר במחשב | `npm run dev` |
| לפתוח את Claude Code | `claude` |
| לשמור ולשתף עם הצוות | `git add -A && git commit -m "מה עשינו" && git push` |
| לקבל את מה שהצוות דחף | `git pull` |
| להעלות לאוויר | `npm run deploy` |

## חשוב

- **לא** מתחברים ל-Claude Code עם `/login`. המפתח כבר בקובץ שקיבלתם.
- **לא** משתפים את הקבצים הסודיים, לא מעלים אותם לגיטהאב ולא שולחים אותם בקבוצות.
- טבלה חדשה במסד הנתונים: Claude כותב קובץ SQL בתיקייה `supabase`, ואתם מריצים אותו ב-Supabase → SQL Editor.
