# Tosaf Chipus – AI Universal Search v2.0

תוסף Chrome לחיפוש מקומי ומאוחד בשיחות AI ובהיסטוריית הגלישה.

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

מפתח Gemini נשמר ב-storage המקומי של התוסף. זה אינו כספת חומרה; לכן חיפוש Gemini כבוי כברירת מחדל.

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
