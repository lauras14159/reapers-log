import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPatientPDF = (data: {
  patient: any;
  functionalField: any;
  motorTesting: any;
  respiratory: any;
  treatmentPlan: any;
  ptSchedule: any;
  gaitTraining: string[];
  livingAids: string[];
  brace: any;
  sittingPosition: string[];
  painScale: any;
  algoPlus: any;
  musculoskeletal: any;
}) => {
  const doc = new jsPDF();
  const {
    patient,
    functionalField,
    motorTesting,
    respiratory,
    treatmentPlan,
    ptSchedule,
    gaitTraining,
    livingAids,
    brace,
    sittingPosition,
    painScale,
    algoPlus,
    musculoskeletal,
  } = data;

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 20;

  const checkPage = (needed = 10) => {
    if (y + needed > 275) {
      doc.addPage();
      y = 20;
    }
  };

  const sectionHeader = (title: string) => {
    checkPage(14);
    doc.setFillColor(30, 41, 57);
    doc.rect(margin, y, pageWidth - margin * 2, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin + 3, y + 5.5);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    y += 12;
  };

  const field = (label: string, value: string | number) => {
    checkPage(8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(
      String(value || "—"),
      pageWidth - margin * 2 - 45,
    );
    doc.text(lines, margin + 45, y);
    y += lines.length * 5 + 2;
  };

  const checkboxField = (
    label: string,
    options: string[],
    selected: string[],
  ) => {
    checkPage(8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    let x = margin + 4;
    options.forEach((opt) => {
      const checked = selected?.includes(opt);
      doc.text(checked ? "☑" : "☐", x, y);
      doc.text(opt, x + 6, y);
      x += doc.getTextWidth(opt) + 14;
      if (x > pageWidth - margin - 20) {
        x = margin + 4;
        y += 5;
      }
    });
    y += 7;
  };

  const radioField = (
    label: string,
    options: string[],
    selected: string | null,
  ) => {
    checkPage(8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    let x = margin + 4;
    options.forEach((opt) => {
      const isSelected = selected === opt;
      doc.text(isSelected ? "●" : "○", x, y);
      doc.text(opt, x + 6, y);
      x += doc.getTextWidth(opt) + 14;
      if (x > pageWidth - margin - 20) {
        x = margin + 4;
        y += 5;
      }
    });
    y += 7;
  };

  // ── HEADER ──────────────────────────────────────
  doc.setFillColor(30, 41, 57);
  doc.rect(0, 0, pageWidth, 22, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Report", margin, 14);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated: ${new Date().toLocaleDateString()}`,
    pageWidth - margin,
    14,
    { align: "right" },
  );
  doc.setTextColor(0, 0, 0);
  y = 30;

  // ── PATIENT INFO ────────────────────────────────
  sectionHeader("Patient Information");
  field("Patient Code", patient.patientCode);
  field("Full Name", patient.fullName);
  field("Age", patient.age);
  field("Date of Birth", patient.dateOfBirth);
  field("Sex", patient.sex);
  field("Date of Accident", patient.dateOfAccident);
  field("First Session Date", patient.firstSessionDate);
  field("Time", patient.time);
  checkboxField(
    "Admission Type",
    ["Orthopedic", "Pulmonary", "Neurologic", "Other"],
    patient.admissionType || [],
  );
  if (patient.admissionType?.includes("Other") && patient.admissionTypeOther) {
    field("  Specify", patient.admissionTypeOther);
  }
  checkboxField(
    "Risk Factors",
    ["Smoking", "Overweight", "Other"],
    patient.riskFactors || [],
  );
  if (patient.riskFactors?.includes("Other") && patient.riskFactorsOther) {
    field("  Specify", patient.riskFactorsOther);
  }
  field("Indications", patient.indications);
  field("Contraindications", patient.contraindications);
  field("Precautions", patient.precautions);
  field("History", patient.history);

  // ── MUSCULOSKELETAL ─────────────────────────────
  sectionHeader("Musculoskeletal Evaluation");
  checkboxField(
    "Range of Motion",
    ["Right", "Left"],
    musculoskeletal.rangeOfMotion || [],
  );

  autoTable(doc, {
    startY: y,
    head: [["Region", "Joint", "Value"]],
    body: [
      [
        "Upper Limbs",
        "Shoulder",
        musculoskeletal.upperLimbsROM?.shoulder || "—",
      ],
      ["Upper Limbs", "Elbow", musculoskeletal.upperLimbsROM?.elbow || "—"],
      ["Upper Limbs", "Wrist", musculoskeletal.upperLimbsROM?.wrist || "—"],
      ["Lower Limbs", "Hip", musculoskeletal.lowerLimbsROM?.hip || "—"],
      ["Lower Limbs", "Knee", musculoskeletal.lowerLimbsROM?.knee || "—"],
      ["Lower Limbs", "Ankle", musculoskeletal.lowerLimbsROM?.ankle || "—"],
      ["Spine", "Cervical", musculoskeletal.spineROM?.cervical || "—"],
      ["Spine", "Lumbar", musculoskeletal.spineROM?.lumbar || "—"],
    ],
    headStyles: { fillColor: [30, 41, 57] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── FUNCTIONAL ASSESSMENT ───────────────────────
  sectionHeader("Functional Assessment");
  doc.setFontSize(8);
  doc.text(
    "Scoring: 0 = Impossible  |  1 = Possible with difficulty  |  2 = Normal",
    margin,
    y,
  );
  y += 6;

  const funcRows = [
    { key: "sitting", label: "Sitting" },
    { key: "standing", label: "Standing" },
    { key: "usingLivingAid", label: "Using Living Aid" },
    { key: "goingToRestroom", label: "Going to Restroom" },
    { key: "stairs", label: "Stairs" },
    { key: "puttingShoesOrSocks", label: "Putting Shoes/Socks" },
    { key: "walking10Meters", label: "Walking 10 Meters" },
  ];

  const funcDates = functionalField.dateFunctionalField || ["", "", "", "", ""];

  autoTable(doc, {
    startY: y,
    head: [["Activity", ...funcDates.map((d: string) => d || "—")]],
    body: [
      ...funcRows.map(({ key, label }) => [
        label,
        ...(functionalField[key] || [0, 0, 0, 0, 0]).map(
          (v: number) => v ?? "",
        ),
      ]),
      ["Total", ...(functionalField.total || ["", "", "", "", ""])],
    ],
    headStyles: { fillColor: [30, 41, 57] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── ADDITIONAL ASSESSMENTS ──────────────────────
  sectionHeader("Additional Assessments");
  checkboxField(
    "Sitting Position",
    ["Side of the bed", "On Chair"],
    sittingPosition || [],
  );
  field("Period", patient.period);
  checkboxField(
    "Gait Training",
    [
      "Full weight bearing",
      "Inside the room",
      "Partial weight bearing",
      "Outside the room",
      "Without weight bearing",
    ],
    gaitTraining || [],
  );
  checkboxField(
    "Living Aids",
    ["Walker", "Crutches", "Stick", "Brace"],
    livingAids || [],
  );
  if (livingAids?.includes("Brace")) field("Brace", brace?.braceField);

  // Pain Scale
  checkPage(10);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("Pain Scale (Numeric):", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(`${painScale.painScaleRate ?? 0} / 10`, margin + 50, y);
  y += 7;

  // Algo+ Scale
  radioField(
    "Algo+ Scale",
    [
      "Facial expressions",
      "Look",
      "Complaints",
      "Body position",
      "Atypical behavior",
    ],
    algoPlus.algoPlusScale,
  );
  field("Algo+ Score", `${algoPlus.algoPlusScore ?? 0} / 5`);

  // ── RESPIRATORY TEST ────────────────────────────
  sectionHeader("Respiratory Test");

  autoTable(doc, {
    startY: y,
    head: [["Category", "Selected"]],
    body: [
      [
        "Breathing Type",
        (respiratory.breathType || [])
          .map((v: string) => `☑ ${v}`)
          .join("  ") || "—",
      ],
      [
        "Auscultation",
        (respiratory.auscultation || [])
          .map((v: string) => `☑ ${v}`)
          .join("  ") || "—",
      ],
      [
        "Cough",
        (respiratory.cough || []).map((v: string) => `☑ ${v}`).join("  ") ||
          "—",
      ],
      [
        "Secretion",
        (respiratory.secretion || []).map((v: string) => `☑ ${v}`).join("  ") ||
          "—",
      ],
      [
        "Secretion Color",
        (respiratory.secretionColor || [])
          .map((v: string) => `☑ ${v}`)
          .join("  ") || "—",
      ],
    ],
    headStyles: { fillColor: [30, 41, 57] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── MOTOR TESTING ───────────────────────────────
  sectionHeader("Motor Testing");

  const rightDates = motorTesting.rightDates || ["", "", "", "", ""];
  const leftDates = motorTesting.leftDates || ["", "", "", "", ""];

  autoTable(doc, {
    startY: y,
    head: [
      [
        "Muscle",
        ...rightDates.map((d: string) => (d ? `R\n${d}` : "R")),
        ...leftDates.map((d: string) => (d ? `L\n${d}` : "L")),
      ],
    ],
    body: (motorTesting.rows || []).map((row: any) => [
      row.name,
      ...(row.right || []),
      ...(row.left || []),
    ]),
    headStyles: { fillColor: [30, 41, 57], fontSize: 7 },
    styles: { fontSize: 8 },
    columnStyles: { 0: { cellWidth: 40 } },
    margin: { left: margin, right: margin },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── TREATMENT PLAN ──────────────────────────────
  sectionHeader("Treatment Plan");

  autoTable(doc, {
    startY: y,
    head: [
      ["#", "Assessment Findings", "Goals of Care Plan", "Prioritization"],
    ],
    body: (treatmentPlan.assessmentFindings || []).map((_: any, i: number) => [
      i + 1,
      treatmentPlan.assessmentFindings[i] || "—",
      treatmentPlan.goals[i] || "—",
      treatmentPlan.prioritization[i] || "—",
    ]),
    headStyles: { fillColor: [30, 41, 57] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── PT SESSIONS ─────────────────────────────────
  sectionHeader("PT Sessions");

  (ptSchedule || []).forEach((week: any) => {
    checkPage(12);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Week ${week.weekNumber}${week.date ? ` — ${week.date}` : ""}`,
      margin,
      y,
    );
    y += 6;

    autoTable(doc, {
      startY: y,
      head: [["Session", "Notes"]],
      body: (week.sessions || []).map((s: any, i: number) => [
        `Session ${i + 1}`,
        s.note || "—",
      ]),
      headStyles: { fillColor: [71, 85, 105] },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  });

  // ── PAGE NUMBERS ─────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, 290, {
      align: "center",
    });
    doc.setTextColor(0, 0, 0);
  }

  doc.save(`${patient.fullName || "patient"}-report.pdf`);
};
