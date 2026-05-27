// ============================================================
// PORTFOLIOHUBS - CENTRAL CONFIGURATION FILE
// Edit ONLY this file to change any text, labels, placeholders,
// brand info, WhatsApp numbers, SEO data, and all other content.
// ============================================================

const CONFIG = {

  // ----------------------------------------------------------
  // BRAND
  // ----------------------------------------------------------
  brand: {
    name: "PortfolioHubs",
    slogan: "الاسنانجى لازم يتدلع",
    logoUrl: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=80",
    tagline: "Professional Dental Portfolio & CV Builder",
    description: "Create your professional dental portfolio that appears on Google Search, or generate a stunning PDF CV — free and easy.",
  },

  // ----------------------------------------------------------
  // SEO & META
  // ----------------------------------------------------------
  seo: {
    googleSearchConsoleVerification: "6VtKNI5qnSYsfjCTBMfnm9PuZjjR7aYh6crmofpS8yw",
    keywords: [
      "portfoliohubs", "dental cv", "cv maker", "cv pdf maker",
      "dental portfolio", "dentist portfolio", "dental cv maker",
      "free cv maker", "professional dental cv", "dental portfolio builder",
      "cv pdf dental", "dentist cv maker", "oral care portfolio",
      "طبيب أسنان", "سيرة ذاتية طبيب أسنان", "بورتفوليو طبيب أسنان",
    ],
    ogImage: "https://images.pexels.com/photos/3845810/pexels-photo-3845810.jpeg?auto=compress&cs=tinysrgb&w=1200",
    twitterHandle: "@portfoliohubs",
    author: "PortfolioHubs",
    canonicalBase: "https://portfoliohubs.github.io/portfolio-data-collector/",
  },

  // ----------------------------------------------------------
  // WHATSAPP
  // ----------------------------------------------------------
  whatsapp: {
    destinationNumber: "201271476215",
    message: "Here is my portfolio configuration file from PortfolioHubs",
    cvMessage: "I just created my professional CV using PortfolioHubs!",
  },

  // ----------------------------------------------------------
  // TOML TEMPLATE
  // ----------------------------------------------------------
  tomlTemplate: {
    baseUrl: "https://portfoliohubs.github.io/MICKY/",
    languageCode: "en-us",
    defaultContentLanguage: "en",
  },

  // ----------------------------------------------------------
  // FORM FIELD EXAMPLES / PLACEHOLDERS
  // All placeholder/example values live here — change freely.
  // ----------------------------------------------------------
  examples: {
    fullName: "Dr. John Doe",
    fullNameAr: "د. محمد أحمد",
    titleEn: "Internship Dentist",
    titleAr: "طبيب أسنان – امتياز",
    graduationYear: "2025",
    university: "Faculty of Dentistry, Cairo University",
    universityAr: "كلية طب الأسنان، جامعة القاهرة",
    phone: "+201234567890",
    whatsapp: "+201234567890",
    email: "dr.john@example.com",
    website: "https://portfoliohubs.github.io/yourname/",
    clinicalSkillExample: "Oral Surgery",
    digitalSkillExample: "Dental Photography",
    softSkillExample: "Patient Communication",
    timelineYear: "2020",
    timelineEvent: "Started Faculty of Dentistry",
    timelineEventAr: "بدأ كلية طب الأسنان",
    caseTitleEn: "Class IV Composite Restoration",
    caseTitleAr: "ترميم مركب من الدرجة الرابعة",
    customCategoryEn: "Orthodontics",
    customCategoryAr: "تقويم الأسنان",
  },

  // ----------------------------------------------------------
  // CLINICAL CASE CATEGORIES
  // ----------------------------------------------------------
  caseCategories: [
    { id: "operative", en: "Operative & Esthetics", ar: "الحشو العادي والتجميلي" },
    { id: "prosthesis_fixed", en: "Fixed Prosthodontics", ar: "تركيبات ثابتة" },
    { id: "prosthesis_removable", en: "Removable Prosthodontics", ar: "تركيبات متحركة" },
    { id: "endodontics", en: "Endodontic Treatment", ar: "علاج الجذور (حشو العصب)" },
    { id: "oral_surgery", en: "Oral Surgery", ar: "جراحة الفم" },
    { id: "periodontics", en: "Periodontics", ar: "أمراض اللثة" },
    { id: "orthodontics", en: "Orthodontics", ar: "تقويم الأسنان" },
    { id: "pediatric", en: "Pediatric Dentistry", ar: "طب أسنان الأطفال" },
    { id: "implant", en: "Dental Implants", ar: "زراعة الأسنان" },
    { id: "cosmetic", en: "Cosmetic Dentistry", ar: "تجميل الأسنان" },
    { id: "composite_endo", en: "Composite After Endo", ar: "ترميم مركب بعد حشو العصب" },
    { id: "custom", en: "Other (Custom)", ar: "أخرى (مخصص)" },
  ],

  // ----------------------------------------------------------
  // UI STRINGS  —  English
  // ----------------------------------------------------------
  ui: {
    en: {
      brand: {
        slogan: "الاسنانجى لازم يتدلع",
        tagline: "Professional Dental Portfolio & CV Builder",
      },
      home: {
        welcomeTitle: "Welcome to PortfolioHubs",
        welcomeSubtitle: "Choose your path below",
        portfolioButtonTitle: "Portfolio on Google Search",
        portfolioButtonSubtitle: "Get found professionally — create a portfolio that ranks on Google",
        cvButtonTitle: "CV PDF Maker (Free)",
        cvButtonSubtitle: "Generate a stunning dental CV and download as PDF instantly",
        footerNote: "Trusted by dental professionals · Free to use · Mobile friendly",
      },
      nav: {
        home: "Home",
        personal: "Personal Info",
        contact: "Contact",
        photo: "Profile Photo",
        skills: "Skills",
        timeline: "Career Timeline",
        cases: "Clinical Cases",
        preview: "Preview & Submit",
      },
      form: {
        // Personal
        fullName: "Full Name (English)",
        fullNameExample: "e.g. Dr. John Doe",
        fullNameAr: "Full Name (Arabic)",
        fullNameArExample: "مثال: د. محمد أحمد",
        titleEn: "Professional Title (English)",
        titleEnExample: "e.g. Internship Dentist",
        titleAr: "Professional Title (Arabic)",
        titleArExample: "مثال: طبيب أسنان – امتياز",
        graduationYear: "Graduation Year",
        graduationYearExample: "e.g. 2025",
        university: "University (English)",
        universityExample: "e.g. Faculty of Dentistry, Cairo University",
        universityAr: "University (Arabic)",
        universityArExample: "مثال: كلية طب الأسنان، جامعة القاهرة",
        // Contact
        phone: "Phone Number",
        phoneExample: "e.g. +201234567890",
        whatsapp: "WhatsApp Number",
        whatsappExample: "e.g. +201234567890",
        email: "Email Address",
        emailExample: "e.g. dr.john@example.com",
        website: "Your Link (Professional Page — Optional)",
        websiteExample: "e.g. https://portfoliohubs.github.io/yourname/",
        // Photo
        profilePhoto: "Profile Photo",
        profilePhotoHint: "Clear professional photo recommended — no size limit",
        uploadPhoto: "Upload Profile Photo",
        changePhoto: "Change Photo",
        // Skills
        clinicalSkillsLabel: "Clinical Skills",
        clinicalSkillsAdd: "Add Clinical Skill",
        clinicalSkillPlaceholder: "e.g. Oral Surgery",
        digitalSkillsLabel: "Digital Skills",
        digitalSkillsAdd: "Add Digital Skill",
        digitalSkillPlaceholder: "e.g. Dental Photography",
        softSkillsLabel: "Soft Skills",
        softSkillsAdd: "Add Soft Skill",
        softSkillPlaceholder: "e.g. Patient Communication",
        addSkill: "Add",
        removeSkill: "Remove",
        // Timeline
        timelineLabel: "Career Timeline",
        timelineHint: "Add milestones — education, certifications, employment",
        addMilestone: "Add Milestone",
        year: "Year",
        yearExample: "e.g. 2020",
        eventEn: "Event (English)",
        eventEnExample: "e.g. Started Faculty of Dentistry",
        eventAr: "Event (Arabic)",
        eventArExample: "مثال: بدأ كلية طب الأسنان",
        // Cases
        casesLabel: "Clinical Cases",
        casesHint: "Add your clinical cases with photos — no limit",
        addCase: "Add Case",
        category: "Category",
        selectCategory: "Select a category...",
        customCategoryEn: "Custom Category (English)",
        customCategoryEnExample: "e.g. Orthodontics",
        customCategoryAr: "Custom Category (Arabic)",
        customCategoryArExample: "مثال: تقويم الأسنان",
        caseTitleEn: "Case Title (English)",
        caseTitleEnExample: "e.g. Class IV Composite Restoration",
        caseTitleAr: "Case Title (Arabic)",
        caseTitleArExample: "مثال: ترميم مركب من الدرجة الرابعة",
        uploadCasePhoto: "Upload Case Photo(s)",
        changeCasePhoto: "Change Photo",
        removeCase: "Remove",
      },
      buttons: {
        next: "Next",
        prev: "Previous",
        preview: "Preview Config File",
        downloadToml: "Download TOML File",
        sendWhatsApp: "Send via WhatsApp",
        reset: "Reset Form",
        backHome: "Back to Home",
      },
      preview: {
        title: "Preview Your Config File",
        subtitle: "Review your data before downloading or sending",
        note: "Your TOML configuration file is ready below",
      },
      messages: {
        processing: "Processing image...",
        generating: "Generating your file...",
        error: "Something went wrong. Please try again.",
        invalidFile: "Invalid file. Use JPG, PNG, WebP, or GIF.",
      },
    },

    // --------------------------------------------------------
    // UI STRINGS  —  Arabic
    // --------------------------------------------------------
    ar: {
      brand: {
        slogan: "الاسنانجى لازم يتدلع",
        tagline: "باني البورتفوليو والسيرة الذاتية الاحترافي لطبيب الأسنان",
      },
      home: {
        welcomeTitle: "مرحباً بك في PortfolioHubs",
        welcomeSubtitle: "اختر مسارك أدناه",
        portfolioButtonTitle: "بورتفوليو على جوجل",
        portfolioButtonSubtitle: "احصل على ظهور احترافي – أنشئ بورتفوليو يظهر في نتائج البحث",
        cvButtonTitle: "صانع السيرة الذاتية PDF (مجاناً)",
        cvButtonSubtitle: "أنشئ سيرة ذاتية احترافية وحمّلها كـ PDF فوراً",
        footerNote: "موثوق به من قِبل أطباء الأسنان · مجاني · متوافق مع الجوال",
      },
      nav: {
        home: "الرئيسية",
        personal: "المعلومات الشخصية",
        contact: "بيانات الاتصال",
        photo: "الصورة الشخصية",
        skills: "المهارات",
        timeline: "الخط الزمني",
        cases: "الحالات السريرية",
        preview: "معاينة وإرسال",
      },
      form: {
        fullName: "الاسم الكامل (بالإنجليزية)",
        fullNameExample: "مثال: Dr. John Doe",
        fullNameAr: "الاسم الكامل (بالعربية)",
        fullNameArExample: "مثال: د. محمد أحمد",
        titleEn: "المسمى الوظيفي (بالإنجليزية)",
        titleEnExample: "مثال: Internship Dentist",
        titleAr: "المسمى الوظيفي (بالعربية)",
        titleArExample: "مثال: طبيب أسنان – امتياز",
        graduationYear: "سنة التخرج",
        graduationYearExample: "مثال: 2025",
        university: "الجامعة (بالإنجليزية)",
        universityExample: "مثال: Faculty of Dentistry, Cairo University",
        universityAr: "الجامعة (بالعربية)",
        universityArExample: "مثال: كلية طب الأسنان، جامعة القاهرة",
        phone: "رقم الهاتف",
        phoneExample: "مثال: +201234567890",
        whatsapp: "رقم الواتساب",
        whatsappExample: "مثال: +201234567890",
        email: "البريد الإلكتروني",
        emailExample: "مثال: dr.john@example.com",
        website: "رابطك (صفحتك الاحترافية – اختياري)",
        websiteExample: "مثال: https://portfoliohubs.github.io/yourname/",
        profilePhoto: "الصورة الشخصية",
        profilePhotoHint: "صورة احترافية واضحة – لا يوجد حد لحجم الملف",
        uploadPhoto: "رفع الصورة الشخصية",
        changePhoto: "تغيير الصورة",
        clinicalSkillsLabel: "المهارات السريرية",
        clinicalSkillsAdd: "أضف مهارة سريرية",
        clinicalSkillPlaceholder: "مثال: جراحة الفم",
        digitalSkillsLabel: "المهارات الرقمية",
        digitalSkillsAdd: "أضف مهارة رقمية",
        digitalSkillPlaceholder: "مثال: التصوير الطبي",
        softSkillsLabel: "المهارات الشخصية",
        softSkillsAdd: "أضف مهارة شخصية",
        softSkillPlaceholder: "مثال: التواصل مع المرضى",
        addSkill: "إضافة",
        removeSkill: "حذف",
        timelineLabel: "الخط الزمني المهني",
        timelineHint: "أضف معالم مسيرتك – تعليم، شهادات، عمل",
        addMilestone: "إضافة معلم",
        year: "السنة",
        yearExample: "مثال: 2020",
        eventEn: "الحدث (بالإنجليزية)",
        eventEnExample: "مثال: Started Faculty of Dentistry",
        eventAr: "الحدث (بالعربية)",
        eventArExample: "مثال: بدأ كلية طب الأسنان",
        casesLabel: "الحالات السريرية",
        casesHint: "أضف حالاتك السريرية مع الصور – لا يوجد حد",
        addCase: "إضافة حالة",
        category: "التصنيف",
        selectCategory: "اختر تصنيفاً...",
        customCategoryEn: "تصنيف مخصص (بالإنجليزية)",
        customCategoryEnExample: "مثال: Orthodontics",
        customCategoryAr: "تصنيف مخصص (بالعربية)",
        customCategoryArExample: "مثال: تقويم الأسنان",
        caseTitleEn: "عنوان الحالة (بالإنجليزية)",
        caseTitleEnExample: "مثال: Class IV Composite Restoration",
        caseTitleAr: "عنوان الحالة (بالعربية)",
        caseTitleArExample: "مثال: ترميم مركب من الدرجة الرابعة",
        uploadCasePhoto: "رفع صورة الحالة",
        changeCasePhoto: "تغيير الصورة",
        removeCase: "حذف",
      },
      buttons: {
        next: "التالي",
        prev: "السابق",
        preview: "معاينة ملف الإعدادات",
        downloadToml: "تحميل ملف TOML",
        sendWhatsApp: "إرسال عبر واتساب",
        reset: "إعادة تعيين",
        backHome: "العودة للرئيسية",
      },
      preview: {
        title: "معاينة ملف الإعدادات",
        subtitle: "راجع بياناتك قبل التحميل أو الإرسال",
        note: "ملف TOML جاهز أدناه",
      },
      messages: {
        processing: "جاري معالجة الصورة...",
        generating: "جاري إنشاء ملفك...",
        error: "حدث خطأ. الرجاء المحاولة مرة أخرى.",
        invalidFile: "ملف غير صالح. استخدم JPG أو PNG أو WebP أو GIF.",
      },
    },
  },
} as const;

export default CONFIG;
export type Lang = "en" | "ar";
