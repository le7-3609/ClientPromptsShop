# ✅ Checklist - מה צריך לעשות עכשיו?

## 🔴 חובה (Critical)

### 1. חיבור ל-API
- [ ] עדכן את ה-`environment.apiUrl` בקובץ environment
- [ ] ודא שה-API endpoints קיימים (ראה `API_REQUIREMENTS.md`)
- [ ] בדוק שה-API מחזיר את המבנה הנכון של `CartItemModel`
- [ ] הוסף error handling ל-API calls

### 2. בדיקת המודלים
- [ ] ודא ש-`CartItemModel` תואם למה שה-API מחזיר
- [ ] בדוק את `AddCartItemDto` - האם כל השדות נכונים?
- [ ] עדכן את המודלים אם צריך

### 3. ניהול Cart ID
- [ ] החלט איך לקבל את ה-`cartId` (userId? שדה נפרד?)
- [ ] עדכן את הלוגיקה ב-`sub-category.ts`
- [ ] ודא שהסל נטען בעת התחברות

### 4. בדיקת הרשאות
- [ ] ודא שרק משתמשים מחוברים יכולים להוסיף לסל
- [ ] בדוק שמשתמש יכול לגשת רק לסל שלו
- [ ] הוסף guards אם צריך

## 🟡 חשוב (Important)

### 5. עמוד Checkout
- [ ] צור קומפוננט Checkout
- [ ] הוסף route ל-`/checkout`
- [ ] חבר את כפתור "Complete Purchase"
- [ ] הוסף טופס פרטי תשלום

### 6. Platform ID
- [ ] החלט איך לקבל את ה-`platformId`
- [ ] האם זה בא מ-BasicSite?
- [ ] עדכן את הלוגיקה בהתאם

### 7. User Description
- [ ] החלט אם צריך דיאלוג לתיאור אישי
- [ ] הוסף textarea אם צריך
- [ ] או השאר ריק כברירת מחדל

### 8. בדיקות (Testing)
- [ ] בדוק הוספת מוצר לסל
- [ ] בדוק מחיקת מוצר
- [ ] בדוק סימון/ביטול סימון
- [ ] בדוק חישוב מחיר
- [ ] בדוק את הסל הצף
- [ ] בדוק responsive design

## 🟢 רצוי (Nice to Have)

### 9. שיפורים ב-UI
- [ ] הוסף loading spinners
- [ ] הוסף אנימציות
- [ ] הוסף empty states יפים יותר
- [ ] הוסף tooltips

### 10. תכונות נוספות
- [ ] שמירת הסל ב-localStorage
- [ ] מניעת כפילויות (בדיקה אם מוצר כבר בסל)
- [ ] הגבלת כמות פריטים בסל
- [ ] אפשרות לשנות כמות
- [ ] קודי הנחה

### 11. אופטימיזציה
- [ ] הוסף caching
- [ ] הוסף debounce ל-API calls
- [ ] אופטימיזציה של תמונות
- [ ] lazy loading

### 12. אבטחה
- [ ] הוסף CSRF protection
- [ ] ולידציה של נתונים
- [ ] rate limiting
- [ ] XSS protection

## 📝 תיעוד

### 13. README
- [ ] עדכן את ה-README הראשי
- [ ] הוסף screenshots
- [ ] הוסף הוראות התקנה
- [ ] הוסף troubleshooting

### 14. Comments
- [ ] הוסף comments לקוד מורכב
- [ ] הוסף JSDoc לפונקציות
- [ ] הוסף TODO comments למה שחסר

## 🧪 בדיקות ספציפיות

### בדוק את התרחישים הבאים:

#### תרחיש 1: משתמש לא מחובר
- [ ] לוחץ "Add to Cart"
- [ ] צריך להפנות ל-`/auth`
- [ ] אחרי התחברות - לחזור לדף המוצר

#### תרחיש 2: הוספה מוצלחת
- [ ] לוחץ "Add to Cart"
- [ ] הסל הצף נפתח
- [ ] ה-badge מתעדכן
- [ ] הודעת הצלחה מוצגת

#### תרחיש 3: שגיאת API
- [ ] API מחזיר שגיאה
- [ ] הודעת שגיאה מוצגת
- [ ] הסל לא משתנה

#### תרחיש 4: סל ריק
- [ ] נכנס ל-`/cart`
- [ ] רואה הודעת "סל ריק"
- [ ] כפתור "Begin to create" עובד

#### תרחיש 5: מחיקת פריט
- [ ] לוחץ "Remove"
- [ ] אישור מוצג
- [ ] פריט נמחק
- [ ] מחיר מתעדכן

#### תרחיש 6: סימון/ביטול
- [ ] לוחץ על bookmark
- [ ] סטטוס משתנה
- [ ] מחיר מתעדכן

#### תרחיש 7: מעבר לתשלום
- [ ] לוחץ "Complete Purchase"
- [ ] אם אין פריטים פעילים - אזהרה
- [ ] אם יש - מעבר ל-checkout

## 🔍 בדיקות Browser

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome
- [ ] Mobile Safari

## 📱 בדיקות Responsive

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile Landscape

## 🎯 Performance

- [ ] בדוק זמני טעינה
- [ ] בדוק גודל bundle
- [ ] אופטימיזציה של תמונות
- [ ] lazy loading של קומפוננטים

## 🔐 אבטחה

- [ ] בדוק SQL injection
- [ ] בדוק XSS
- [ ] בדוק CSRF
- [ ] בדוק authorization
- [ ] בדוק input validation

## 📊 Analytics (אופציונלי)

- [ ] הוסף tracking ל-"Add to Cart"
- [ ] הוסף tracking ל-"Remove from Cart"
- [ ] הוסף tracking ל-"Checkout"
- [ ] הוסף tracking לשגיאות

## 🚀 Deployment

- [ ] בדוק ב-production mode
- [ ] בדוק environment variables
- [ ] בדוק API endpoints
- [ ] בדוק CORS settings

## 📈 Monitoring

- [ ] הוסף error logging
- [ ] הוסף performance monitoring
- [ ] הוסף user behavior tracking

---

## 🎯 סדר עדיפויות מומלץ:

### שבוע 1:
1. חיבור ל-API ✅
2. בדיקת המודלים ✅
3. ניהול Cart ID ✅
4. בדיקות בסיסיות ✅

### שבוע 2:
5. עמוד Checkout ✅
6. Platform ID ✅
7. בדיקות מקיפות ✅
8. תיקון באגים ✅

### שבוע 3:
9. שיפורים ב-UI ✅
10. תכונות נוספות ✅
11. אופטימיזציה ✅
12. תיעוד ✅

---

## 💡 טיפים

- התחל מהדברים הקריטיים
- בדוק כל שינוי לפני שממשיך
- שמור גיבויים
- עבוד ב-branch נפרד
- כתוב commit messages ברורים

**בהצלחה! 🚀**
