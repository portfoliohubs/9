import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, Download, Plus, X, Upload, Image as ImgIcon, Loader2 } from 'lucide-react';
import CONFIG from '../config';
import { validateImage, processImageToWebP } from '../imageProcessor';
import { generateCVPdf } from '../pdfGenerator';
import StepProgress from './StepProgress';
import SkillTagInput from './SkillTagInput';

type Section = 'personal' | 'contact' | 'photo' | 'skills' | 'timeline' | 'cases' | 'generate';
const SECTIONS: Section[] = ['personal', 'contact', 'photo', 'skills', 'timeline', 'cases', 'generate'];

interface Milestone { year: string; event: string; }
interface ClinicalCase {
  category: string; customCategoryEn: string;
  title: string;
  photos: string[];
  photoPreviews: string[];
}

interface FormData {
  fullName: string; titleEn: string; graduationYear: string; university: string;
  phone: string; whatsapp: string; email: string; website: string;
  profilePhoto: string | null; profilePreview: string | null;
  clinicalSkills: string[];
  digitalSkills: string[];
  softSkills: string[];
  timeline: Milestone[];
  cases: ClinicalCase[];
}

const init: FormData = {
  fullName: '', titleEn: '', graduationYear: '', university: '',
  phone: '', whatsapp: '', email: '', website: '',
  profilePhoto: null, profilePreview: null,
  clinicalSkills: [], digitalSkills: [], softSkills: [],
  timeline: [], cases: [],
};

interface Props { onBack: () => void; }

