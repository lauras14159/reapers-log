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
  //  landscape to fit wide tables (motor testing)
  const doc = new jsPDF({ orientation: "landscape" });
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
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 20;

  const checkPage = (needed = 10) => {
    if (y + needed > pageHeight - 15) {
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
    const display = value === 0 ? "0" : String(value || "-");
    const lines = doc.splitTextToSize(display, pageWidth - margin * 2 - 45);
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
    doc.setFont("helvetica", "normal");
    const selectedItems = options.filter((opt) => selected?.includes(opt));
    const text = selectedItems.length > 0 ? selectedItems.join(", ") : "-";
    const lines = doc.splitTextToSize(text, pageWidth - margin * 2 - 45);
    doc.text(lines, margin + 45, y);
    y += lines.length * 5 + 2;
  };

  const radioField = (label: string, selected: string | null) => {
    checkPage(8);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(
      selected || "-",
      pageWidth - margin * 2 - 45,
    );
    doc.text(lines, margin + 45, y);
    y += lines.length * 5 + 2;
  };

  const val = (v: any) =>
    v !== undefined && v !== null && v !== "" ? String(v) : "-";

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

  // ── PT SESSIONS ──────────────────────────────────
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
        val(s.note),
      ]),
      headStyles: { fillColor: [71, 85, 105] },
      styles: { fontSize: 9 },
      margin: { left: margin, right: margin },
    });
    y = (doc as any).lastAutoTable.finalY + 6;
  });

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
      ["Upper Limbs", "Shoulder", val(musculoskeletal.upperLimbsROM?.shoulder)],
      ["Upper Limbs", "Elbow", val(musculoskeletal.upperLimbsROM?.elbow)],
      ["Upper Limbs", "Wrist", val(musculoskeletal.upperLimbsROM?.wrist)],
      ["Lower Limbs", "Hip", val(musculoskeletal.lowerLimbsROM?.hip)],
      ["Lower Limbs", "Knee", val(musculoskeletal.lowerLimbsROM?.knee)],
      ["Lower Limbs", "Ankle", val(musculoskeletal.lowerLimbsROM?.ankle)],
      ["Spine", "Cervical", val(musculoskeletal.spineROM?.cervical)],
      ["Spine", "Lumbar", val(musculoskeletal.spineROM?.lumbar)],
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

  const funcDates = (
    functionalField.dateFunctionalField || ["", "", "", "", ""]
  ).map((d: string) => d || "-");

  //  force all 5 columns to show even if empty
  autoTable(doc, {
    startY: y,
    head: [["Activity", ...funcDates]],
    body: [
      ...funcRows.map(({ key, label }) => {
        const row = functionalField[key] || [0, 0, 0, 0, 0];
        //  ensure exactly 5 values
        const values = Array.from({ length: 5 }, (_, i) => val(row[i]));
        return [label, ...values];
      }),
      [
        "Total",
        ...Array.from({ length: 5 }, (_, i) =>
          val((functionalField.total || [])[i]),
        ),
      ],
    ],
    headStyles: { fillColor: [30, 41, 57], halign: "center" },
    styles: { fontSize: 9, halign: "center" },
    columnStyles: {
      0: { halign: "left", cellWidth: 45 },
      1: { cellWidth: 28 },
      2: { cellWidth: 28 },
      3: { cellWidth: 28 },
      4: { cellWidth: 28 },
      5: { cellWidth: 28 },
    },
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
  field("Pain Scale (Numeric)", `${painScale.painScaleRate ?? 0} / 10`);
  radioField("Algo Plus Scale", algoPlus.algoPlusScale);
  field("Algo Plus Score", `${algoPlus.algoPlusScore ?? 0} / 5`);

  // ── MOTOR TESTING ───────────────────────────────
  sectionHeader("Motor Testing");

  const rightDates = Array.from({ length: 5 }, (_, i) =>
    val((motorTesting.rightDates || [])[i]),
  );
  const leftDates = Array.from({ length: 5 }, (_, i) =>
    val((motorTesting.leftDates || [])[i]),
  );

  //  full table — all 15 rows, all 11 columns
  autoTable(doc, {
    startY: y,
    head: [
      [
        { content: "", styles: { fillColor: [30, 41, 57] } },
        {
          content: "Right",
          colSpan: 5,
          styles: { halign: "center", fillColor: [30, 41, 57] },
        },
        {
          content: "Left",
          colSpan: 5,
          styles: { halign: "center", fillColor: [30, 41, 57] },
        },
      ],
      [
        {
          content: "Muscle",
          styles: { fillColor: [30, 41, 57], textColor: 255 },
        },
        ...rightDates.map((d) => ({
          content: d,
          styles: {
            fillColor: [30, 41, 57],
            textColor: 255,
            fontSize: 7,
          } as any,
        })),
        ...leftDates.map((d) => ({
          content: d,
          styles: {
            fillColor: [30, 41, 57],
            textColor: 255,
            fontSize: 7,
          } as any,
        })),
      ],
    ],
    body: (motorTesting.rows || []).map((row: any) => [
      row.name,
      ...Array.from({ length: 5 }, (_, i) => val((row.right || [])[i])),
      ...Array.from({ length: 5 }, (_, i) => val((row.left || [])[i])),
    ]),
    styles: { fontSize: 7, halign: "center" },
    columnStyles: {
      0: { halign: "left", cellWidth: 42, fontStyle: "bold" },
      1: { cellWidth: 18 },
      2: { cellWidth: 18 },
      3: { cellWidth: 18 },
      4: { cellWidth: 18 },
      5: { cellWidth: 18 },
      //  thick separator before left
      6: {
        cellWidth: 18,
        lineColor: [30, 41, 57] as any,
        lineWidth: { left: 1.5 } as any,
      },
      7: { cellWidth: 18 },
      8: { cellWidth: 18 },
      9: { cellWidth: 18 },
      10: { cellWidth: 18 },
    },
    didDrawCell: (data: any) => {
      if (data.column.index === 6) {
        doc.setDrawColor(30, 41, 57);
        doc.setLineWidth(1);
        doc.line(
          data.cell.x,
          data.cell.y,
          data.cell.x,
          data.cell.y + data.cell.height,
        );
        doc.setLineWidth(0.1);
        doc.setDrawColor(0);
      }
    },
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
      val(treatmentPlan.assessmentFindings[i]),
      val(treatmentPlan.goals[i]),
      val(treatmentPlan.prioritization[i]),
    ]),
    headStyles: { fillColor: [30, 41, 57] },
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 10, halign: "center" } },
    margin: { left: margin, right: margin },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── RESPIRATORY TEST ────────────────────────────
  sectionHeader("Respiratory Test");
  autoTable(doc, {
    startY: y,
    head: [["Category", "Selected"]],
    body: [
      ["Breathing Type", (respiratory.breathType || []).join(", ") || "-"],
      ["Auscultation", (respiratory.auscultation || []).join(", ") || "-"],
      ["Cough", (respiratory.cough || []).join(", ") || "-"],
      ["Secretion", (respiratory.secretion || []).join(", ") || "-"],
      ["Secretion Color", (respiratory.secretionColor || []).join(", ") || "-"],
    ],
    headStyles: { fillColor: [30, 41, 57] },
    styles: { fontSize: 9 },
    margin: { left: margin, right: margin },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ── PAGE NUMBERS ─────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 5, {
      align: "center",
    });
    doc.setTextColor(0, 0, 0);
  }

  doc.save(`${patient.fullName || "patient"}-report.pdf`);
};
