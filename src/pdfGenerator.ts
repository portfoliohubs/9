import jsPDF from 'jspdf';

export interface CVData {
  fullName: string;
  title: string;
  graduationYear: string;
  university: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  profilePhoto: string | null;
  skills: {
    clinical: string[];
    digital: string[];
    soft: string[];
  };
  timeline: Array<{ year: string; event: string }>;
  cases: Array<{
    category: string;
    title: string;
    photo: string | null;
  }>;
}

const BG = '#0f172a';
const BG_CARD = '#1e2d45';
const BLUE = '#3b82f6';
const WHITE = '#ffffff';
const GRAY = '#94a3b8';
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 20;
const CONTENT_W = PAGE_W - MARGIN * 2;

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function setBg(pdf: jsPDF, color: string) {
  const [r, g, b] = hexToRgb(color);
  pdf.setFillColor(r, g, b);
}

function setTxt(pdf: jsPDF, color: string) {
  const [r, g, b] = hexToRgb(color);
  pdf.setTextColor(r, g, b);
}

function newPage(pdf: jsPDF, pageNum: number, name: string, totalHint: string) {
  pdf.addPage();
  setBg(pdf, BG);
  pdf.rect(0, 0, PAGE_W, PAGE_H, 'F');
  setTxt(pdf, GRAY);
  pdf.setFontSize(8);
  pdf.text(name, MARGIN, 10);
  pdf.text(totalHint, PAGE_W - MARGIN, 10, { align: 'right' });
  setTxt(pdf, GRAY);
  pdf.setFontSize(7);
  pdf.text(`© ${new Date().getFullYear()} ${name}`, PAGE_W / 2, PAGE_H - 8, { align: 'center' });
  return 25;
}

function sectionTitle(pdf: jsPDF, y: number, text: string): number {
  setTxt(pdf, WHITE);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(text.toUpperCase(), PAGE_W / 2, y, { align: 'center' });
  const [r, g, b] = hexToRgb(BLUE);
  pdf.setDrawColor(r, g, b);
  pdf.setLineWidth(0.8);
  pdf.line(PAGE_W / 2 - 20, y + 4, PAGE_W / 2 + 20, y + 4);
  return y + 16;
}

function checkY(pdf: jsPDF, y: number, needed: number, name: string, pageRef: { num: number }): number {
  if (y + needed > PAGE_H - 20) {
    pageRef.num++;
    return newPage(pdf, pageRef.num, name, `Page ${pageRef.num}`);
  }
  return y;
}