export default function CVForm({ onBack }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(init);
  const [loading, setLoading] = useState(false);
  const [loadMsg, setLoadMsg] = useState('');
  const profileRef = useRef<HTMLInputElement>(null);
  const casePhotoRef = useRef<HTMLInputElement>(null);
  const [activeCaseIdx, setActiveCaseIdx] = useState<number | null>(null);

  const ex = CONFIG.examples;
  const t = CONFIG.ui.en;

  const set = (field: keyof FormData, val: unknown) =>
    setForm(p => ({ ...p, [field]: val }));

  const stepLabels = ['Personal', 'Contact', 'Photo', 'Skills', 'Timeline', 'Cases', 'Download PDF'];

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
    setForm(p => ({ ...p, timeline: [...p.timeline, { year: '', event: '' }] }));

  const updateMilestone = (i: number, field: keyof Milestone, v: string) =>
    setForm(p => { const tl = [...p.timeline]; tl[i] = { ...tl[i], [field]: v }; return { ...p, timeline: tl }; });

  const removeMilestone = (i: number) =>
    setForm(p => ({ ...p, timeline: p.timeline.filter((_, idx) => idx !== i) }));

  const addCase = () =>
    setForm(p => ({
      ...p, cases: [...p.cases, { category: '', customCategoryEn: '', title: '', photos: [], photoPreviews: [] }],
    }));

  const updateCase = (i: number, field: keyof ClinicalCase, v: unknown) =>
    setForm(p => { const cases = [...p.cases]; cases[i] = { ...cases[i], [field]: v }; return { ...p, cases }; });

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

  const handleGeneratePDF = async () => {
    setLoading(true); setLoadMsg('Generating your PDF CV...');
    try {
      const pdfCases = form.cases.flatMap(c =>
        (c.photos.length ? c.photos : [null]).map(photo => ({
          category: c.category === 'custom' ? c.customCategoryEn : (CONFIG.caseCategories.find(cat => cat.id === c.category)?.en || c.category),
          title: c.title,
          photo,
        }))
      );
      await generateCVPdf({
        fullName: form.fullName,
        title: form.titleEn,
        graduationYear: form.graduationYear,
        university: form.university,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        website: form.website,
        profilePhoto: form.profilePhoto,
        skills: {
          clinical: form.clinicalSkills,
          digital: form.digitalSkills,
          soft: form.softSkills,
        },
        timeline: form.timeline,
        cases: pdfCases,
      });
    } catch (err) {
      console.error(err);
      alert(t.messages.error);
    }
    setLoading(false);
  };

  const inputCls = "input-field";
  const labelCls = "block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5";
  const hintCls = "text-xs text-slate-400 dark:text-slate-500 mt-1";

  const renderSection = () => {
    switch (SECTIONS[step]) {

      case 'personal': return (
        <div className="space-y-5">
          <h2 className="form-section-title">Personal Information</h2>
          <div>
            <label className={labelCls}>Full Name <span className="text-red-400">*</span></label>
            <input className={inputCls} placeholder={ex.fullName} value={form.fullName} onChange={e => set('fullName', e.target.value)} />
            <p className={hintCls}>e.g. {ex.fullName}</p>
          </div>
          <div>
            <label className={labelCls}>Professional Title <span className="text-red-400">*</span></label>
            <input className={inputCls} placeholder={ex.titleEn} value={form.titleEn} onChange={e => set('titleEn', e.target.value)} />
            <p className={hintCls}>e.g. {ex.titleEn}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Graduation Year</label>
              <input className={inputCls} placeholder={ex.graduationYear} value={form.graduationYear} onChange={e => set('graduationYear', e.target.value)} />
            </div>
          </div>
          <div>
            <label className={labelCls}>University / Faculty</label>
            <input className={inputCls} placeholder={ex.university} value={form.university} onChange={e => set('university', e.target.value)} />
            <p className={hintCls}>e.g. {ex.university}</p>
          </div>
        </div>
      );

      case 'contact': return (
        <div className="space-y-5">
          <h2 className="form-section-title">Contact Details</h2>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input className={inputCls} placeholder={ex.phone} value={form.phone} onChange={e => set('phone', e.target.value)} />
            <p className={hintCls}>e.g. {ex.phone}</p>
          </div>
          <div>
            <label className={labelCls}>WhatsApp Number</label>
            <input className={inputCls} placeholder={ex.whatsapp} value={form.whatsapp} onChange={e => set('whatsapp', e.target.value)} />
            <p className={hintCls}>Your WhatsApp will be clickable in the PDF</p>
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input className={inputCls} placeholder={ex.email} value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Your Link (Professional Page — Optional)</label>
            <input className={inputCls} placeholder={ex.website} value={form.website} onChange={e => set('website', e.target.value)} />
            <p className={hintCls}>e.g. {ex.website}</p>
          </div>
        </div>
      );

      case 'photo': return (
        <div className="space-y-5">
          <h2 className="form-section-title">Profile Photo</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Clear professional photo — no size limit</p>
          <input ref={profileRef} type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
          {form.profilePreview ? (
            <div className="space-y-3">
              <div className="w-full max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-blue-200 dark:border-blue-800">
                <img src={form.profilePreview} alt="Profile" className="w-full h-auto object-contain" />
              </div>
              <button onClick={() => profileRef.current?.click()} className="btn-secondary w-full py-2.5 text-sm">
                Change Photo
              </button>
            </div>
          ) : (
            <button
              onClick={() => profileRef.current?.click()}
              className="w-full py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 transition-colors"
            >
              <ImgIcon size={32} />
              <span className="text-sm font-medium">Upload Profile Photo</span>
              <span className="text-xs">No size limit — full image will appear in PDF</span>
            </button>
          )}
        </div>
      );

      case 'skills': return (
        <div className="space-y-7">
          <h2 className="form-section-title">Professional Skills</h2>
          <SkillTagInput
            label="Clinical Skills"
            placeholder={ex.clinicalSkillExample}
            addLabel="Add"
            items={form.clinicalSkills}
            onChange={v => set('clinicalSkills', v)}
          />
          <SkillTagInput
            label="Digital Skills"
            placeholder={ex.digitalSkillExample}
            addLabel="Add"
            items={form.digitalSkills}
            onChange={v => set('digitalSkills', v)}
          />
          <SkillTagInput
            label="Soft Skills"
            placeholder={ex.softSkillExample}
            addLabel="Add"
            items={form.softSkills}
            onChange={v => set('softSkills', v)}
          />
        </div>
      );

      case 'timeline': return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="form-section-title">Career Timeline</h2>
            <button onClick={addMilestone} className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm">
              <Plus size={15} /> Add Milestone
            </button>
          </div>
          {form.timeline.length === 0 && (
            <div className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm">
              No milestones yet.
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
                    <label className="block text-xs font-medium text-slate-500 mb-1">Year</label>
                    <input className={inputCls} placeholder={ex.timelineYear} value={m.year} onChange={e => updateMilestone(i, 'year', e.target.value)} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Event</label>
                    <input className={inputCls} placeholder={ex.timelineEvent} value={m.event} onChange={e => updateMilestone(i, 'event', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'cases': return (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="form-section-title">Clinical Cases</h2>
            <button onClick={addCase} className="btn-primary flex items-center gap-1.5 px-3 py-2 text-sm">
              <Plus size={15} /> Add Case
            </button>
          </div>
          <input ref={casePhotoRef} type="file" accept="image/*" multiple className="hidden" onChange={handleCasePhotos} />
          {form.cases.length === 0 && (
            <div className="text-center py-10 text-slate-400 dark:text-slate-600 text-sm">
              No cases yet.
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
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Category</label>
                  <select value={c.category} onChange={e => updateCase(i, 'category', e.target.value)} className={inputCls}>
                    <option value="">Select a category...</option>
                    {CONFIG.caseCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.en}</option>
                    ))}
                  </select>
                </div>
                {c.category === 'custom' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Custom Category</label>
                    <input className={inputCls} placeholder={ex.customCategoryEn} value={c.customCategoryEn} onChange={e => updateCase(i, 'customCategoryEn', e.target.value)} />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Case Title</label>
                  <input className={inputCls} placeholder={ex.caseTitleEn} value={c.title} onChange={e => updateCase(i, 'title', e.target.value)} />
                </div>
                {/* Photos */}
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Case Photo(s)</label>
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
                    {c.photoPreviews.length > 0 ? `Add More (${c.photoPreviews.length} added)` : 'Upload Photos'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      case 'generate': return (
        <div className="space-y-6">
          <h2 className="form-section-title">Download Your CV</h2>

          {/* Summary */}
          <div className="card p-4 space-y-2">
            <div className="flex items-center gap-3">
              {form.profilePreview && (
                <img src={form.profilePreview} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 dark:border-blue-800" />
              )}
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{form.fullName || 'Your Name'}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">{form.titleEn}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{form.university}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
              <span>{form.clinicalSkills.length} clinical skills</span>
              <span>{form.digitalSkills.length} digital skills</span>
              <span>{form.softSkills.length} soft skills</span>
              <span>{form.timeline.length} milestones</span>
              <span>{form.cases.length} cases</span>
              <span>{form.cases.reduce((a, c) => a + c.photos.length, 0)} photos</span>
            </div>
          </div>

          <button
            onClick={handleGeneratePDF}
            className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-base font-semibold"
          >
            <Download size={20} />
            Download Your CV as PDF
          </button>

          <p className="text-xs text-center text-slate-400 dark:text-slate-500">
            Your WhatsApp number will be clickable in the PDF
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col">
      {/* Badge */}
      <div className="bg-blue-600 text-white text-center py-1.5 text-xs font-medium">
        CV PDF Maker — Free · Professional · Instant Download
      </div>

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
              {step === 0 ? 'Home' : 'Previous'}
            </button>
            {step < SECTIONS.length - 1 && (
              <button
                onClick={() => setStep(s => s + 1)}
                className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
              >
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
