import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Download, Send, Plus, X, Upload, Image as ImgIcon, Loader2 } from 'lucide-react';
import CONFIG from '../config';
import type { Lang } from '../config';
import { validateImage, processImageToWebP } from '../imageProcessor';
import { generateToml, downloadToml } from '../tomlGenerator';
import StepProgress from './StepProgress';
import SkillTagInput from './SkillTagInput';

type Section = 'personal' | 'contact' | 'photo' | 'skills' | 'timeline' | 'cases' | 'preview';
const SECTIONS: Section[] = ['personal', 'contact', 'photo', 'skills', 'timeline', 'cases', 'preview'];

interface Milestone { year: string; event: string; eventAr: string; }
interface ClinicalCase {
  category: string; categoryAr: string;
  customCategoryEn: string; customCategoryAr: string;
  title: string; titleAr: string;
  photos: string[];
  photoPreviews: string[];
}

interface FormData {
  fullName: string; fullNameAr: string;
  titleEn: string; titleAr: string;
  graduationYear: string;
  university: string; universityAr: string;
  phone: string; whatsapp: string; email: string; website: string;
  profilePhoto: string | null; profilePreview: string | null;
  clinicalSkills: string[]; clinicalSkillsAr: string[];
  digitalSkills: string[]; digitalSkillsAr: string[];
  softSkills: string[]; softSkillsAr: string[];
  timeline: Milestone[];
  cases: ClinicalCase[];
}

const init: FormData = {
  fullName: '', fullNameAr: '', titleEn: '', titleAr: '',
  graduationYear: '', university: '', universityAr: '',
  phone: '', whatsapp: '', email: '', website: '',
  profilePhoto: null, profilePreview: null,
  clinicalSkills: [], clinicalSkillsAr: [],
  digitalSkills: [], digitalSkillsAr: [],
  softSkills: [], softSkillsAr: [],
  timeline: [], cases: [],
};

interface Props { onBack: () => void; }

