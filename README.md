# Tosaf Chipus – AI Universal Search v2.2.0

תוסף Chrome לחיפוש מקומי ומאוחד בשיחות AI, בהיסטוריית Chrome ובאתרי Web.

## v2.2.0
- החיפוש המקומי משתמש באינדקס tokens של IndexedDB במקום לסרוק את כל הרשומות לכל שאילתה.
- החיפוש תומך גם בהתאמות prefix יעילות.
- background.js מכיל handler ממשי ל-search.
- מפתח Gemini נשמר ב-chrome.storage.session בלבד, ואי אפשר לקרוא אותו דרך הודעה.
- פעולות privileged מוגבלות ל-UI של התוסף.
- content.js ו-web-content.js אוחדו לקובץ אחד; הקובץ הישן הוסר.
- Web indexing נשאר opt-in ודחוי כברירת מחדל ב-25 שניות.
- ננקטת הגבלת קצב של עד 20 פעולות AI בדקה.
- Gemini משתמש ב-gemini-3.5-flash-lite, מודל GA חסכוני עם Free Tier לפי תיעוד Google הנוכחי.
- הרחבת שאילתה, דירוג תוצאות, ויצירת מטא-דאטה הם פעולות AI נפרדות.
- Prompt injection מצומצם באמצעות system instruction, סימון התוכן כ-untrusted data, וצמצום המידע שנשלח.

## בחירת מודל Gemini
התיעוד הרשמי הנוכחי של Google מפרט את gemini-3.5-flash-lite כמודל Flash-Lite זמין ו-GA, ומציג לו Free Tier. Google מציגה את gemini-flash-latest כ-alias ל-Flash הרגיל; לא מסתמכים על alias לא מתועד בשם gemini-flash-lite-latest. מודלי Gemini 2.0 Flash-Lite נסגרו ב-1 ביוני 2026. לכן התוסף משתמש במזהה היציב והמפורש gemini-3.5-flash-lite.

## Privacy
- אין cookies, tokens או endpoints פרטיים של שירותי AI.
- אין eval, remote code, ספריות צד שלישי או telemetry.
- Incognito אינו נשמר.
- תוכן Web רגיל דורש הרשאת אתר אופציונלית.
- דומיינים רגישים נפוצים של דואר, בנקים, תשלומים ושירותי בריאות מוחרגים מאיסוף תוכן.
- פתיחת תפריט התוסף אינה קוראת את תוכן הדף.
- תוכן נשלח ל-Gemini רק לאחר פעולה מפורשת של המשתמש.
- בדירוג תוצאות נשלחים עד 20 תוצאות בלבד, עם תקצירים ומטא-דאטה מוגבלים.
- ביצירת מטא-דאטה נשלחים כתובת, כותרת ועד 35,000 תווים של טקסט גלוי מהדף.
- מפתח Gemini אינו מוחזר ל-Side Panel או לדף Web כלשהו.

## Features
### Site metadata
לכל דומיין נשמרים שם ותיאור. אפשר לערוך אותם מתפריט סמל התוסף. התיאור מוגבל ל-500 תווים ומשמש לשיפור החיפוש. כפתור AI מייצר שם ותיאור באורך של כ-30 מילים ומוסיף מילות חיפוש ומילים נרדפות.

### Read Later
אפשר לשמור URL ברשימה מקומית של לקרוא אח״כ ולסגור את הלשונית מיד.

### Search
תומך במילים, ביטויים במרכאות, שלילה, in:, account:, after: ו-before:. תוצאות יכולות להיות מדורגות מחדש עם AI, אך פעולה זו כבויה כברירת מחדל.

### Web delay
תוכן Web רגיל נכנס לאינדקס התוכן אחרי 25 שניות כברירת מחדל. אפשר לבחור זמן אחר ב-Options. היסטוריית Chrome עצמה היא ערוץ נפרד.

## Import
ChatGPT: Data Controls → Export Data → conversations.json.
Claude: Settings → Privacy → Export data.
Gemini: Google Takeout → My Activity → Gemini Apps.
AI Studio: JSON/JSONL במבנים נפוצים. פורמט עתידי עשוי להשתנות.

## Install
1. פתח chrome://extensions.
2. הפעל Developer mode.
3. Load unpacked.
4. בחר את תיקיית המאגר.
5. פתח Options.
קיצור לחיפוש: Ctrl+Shift+K.

## Security validation
כל קובצי ה-JavaScript נבדקים ל-syntax לפני סגירת גרסה. בדיקה זו אינה מחליפה בדיקת runtime מלאה ב-Chrome נקייה.

## License
MIT