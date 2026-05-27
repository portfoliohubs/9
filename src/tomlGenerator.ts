import CONFIG from './config';

function esc(str: string): string {
  if (!str) return '""';
  return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
}

function arr(items: string[]): string {
  if (!items || items.length === 0) return '[]';
  return `[\n${items.map(i => `  ${esc(i)}`).join(',\n')}\n]`;
}

export interface TomlFormData {
  personalInfo: {
    fullName: string; fullNameAr: string;
    title: string; titleAr: string;
    graduationYear: string;
    university: string; universityAr: string;
  };
  contact: { phone: string; whatsapp: string; email: string; website: string; };
  profilePhoto: string | null;
  skills: {
    clinical: string[]; clinicalAr: string[];
    digital: string[]; digitalAr: string[];
    soft: string[]; softAr: string[];
  };
  timeline: Array<{ year: string; event: string; eventAr: string; }>;
  cases: Array<{
    category: string; categoryAr: string;
    title: string; titleAr: string;
    photo: string | null;
  }>;
}

export function generateToml(data: TomlFormData): string {
  const { personalInfo: p, contact: c, skills: s, timeline, cases } = data;
  const photo = data.profilePhoto || '';
  const { baseUrl, languageCode, defaultContentLanguage } = CONFIG.tomlTemplate;

  const groupedCases: Record<string, typeof cases> = {};
  cases.forEach(cs => {
    const key = cs.category || 'General';
    if (!groupedCases[key]) groupedCases[key] = [];
    groupedCases[key].push(cs);
  });

  let casesStr = '';
  Object.entries(groupedCases).forEach(([cat, list]) => {
    const catAr = list[0].categoryAr || cat;
    casesStr += `\n[[params.clinical_cases]]\nenabled = true\ncategory = ${esc(cat)}\ncategory_ar = ${esc(catAr)}\n`;
    list.forEach(cs => {
      casesStr += `\n[[params.clinical_cases.cases]]\nphoto = ${cs.photo ? esc(cs.photo) : '""'}\nalt = ${esc(cs.title)}\ndescription = ${esc(cs.title)}\nalt_ar = ${esc(cs.titleAr)}\ndescription_ar = ${esc(cs.titleAr)}\n`;
    });
  });

  let timelineEn = '';
  let timelineAr = '';
  timeline.forEach(m => {
    timelineEn += `\n[[params.education.timeline]]\nyear = ${esc(m.year)}\nevent = ${esc(m.event)}\n`;
    timelineAr += `\n[[params.ar.education.timeline]]\nyear = ${esc(m.year)}\nevent = ${esc(m.eventAr || m.event)}\n`;
  });

  return `baseURL = ${esc(baseUrl)}
languageCode = ${esc(languageCode)}
title = ${esc(p.fullName)}
defaultContentLanguage = ${esc(defaultContentLanguage)}

[params]

[params.hero]
name = ${esc(p.fullName)}
tagline = ${esc(p.title)}
graduation = ${esc(`Graduated ${p.graduationYear} - ${p.university}`)}
profile_image = ${esc(photo)}
profile_image_alt = ${esc(`Profile photo of ${p.fullName}`)}

[params.hero.current_position]
role = ${esc(p.title)}
clinic = ${esc(`${p.title} at ${p.university}`)}

[params.seo]
description = ${esc(`Professional portfolio of ${p.fullName}`)}
doctor_name_en = ${esc(p.fullName)}
doctor_name_ar = ${esc(p.fullNameAr)}
site_name = ${esc(p.fullName)}
og_image = ${esc(photo)}
favicon_image = ""
twitter_handle = ""
keywords = ["portfolio", "professional", ${esc(p.fullName)}]
keywords_ar = ["بورتفوليو", "احترافي", ${esc(p.fullNameAr)}]

[params.integrations]
google_search_console_verification = ${esc(CONFIG.seo.googleSearchConsoleVerification)}
google_analytics_measurement_id = ""

[params.skills]
clinical = ${arr(s.clinical)}
digital = ${arr(s.digital)}
soft = ${arr(s.soft)}

[params.education]
university = ${esc(p.university)}
graduation_year = ${esc(p.graduationYear)}

[params.education.master]
obtained = false
title = "Master in Oral Medicine"
year = ""

[params.education.phd]
obtained = false
title = "PhD in Dental Sciences"
year = ""
${timelineEn}
[params.contact]
phone = ${esc(c.phone)}
whatsapp = ${esc(c.whatsapp)}
email = ${esc(c.email)}
website = ${esc(c.website)}
instagram = ""
facebook = ""
linkedin = ""

[params.contact.location]
enabled = false
address = ""
${casesStr}
# Arabic Translations

[params.ar]

[params.ar.hero]
name = ${esc(p.fullNameAr)}
tagline = ${esc(p.titleAr)}
graduation = ${esc(`تخرج ${p.graduationYear} - ${p.universityAr}`)}
profile_image_alt = ${esc(`صورة الملف الشخصي لـ ${p.fullNameAr}`)}

[params.ar.hero.current_position]
role = ${esc(p.titleAr)}
clinic = ${esc(`${p.titleAr} في ${p.universityAr}`)}

[params.ar.skills]
clinical = ${arr(s.clinicalAr.length ? s.clinicalAr : s.clinical)}
digital = ${arr(s.digitalAr.length ? s.digitalAr : s.digital)}
soft = ${arr(s.softAr.length ? s.softAr : s.soft)}

[params.ar.education]
university = ${esc(p.universityAr)}
${timelineAr}
`;
}

export function downloadToml(content: string, filename = 'config.toml'): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