export default function PortfolioForm({ onBack }: Props) {
  const [lang] = useState<Lang>('en');
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(init);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');
  const [toml, setToml] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const profileRef = useRef<HTMLInputElement>(null);
  const casePhotoRef = useRef<HTMLInputElement>(null);
  const [activeCaseIdx, setActiveCaseIdx] = useState<number | null>(null);

  const t = CONFIG.ui[lang];
  const ex = CONFIG.examples;

  const set = (field: keyof FormData, val: unknown) =>
    setForm(p => ({ ...p, [field]: val }));

  const stepLabels = [
    t.nav.personal, t.nav.contact, t.nav.photo,
    t.nav.skills, t.nav.timeline, t.nav.cases, t.nav.preview,
  ];

  // Profile photo upload
  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const file = files[0];
    const v = await validateImage(file);
    if (!v.valid) { alert(v.error); return; }
    setLoading(true); setLoadMsg(t.messages.processing);
    try {
      const preview = URL.createObjectURL(file);
      const webp = await processImageToWebP(file);
      setForm(p => ({ ...p, profilePhoto: webp, profilePreview: preview }));
    } catch { alert(t.messages.error); }
    setLoading(false);
    if (profileRef.current) profileRef.current.value = '';
  };

  // Case photo upload — multiple
  const handleCasePhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeCaseIdx === null) return;
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setLoading(true); setLoadMsg(t.messages.processing);
    try {
      const webps: string[] = [];
      const previews: string[] = [];
      for (const file of files) {
        const v = await validateImage(file);
        if (!v.valid) { alert(v.error); continue; }
        webps.push(await processImageToWebP(file));
        previews.push(URL.createObjectURL(file));
      }
      setForm(p => {
        const cases = [...p.cases];
        cases[activeCaseIdx] = {
          ...cases[activeCaseIdx],
          photos: [...cases[activeCaseIdx].photos, ...webps],
          photoPreviews: [...cases[activeCaseIdx].photoPreviews, ...previews],
        };
        return { ...p, cases };
      });
    } catch { alert(t.messages.error); }
    setLoading(false);
    if (casePhotoRef.current) casePhotoRef.current.value = '';
  };

  const addMilestone = () =>
    setForm(p => ({ ...p, timeline: [...p.timeline, { year: '', event: '', eventAr: '' }] }));

  const updateMilestone = (i: number, field: keyof Milestone, v: string) =>
    setForm(p => { const t2 = [...p.timeline]; t2[i] = { ...t2[i], [field]: v }; return { ...p, timeline: t2 }; });

  const removeMilestone = (i: number) =>
    setForm(p => ({ ...p, timeline: p.timeline.filter((_, idx) => idx !== i) }));

  const addCase = () =>
    setForm(p => ({
      ...p, cases: [...p.cases, {
        category: '', categoryAr: '', customCategoryEn: '', customCategoryAr: '',
        title: '', titleAr: '', photos: [], photoPreviews: [],
      }],
    }));

  const updateCase = (i: number, field: keyof ClinicalCase, v: unknown) =>
    setForm(p => {
      const cases = [...p.cases];
      cases[i] = { ...cases[i], [field]: v };
      if (field === 'category') {
        const cat = CONFIG.caseCategories.find(c => c.id === v);
        if (cat) cases[i].categoryAr = cat.ar;
      }
      return { ...p, cases };
    });

  const removeCase = (i: number) =>
    setForm(p => ({ ...p, cases: p.cases.filter((_, idx) => idx !== i) }));

  const removeCasePhoto = (caseIdx: number, photoIdx: number) =>
    setForm(p => {
      const cases = [...p.cases];
      cases[caseIdx] = {
        ...cases[caseIdx],
        photos: cases[caseIdx].photos.filter((_, i) => i !== photoIdx),
        photoPreviews: cases[caseIdx].photoPreviews.filter((_, i) => i !== photoIdx),
      };
      return { ...p, cases };
    });

  const handleGeneratePreview = async () => {
    setLoading(true); setLoadMsg(t.messages.generating);
    try {
      const processedCases = form.cases.flatMap(c =>
        (c.photos.length ? c.photos : [null]).map((photo) => ({
          category: c.category === 'custom' ? c.customCategoryEn : (CONFIG.caseCategories.find(cat => cat.id === c.category)?.en || c.category),
          categoryAr: c.category === 'custom' ? c.customCategoryAr : c.categoryAr,
          title: c.title,
          titleAr: c.titleAr,
          photo,
        }))
      );
      const result = generateToml({
        personalInfo: {
          fullName: form.fullName, fullNameAr: form.fullNameAr,
          title: form.titleEn, titleAr: form.titleAr,
          graduationYear: form.graduationYear,
          university: form.university, universityAr: form.universityAr,
        },
        contact: { phone: form.phone, whatsapp: form.whatsapp, email: form.email, website: form.website },
        profilePhoto: form.profilePhoto,
        skills: {
          clinical: form.clinicalSkills, clinicalAr: form.clinicalSkillsAr,
          digital: form.digitalSkills, digitalAr: form.digitalSkillsAr,
          soft: form.softSkills, softAr: form.softSkillsAr,
        },
        timeline: form.timeline,
        cases: processedCases,
      });
      setToml(result);
      setShowPreview(true);
      setStep(SECTIONS.indexOf('preview'));
    } catch { alert(t.messages.error); }
    setLoading(false);
  };

  const handleWhatsApp = () => {
    const num = CONFIG.whatsapp.destinationNumber;
    const msg = encodeURIComponent(CONFIG.whatsapp.message);
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank');
    downloadToml(toml, `${form.fullName.replace(/\s+/g, '_')}_config.toml`);
  };

  const inputCls = "input-field";
  const labelCls = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";
  const hintCls = "text-xs text-slate-400 dark:text-slate-500 mt-1";

  const renderSection = () => {
    switch (SECTIONS[step]) {

      case 'personal': return (
        <div className="space-y-5">
          <h2 className="form-section-title">{t.nav.personal}</h2>
          <div>
            <label className={labelCls}>{t.form.fullName} <span className="text-red-400">*</span></label>
            <input className={inputCls} placeholder={ex.fullName} value={form.fullName} onChange={e => set('fullName', e.target.value)} />
            <p className={hintCls}>{t.form.fullNameExample}</p>
          </div>
          <div>
            <label className={labelCls}>{t.form.fullNameAr}</label>
            <input className={inputCls} placeholder={ex.fullNameAr} value={form.fullNameAr} onChange={e => set('fullNameAr', e.target.value)} dir="rtl" />
            <p className={hintCls}>{t.form.fullNameArExample}</p>
          </div>
          <div>
            <label className={labelCls}>{t.form.titleEn} <span className="text-red-400">*</span></label>
            <input className={inputCls} placeholder={ex.titleEn} value={form.titleEn} onChange={e => set('titleEn', e.target.value)} />
            <p className={hintCls}>{t.form.titleEnExample}</p>
          </div>
          <div>
            <label className={labelCls}>{t.form.titleAr}</label>
            <input className={inputCls} placeholder={ex.titleAr} value={form.titleAr} onChange={e => set('titleAr', e.target.value)} dir="rtl" />
            <p className={hintCls}>{t.form.titleArExample}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t.form.graduationYear}</label>
              <input className={inputCls} placeholder={ex.graduationYear} value={form.graduationYear} onChange={e => set('graduationYear', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>{t.form.university}</label>
            <input className={inputCls} placeholder={ex.university} value={form.university} onChange={e => set('university', e.target.value)} />
            <p className={hintCls}>{t.form.universityExample}</p>
          </div>
          <div>
            <label className={labelCls}>{t.form.universityAr}</label>
            <input className={inputCls} placeholder={ex.universityAr} value={form.universityAr} onChange={e => set('universityAr', e.target.value)} dir="rtl" />
          </div>
        </div>
      );

      case 'contact': return (
        <div className="space-y-5">
          <h2 className="form-section-title">{t.nav.contact}</h2>
          {[
            { label: t.form.phone, key: 'phone' as const, ph: ex.phone, ex2: t.form.phoneExample },
            { label: t.form.whatsapp, key: 'whatsapp' as const, ph: ex.whatsapp, ex2: t.form.whatsappExample },
            { label: t.form.email, key: 'email' as const, ph: ex.email, ex2: t.form.emailExample },
            { label: t.form.website, key: 'website' as const, ph: ex.website, ex2: t.form.websiteExample },
          ].map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input className={inputCls} placeholder={f.ph} value={form[f.key]} onChange={e => set(f.key, e.target.value)} />
              <p className={hintCls}>{f.ex2}</p>
            </div>
          ))}
        </div>
      );

      case 'photo': return (
        <div className="space-y-5">
          <h2 className="form-section-title">{t.nav.photo}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.form.profilePhotoHint}</p>
          <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
          {form.profilePreview ? (
            <div className="space-y-3">
              <div className="w-full max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                <img src={form.profilePreview} alt="Profile" className="w-full h-auto object-contain" />
              </div>
              <button onClick={() => profileRef.current?.click()} className="btn-secondary w-full py-2.5 text-sm">
                {t.form.changePhoto}
              </button>
            </div>
          ) : (
            <button
              onClick={() => profileRef.current?.click()}
              className="w-full py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <ImgIcon size={32} />
              <span className="text-sm font-medium">{t.form.uploadPhoto}</span>
              <span className="text-xs">{t.form.profilePhotoHint}</span>
            </button>
          )}
        </div>
      );

      case 'skills': return (
        <div className="space-y-7">
          <h2 className="form-section-title">{t.nav.skills}</h2>
          <SkillTagInput
            label={t.form.clinicalSkillsLabel}
            placeholder={t.form.clinicalSkillPlaceholder}
            addLabel={t.form.addSkill}
            items={form.clinicalSkills}
            onChange={v => set('clinicalSkills', v)}
          />
          <SkillTagInput
            label={t.form.clinicalSkillsLabel + ' (Arabic)'}
            placeholder="مثال: جراحة الفم"
            addLabel={t.form.addSkill}
            items={form.clinicalSkillsAr}
            onChange={v => set('clinicalSkillsAr', v)}
          />
          <SkillTagInput
            label={t.form.digitalSkillsLabel}
            placeholder={t.form.digitalSkillPlaceholder}
            addLabel={t.form.addSkill}
            items={form.digitalSkills}
            onChange={v => set('digitalSkills', v)}
          />
          <SkillTagInput
            label={t.form.digitalSkillsLabel + ' (Arabic)'}
            placeholder="مثال: التصوير الطبي"
            addLabel={t.form.addSkill}
            items={form.digitalSkillsAr}
            onChange={v => set('digitalSkillsAr', v)}
          />
          <SkillTagInput
            label={t.form.softSkillsLabel}
            placeholder={t.form.softSkillPlaceholder}
            addLabel={t.form.addSkill}
            items={form.softSkills}
            onChange={v => set('softSkills', v)}
          />
          <SkillTagInput
            label={t.form.softSkillsLabel + ' (Arabic)'}
            placeholder="مثال: التواصل مع المرضى"
            addLabel={t.form.addSkill}
            items={form.softSkillsAr}
            onChange={v => set('softSkillsAr', v)}
          />
        </div>
      );

      case 'timeline': return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="form-section-title">{t.nav.timeline}</h2>
            <button onClick={addMilestone} className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm">
              <Plus size={15} /> {t.form.addMilestone}
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.form.timelineHint}</p>
          {form.timeline.length === 0 && (
            <div className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm">
              No milestones yet. Click "Add Milestone" to start.
            </div>
          )}
          <div className="space-y-4">
            {form.timeline.map((m, i) => (
              <div key={i} className="card p-4 space-y-3 relative">
                <button onClick={() => removeMilestone(i)} className="absolute top-3 right-3 text-slate-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.form.year}</label>
                    <input className={inputCls} placeholder={ex.timelineYear} value={m.year} onChange={e => updateMilestone(i, 'year', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.form.eventEn}</label>
                    <input className={inputCls} placeholder={ex.timelineEvent} value={m.event} onChange={e => updateMilestone(i, 'event', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.form.eventAr}</label>
                  <input className={inputCls} placeholder={ex.timelineEventAr} value={m.eventAr} onChange={e => updateMilestone(i, 'eventAr', e.target.value)} dir="rtl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'cases': return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="form-section-title">{t.nav.cases}</h2>
            <button onClick={addCase} className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm">
              <Plus size={15} /> {t.form.addCase}
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.form.casesHint}</p>
          <input
            ref={casePhotoRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleCasePhotos}
          />
          {form.cases.length === 0 && (
            <div className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm">
              No cases yet. Click "Add Case" to start.
            </div>
          )}
          <div className="space-y-4">
            {form.cases.map((c, i) => (
              <div key={i} className="card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Case {i + 1}</span>
                  <button onClick={() => removeCase(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X size={16} />
                  </button>
                </div>
                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.form.category}</label>
                  <select
                    value={c.category}
                    onChange={e => updateCase(i, 'category', e.target.value)}
                    className={inputCls}
                  >
                    <option value="">{t.form.selectCategory}</option>
                    {CONFIG.caseCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.en}</option>
                    ))}
                  </select>
                </div>
                {c.category === 'custom' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.form.customCategoryEn}</label>
                      <input className={inputCls} placeholder={ex.customCategoryEn} value={c.customCategoryEn} onChange={e => updateCase(i, 'customCategoryEn', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.form.customCategoryAr}</label>
                      <input className={inputCls} placeholder={ex.customCategoryAr} value={c.customCategoryAr} onChange={e => updateCase(i, 'customCategoryAr', e.target.value)} dir="rtl" />
                    </div>
                  </div>
                )}
                {/* Titles */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.form.caseTitleEn}</label>
                  <input className={inputCls} placeholder={ex.caseTitleEn} value={c.title} onChange={e => updateCase(i, 'title', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{t.form.caseTitleAr}</label>
                  <input className={inputCls} placeholder={ex.caseTitleAr} value={c.titleAr} onChange={e => updateCase(i, 'titleAr', e.target.value)} dir="rtl" />
                </div>
                {/* Photos */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">{t.form.uploadCasePhoto}</label>
                  {c.photoPreviews.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {c.photoPreviews.map((pr, pi) => (
                        <div key={pi} className="relative">
                          <img
                            src={pr}
                            alt={`Case ${i + 1} photo ${pi + 1}`}
                            className="w-20 h-20 object-contain rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                          />
                          <button
                            onClick={() => removeCasePhoto(i, pi)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => { setActiveCaseIdx(i); setTimeout(() => casePhotoRef.current?.click(), 50); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-slate-500 dark:text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                  >
                    <Upload size={15} />
                    {c.photoPreviews.length > 0 ? `Add More Photos (${c.photoPreviews.length} added)` : t.form.uploadCasePhoto}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'preview': return (
        <div className="space-y-5">
          <h2 className="form-section-title">{t.preview.title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.preview.subtitle}</p>
          {!showPreview ? (
            <button onClick={handleGeneratePreview} className="btn-primary w-full py-3">
              {t.buttons.preview}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <pre className="text-xs font-mono text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap max-h-64">
                  {toml.slice(0, 1500)}{toml.length > 1500 ? '\n... (truncated for preview)' : ''}
                </pre>
              </div>
              <button onClick={() => downloadToml(toml, `${form.fullName.replace(/\s+/g, '_')}_config.toml`)} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                <Download size={18} /> {t.buttons.downloadToml}
              </button>
              <button onClick={handleWhatsApp} className="btn-success w-full py-3 flex items-center justify-center gap-2">
                <Send size={18} /> {t.buttons.sendWhatsApp}
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col">
      {/* Step progress */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 py-2">
        <StepProgress steps={stepLabels} current={step} onStep={i => setStep(i)} />
      </div>

      {/* Form content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 size={36} className="animate-spin text-blue-500" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">{loadMsg}</p>
          </div>
        ) : renderSection()}
      </div>

      {/* Nav buttons */}
      {!loading && (
        <div className="sticky bottom-0 border-t border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
            <button
              onClick={() => step === 0 ? onBack() : setStep(s => s - 1)}
              className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm"
            >
              <ArrowLeft size={16} />
              {step === 0 ? t.buttons.backHome : t.buttons.prev}
            </button>
            {step < SECTIONS.length - 1 && (
              <button
                onClick={() => step === SECTIONS.length - 2 ? (handleGeneratePreview(), setStep(s => s + 1)) : setStep(s => s + 1)}
                className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                {t.buttons.next} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
