# Tosaf Chipus – AI Universal Search v2.0.1

תוסף Chrome לחיפוש מקומי ומאוחד בשיחות AI ובהיסטוריית הגלישה.

## v2.0.1
- Gemini API key moved to Chrome session storage; it is not persisted in the extension's permanent storage and is not exposed to the Side Panel.
- DOM observation is throttled and attached to the relevant content container instead of the entire document root.

## v2.0
- IndexedDB במקום אחסון כל האינדקס ב-storage.
- החיפוש מתבצע ב-Service Worker ומחזיר עד 100 תוצאות.
- ייבוא ברמת הודעה מ-ChatGPT, Claude, Gemini ו-AI Studio.
- שדה account/profile לייבוא כדי להבדיל בין כמה חשבונות.
- ייבוא היסטוריית Chrome קיימת ומעקב אחרי ביקורים חדשים.
- חיפוש עם in:, account:, after:, before:, ביטויים במרכאות ומילות שלילה.
- Gemini הוא הרחבת שאילתה בלבד: הוא מקבל את השאילתה ולא את האינדקס.
- קריאת תוכן Web רגיל היא אופציונלית ודורשת הרשאת אתרים בזמן ההפעלה.
- Incognito אינו נשמר.
- אין endpoints פרטיים, cookies, tokens, eval או remote code.
- אין ספריות צד שלישי ואין telemetry.

## פרטיות ואבטחה
ההרשאות לאתרי Web רגילים הן optional host permissions, כך שאפשר לאשר אותן רק אם מפעילים אינדוקס תוכן Web. היסטוריית Chrome יכולה להיאסף בלי לקרוא את תוכן הדפים.

מפתח Gemini נשמר ב-session storage בלבד, רק בתוך סשן Chrome הנוכחי, ואינו נשמר ב-storage הקבוע של התוסף. הוא גם אינו מוחזר ל-Side Panel; רק Service Worker קורא אותו בעת בקשת Gemini. לכן לאחר סגירת Chrome יש להזין אותו מחדש.

## מקורות ייבוא
ChatGPT: OpenAI מציינת שייצוא הנתונים כולל את היסטוריית הצ'אטים ובייצוא רגיל ניתן למצוא conversations.json.

Claude: Anthropic מספקת Settings → Privacy → Export data, והייצוא כולל conversation data.

Gemini Apps: Google מספקת הורדה דרך Google Takeout; יש לבחור My Activity ואז Gemini Apps.

AI Studio: אין להסתמך על JSON יחיד וקבוע; המתאם מקבל כמה מבנים נפוצים. אם פורמט מסוים לא נקלט, אפשר לשמור את הקובץ ולבצע התאמה נוספת בלי גישה לחשבון עצמו.

## התקנה
1. הורד/Clone את המאגר.
2. פתח chrome://extensions.
3. הפעל Developer mode.
4. Load unpacked ובחר את התיקייה.
5. פתח Options והגדר את האפשרויות.

Ctrl+Shift+K פותח את החיפוש.

## ייבוא ChatGPT
ב-ChatGPT: Settings → Data Controls → Export Data. חלץ את ZIP וחפש conversations.json.

## ייבוא Claude
Settings → Privacy → Export data. לאחר קבלת הייצוא בחר את קובץ ה-JSON.

## ייבוא Gemini
Google Takeout → My Activity → Gemini Apps ובחר JSON.

## עקרון אבטחה
התוסף אינו מנסה להיכנס מאחורי הקלעים לחשבונות ואינו משתמש ב-endpoints פרטיים. שיחות ישנות מגיעות מ-export שהמשתמש מספק; שיחות שנפתחות בדפדפן נאספות רק מהתוכן שמוצג בדף.

התוסף שומר טקסט כטקסט ואינו מריץ HTML/JavaScript מתוך קובצי ייבוא.

## רישיון
MIT


## v2.1.0 additions
- Per-site name and optional search description, editable from the extension action popup.
- Optional Gemini-generated site metadata with about 30 Hebrew words and search keywords.
- Read Later local list with save-and-close action.
- Regular Web content indexing defaults to 25 seconds and is configurable.
- Optional AI ranking of up to 20 top results; only limited metadata/snippets are sent.
- Opening the popup itself does not read page content.
- Gemini key remains session-only.