export async function generateCVPdf(data: CVData): Promise<void> {
  const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const pageRef = { num: 1 };

  // ── PAGE 1: Cover ─────────────────────────────────────────
  setBg(pdf, BG);
  pdf.rect(0, 0, PAGE_W, PAGE_H, 'F');

  let y = 40;

  // Profile photo
  if (data.profilePhoto) {
    try {
      const imgSize = 60;
      const imgX = (PAGE_W - imgSize) / 2;
      pdf.addImage(data.profilePhoto, 'JPEG', imgX, y, imgSize, imgSize);
      y += imgSize + 15;
    } catch (_) {
      y += 10;
    }
  } else {
    y += 20;
  }

  // Name
  setTxt(pdf, WHITE);
  pdf.setFontSize(28);
  pdf.setFont('helvetica', 'bold');
  pdf.text(data.fullName.toUpperCase(), PAGE_W / 2, y, { align: 'center' });
  y += 12;

  // Title
  setTxt(pdf, BLUE);
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.title, PAGE_W / 2, y, { align: 'center' });
  y += 10;

  // Graduation
  setTxt(pdf, GRAY);
  pdf.setFontSize(10);
  pdf.text(`Graduated ${data.graduationYear} - ${data.university}`, PAGE_W / 2, y, { align: 'center' });
  y += 14;

  // Divider
  const [dr, dg, db] = hexToRgb(BLUE);
  pdf.setDrawColor(dr, dg, db);
  pdf.setLineWidth(0.5);
  pdf.line(PAGE_W / 2 - 30, y, PAGE_W / 2 + 30, y);
  y += 12;

  // Contact
  const contactItems: string[] = [];
  if (data.phone) contactItems.push(`Phone: ${data.phone}`);
  if (data.whatsapp) contactItems.push(`WhatsApp: ${data.whatsapp}`);
  if (data.email) contactItems.push(`Email: ${data.email}`);
  if (data.website) contactItems.push(`Link: ${data.website}`);

  setTxt(pdf, GRAY);
  pdf.setFontSize(10);
  contactItems.forEach(item => {
    pdf.text(item, PAGE_W / 2, y, { align: 'center' });
    y += 8;
  });

  // WhatsApp clickable link
  if (data.whatsapp) {
    const cleanNum = data.whatsapp.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanNum}`;
    setTxt(pdf, BLUE);
    pdf.setFontSize(9);
    pdf.text('Click to WhatsApp', PAGE_W / 2, y + 5, { align: 'center' });
    pdf.link(PAGE_W / 2 - 20, y, 40, 8, { url: waUrl });
    y += 14;
  }

  // Footer
  setTxt(pdf, GRAY);
  pdf.setFontSize(7);
  pdf.text(`© ${new Date().getFullYear()} ${data.fullName}`, PAGE_W / 2, PAGE_H - 8, { align: 'center' });

  // ── PAGE 2: Professional Skills ───────────────────────────
  y = newPage(pdf, 2, data.fullName, 'Page 2');
  pageRef.num = 2;

  y = sectionTitle(pdf, y, 'Professional Skills');
  y += 8;

  const skillSections: Array<{ label: string; items: string[] }> = [
    { label: 'Clinical Skills', items: data.skills.clinical },
    { label: 'Digital Skills', items: data.skills.digital },
    { label: 'Soft Skills', items: data.skills.soft },
  ];

  skillSections.forEach(sec => {
    if (!sec.items.length) return;
    y = checkY(pdf, y, 30, data.fullName, pageRef);
    setTxt(pdf, BLUE);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text(sec.label, PAGE_W / 2, y, { align: 'center' });
    y += 8;
    setTxt(pdf, GRAY);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    const line = sec.items.join(' • ');
    const lines = pdf.splitTextToSize(line, CONTENT_W);
    lines.forEach((l: string) => {
      y = checkY(pdf, y, 7, data.fullName, pageRef);
      pdf.text(l, PAGE_W / 2, y, { align: 'center' });
      y += 6;
    });
    y += 10;
  });

  // ── PAGE 3: Education & Career ────────────────────────────
  if (data.timeline.length > 0) {
    pageRef.num++;
    y = newPage(pdf, pageRef.num, data.fullName, `Page ${pageRef.num}`);
    y = sectionTitle(pdf, y, 'Education & Career');
    y += 8;

    setTxt(pdf, WHITE);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.university, PAGE_W / 2, y, { align: 'center' });
    y += 7;
    setTxt(pdf, GRAY);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Graduated: ${data.graduationYear}`, PAGE_W / 2, y, { align: 'center' });
    y += 14;

    data.timeline.forEach(m => {
      y = checkY(pdf, y, 14, data.fullName, pageRef);
      setTxt(pdf, GRAY);
      pdf.setFontSize(9);
      pdf.text(`${m.year} — ${m.event}`, PAGE_W / 2, y, { align: 'center' });
      y += 9;
    });
  }

  // ── Clinical Cases Pages ──────────────────────────────────
  if (data.cases.length > 0) {
    const groupedCases: Record<string, typeof data.cases> = {};
    data.cases.forEach(cs => {
      const key = cs.category || 'General';
      if (!groupedCases[key]) groupedCases[key] = [];
      groupedCases[key].push(cs);
    });

    pageRef.num++;
    y = newPage(pdf, pageRef.num, data.fullName, `Page ${pageRef.num}`);
    y = sectionTitle(pdf, y, 'Clinical Cases Portfolio');

    for (const [cat, list] of Object.entries(groupedCases)) {
      for (const cs of list) {
        y = checkY(pdf, y, 80, data.fullName, pageRef);

        setTxt(pdf, BLUE);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(cat, PAGE_W / 2, y, { align: 'center' });
        y += 7;

        setTxt(pdf, WHITE);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text(cs.title, PAGE_W / 2, y, { align: 'center' });
        y += 8;

        if (cs.photo) {
          try {
            const imgMaxW = CONTENT_W;
            const imgX = MARGIN;
            // Load image to get aspect ratio
            const img = new Image();
            await new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              img.src = cs.photo!;
            });
            const aspect = img.naturalHeight / img.naturalWidth || 0.75;
            const imgH = Math.min(imgMaxW * aspect, 100);
            y = checkY(pdf, y, imgH + 10, data.fullName, pageRef);
            pdf.addImage(cs.photo, 'JPEG', imgX, y, imgMaxW, imgH);
            y += imgH + 12;
          } catch (_) {
            y += 5;
          }
        }
        y += 6;
      }
    }
  }

  // ── Final Page ────────────────────────────────────────────
  pageRef.num++;
  y = newPage(pdf, pageRef.num, data.fullName, `Page ${pageRef.num}`);
  y = sectionTitle(pdf, y, 'Complete Portfolio');
  y += 14;

  setTxt(pdf, GRAY);
  pdf.setFontSize(10);
  pdf.text('For complete portfolio and additional cases', PAGE_W / 2, y, { align: 'center' });
  y += 8;
  pdf.text('please visit:', PAGE_W / 2, y, { align: 'center' });
  y += 10;

  if (data.website) {
    setTxt(pdf, BLUE);
    pdf.setFontSize(10);
    pdf.text(data.website, PAGE_W / 2, y, { align: 'center' });
    pdf.link(MARGIN, y - 5, CONTENT_W, 8, { url: data.website });
    y += 10;
  }

  if (data.whatsapp) {
    const cleanNum = data.whatsapp.replace(/\D/g, '');
    const waUrl = `https://wa.me/${cleanNum}`;
    y += 8;
    setTxt(pdf, '#25d366');
    pdf.setFontSize(10);
    pdf.text(`WhatsApp: ${data.whatsapp}`, PAGE_W / 2, y, { align: 'center' });
    pdf.link(MARGIN, y - 5, CONTENT_W, 8, { url: waUrl });
  }

  // Save
  const safeName = data.fullName.replace(/\s+/g, '_');
  pdf.save(`${safeName}_CV.pdf`);
}
