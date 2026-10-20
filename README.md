# DSH Plugin Persian Vazirmatn (فونت وزیرمتن و حفاظت ریاضی برای دیپ‌سیک هارنس)

<p align="center">
  <img src="assets/icon.svg" width="100" height="100" alt="DSH Persian Vazirmatn Logo" />
</p>

<p align="center">
  <b>بهینه‌سازی تایپوگرافی فارسی با فونت وزیرمتن و حفاظت کامل از فرمول‌های ریاضی و لاتک در DeepSeek Harness</b><br>
  <i>Persian Vazirmatn typography with Claude-style English font preservation & LaTeX / Computer Modern math protection</i>
</p>

<p align="center">
  <a href="#ویژگی‌ها-features">ویژگی‌ها</a> •
  <a href="#روش-نصب-installation">روش نصب</a> •
  <a href="#نحوه-کارکرد-how-it-works">نحوه کارکرد</a> •
  <a href="#توسعه-و-بیلد-development">توسعه و بیلد</a> •
  <a href="#مجوز-license">مجوز</a>
</p>

---

## معرفی · Overview

این افزونه برای کاربران فارسی‌زبان نرم‌افزار **DeepSeek Harness (DSH)** و به‌ویژه کاربرانی که از تم محبوب **dsh-claude-style** استفاده می‌کنند طراحی شده است. 

در حالت عادی، یا متن‌های فارسی با فونت‌های پیش‌فرض و ناخوانای سیستمی نمایش داده می‌شوند، یا اگر فونت فارسی به کل صفحه اعمال شود، فونت جذاب انگلیسی (Inter / Anthropic Sans / JetBrains Mono) و فرمول‌های ریاضی LaTeX خراب می‌شوند. 

این افزونه این مشکل را با معماری استاندارد وب و `unicode-range` به‌طور ریشه‌ای حل می‌کند:
1. **فقط و فقط حروف و کاراکترهای فارسی** با فونت مدرن و استاندارد **وزیرمتن (Vazirmatn)** رندر می‌شوند.
2. **متون انگلیسی، اعداد لاتین، کدهای برنامه‌نویسی و المان‌های محیطی** دقیقاً از همان فونت‌های اختصاصی `dsh-claude-style` استفاده می‌کنند.
3. **فرمول‌های ریاضی و LaTeX (محیط KaTeX)** به‌طور اختصاصی ایزوله شده و از فونت‌های استاندارد **Computer Modern** و **Latin Modern Math** در جهت چپ‌به‌راست (LTR) استفاده می‌کنند.

---

## ویژگی‌ها · Features

- ✨ **فونت وزیرمتن متغیر (Variable WOFF2):** استفاده از نسخه کامل و استاندارد Vazirmatn با پشتیبانی از تمامی ضخامت‌ها (از Thin 100 تا Black 900).
- 🎯 **تفکیک هوشمند زبانی با `unicode-range`:** حروف انگلیسی و کاراکترهای لاتین به هیچ وجه دست‌نخورده باقی می‌مانند و فونت Claude/Inter حفظ می‌شود.
- 📐 **حفاظت کامل از LaTeX و KaTeX:** تمام فرمول‌های درون خطی (`$..$`) و بلوکی (`$$..$$`) از فونت‌های استاندارد `KaTeX_Main`، `KaTeX_Math` و `Computer Modern` استفاده می‌کنند و تحت تأثیر راست‌چین شدن قرار نمی‌گیرند.
- 🚀 **۱۰۰٪ آفلاین و بدون وابستگی به اینترنت:** فونت به صورت بهینه درون افزونه جای‌گذاری شده و نیازی به اینترنت یا CDN ندارد.
- 🔄 **پشتیبانی از نیم‌فاصله (ZWNJ):** کاراکترهای `U+200C` و ساختار ترکیبی فارسی به صورت کامل و استاندارد رندر می‌شوند.
- ⚡ **سازگار با DSH Market و HMR:** قابلیت فعال/غیرفعال‌سازی لحظه‌ای بدون از کار افتادن رابط کاربری.

---

## روش نصب · Installation

### روش ۱: نصب از طریق رابط کاربری DSH (تنظیمات یا Plugins)
نام پکیج زیر را در بخش **Settings → Plugins → Add Plugin** وارد کنید:

```text
dsh-plugin-persian-vazirmatn
```

یا مستقیماً با آدرس گیت‌هاب:

```text
github:Abulfadl-Ahmadi/dsh-plugin-persian-vazirmatn#v1.0.0
```

### روش ۲: نصب با خط فرمان (DSH CLI)
ترمینال را باز کرده و دستور زیر را اجرا کنید:

```bash
dsh plugin --profile desktop add dsh-plugin-persian-vazirmatn
```

### روش ۳: نصب در مارکت DSH (dshmarket)
پس از ثبت در کاتالوگ افزونه‌های DSH، کافی است در تب **Plugin Market** عبارت `persian` یا `vazirmatn` را جستجو کرده و دکمه **Install** را بزنید.

---

## نحوه کارکرد · How It Works

### ۱. تفکیک فونت فارسی و انگلیسی
افزونه با استفاده از استاندارد CSS `@font-face` و بازه یونیکد اختصاصی خط فارسی و عربی پیکربندی شده است:

```css
@font-face {
  font-family: 'Vazirmatn-DSH-Persian';
  src: url(...) format('woff2');
  font-weight: 100 900;
  unicode-range: U+0600-06FF, U+0750-077F, U+0870-089F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF, U+200C-200F;
}
```

هنگامی که این فونت در ابتدای لیست فونت‌های DSH و `dsh-claude-style` قرار می‌گیرد:
- موتور مرورگر (Chromium) برای کاراکترهای انگلیسی چون در این بازه نیستند، فونت اول را نادیده گرفته و بلافاصله به فونت بعدی یعنی `Claude Style Inter` یا `JetBrains Mono` می‌رود.
- برای کاراکترهای فارسی چون در بازه یونیکد هستند، از فونت وزیرمتن استفاده می‌کند.

### ۲. حفاظت از فرمول‌های ریاضی (LaTeX & KaTeX)
کلاس‌های مربوط به رندرر ریاضی KaTeX از موروثی شدن فونت‌های عمومی معاف شده و با اولویت بالا روی فونت‌های استاندارد دانلد کنوت (Computer Modern / Latin Modern) تنظیم می‌شوند:

```css
.katex,
.katex *,
math {
  font-family: KaTeX_Math, KaTeX_Main, "Latin Modern Math", "Computer Modern", serif !important;
  direction: ltr !important;
  text-align: left !important;
}
```

---

## توسعه و بیلد · Development

برای بیلد مجدد اسکریپت کلاینت و اجرای تست‌ها:

```bash
# بیلد فایل کلاینت از فونت WOFF2
npm run build

# اجرای تست‌های صحت ماژول
npm test

# ساخت پکیج فشرده جهت انتشار
npm pack
```

---

## مجوزها · Licenses

- کد افزونه: تحت مجوز [MIT License](LICENSE).
- فونت وزیرمتن: طراحی شده توسط صابر راستی‌کردار، تحت مجوز [SIL Open Font License 1.1](OFL.txt).
