
import { useState } from "react";
import type { Patient, MusculoskeletalEvaluation, AlgoPlusScore, Brace, GaitTraining, LivingAids, SittingPosition, PainScale, MotorRow, MotorTesting, RespiratoryTest, TreatmentPlan } from "../types/patient";
import PainScaleRating from "../Scale/PainScale";
import CheckboxGroup from "../checkbox/CheckboxGroup";

const admissionOptions: Patient["admissionType"] = ["Orthopedic", "Pulmonary", "Neurologic", "Other"];
const riskOptions: Patient["riskFactors"] = ["Smoking", "Overweight", "Other"];
export default function PatientForm() {
    // Patient state
    const [patient, setPatient] = useState<Patient>({
        fullName: "",
        age: 0,
        sex: "Male",
        dateOfAccident: "",
        firstSessionDate: "",
        time: "",
        admissionType: [],
        riskFactors: [],
        indications: "",
        contraindications: "",
        precautions: "",
    });

    const [admissionOther, setAdmissionOther] = useState("");
    const [riskOther, setRiskOther] = useState("");
    const [period, setPeriod] = useState("");
    const [gaitTraining, setGaitTraining] = useState<GaitTraining>([]);
    const [livingAids, setLivingAids] = useState<LivingAids>([]);
    const [brace, setBrace] = useState<Brace>({ braceField: "" });
    const [algoPlus, setAlgoPlus] = useState<AlgoPlusScore>({
        algoChecked: false,
        algoPlusScore: 0,
    });
    const [sittingPosition, setSittingPosition] = useState<SittingPosition>([]);
    const [painScale, setPainScale] = useState<PainScale>({
        numeric: false,
        score: 0,
        painScaleRate: 0,
    });
    // Musculoskeletal evaluation state
    const [musculoskeletal, setMusculoskeletal] = useState<MusculoskeletalEvaluation>({
        rangeOfMotion: [],
        upperLimbsROM: {},
        lowerLimbsROM: {},
        spineROM: {},
    });
    const [respiratory, setRespiratory] = useState<RespiratoryTest>({
        breathType: [],
        auscultation: [],
        cough: [],
        secretion: [],
        secretionColor: [],
    });

    const gaitOptions: GaitTraining = [
        "Full weight bearing",
        "Inside the room",
        "Partial weight bearing",
        "Outside the room",
        "Without weight bearing",
    ];

    const createEmptySide = () => ["", "", "", "", ""];

    const motorRowsTemplate: MotorRow[] = [
        { name: "Deltoids (C5)", right: createEmptySide(), left: createEmptySide() },
        { name: "Biceps (C5-C6)", right: createEmptySide(), left: createEmptySide() },
        { name: "Wrist Extensors (C6)", right: createEmptySide(), left: createEmptySide() },
        { name: "Triceps (C7)", right: createEmptySide(), left: createEmptySide() },
        { name: "Wrist Flexors (C7)", right: createEmptySide(), left: createEmptySide() },
        { name: "Finger Extensors (C8)", right: createEmptySide(), left: createEmptySide() },
        { name: "Psoas - Hip Flex (L2)", right: createEmptySide(), left: createEmptySide() },
        { name: "Quads - Knee Ext (L3)", right: createEmptySide(), left: createEmptySide() },
        { name: "Tibialis Anterior (L4)", right: createEmptySide(), left: createEmptySide() },
        { name: "Adductors (L2-L3)", right: createEmptySide(), left: createEmptySide() },
        { name: "Gluteus (L5)", right: createEmptySide(), left: createEmptySide() },
        { name: "Peroneus - Ankle Ev (S1)", right: createEmptySide(), left: createEmptySide() },
        { name: "Triceps Surae (S2)", right: createEmptySide(), left: createEmptySide() },
        { name: "Abdominal", right: createEmptySide(), left: createEmptySide() },
    ];
    const breathOptions: RespiratoryTest["breathType"] = [
        "Abdominal",
        "Thoracic",
        "Superficial",
        "Respirator",
    ];
    const auscultationOptions: RespiratoryTest["auscultation"] = [
        "Wheezing",
        "Crepitus",
        "Snoring",
    ];
    const coughOptions: RespiratoryTest["cough"] = [
        "Productive",
        "Greasy",
        "Dry",
    ];
    const secretionOptions: RespiratoryTest["secretion"] = [
        "No secretion",
        "Expectorated",
        "Aspirated",
        "Swallowed",
    ];
    const colorOptions: RespiratoryTest["secretionColor"] = [
        "Bloodshed",
        "White",
        "Yellow",
        "Green",
    ];
    const [motorTesting, setMotorTesting] = useState<MotorTesting>({
        motorDates: ["", "", "", "", ""],
        rows: motorRowsTemplate,
    });

    const livingAidOptions: LivingAids = ["Walker", "Crutches", "Stick", "Brace"];

    const sittingOptions: SittingPosition = ["Side of the bed", "On Chair"];

    // Generic toggle function for checkbox arrays
    const toggleOption = <T extends string>(option: T, array: T[], setter: (v: T[]) => void) => {
        setter(array.includes(option) ? array.filter(o => o !== option) : [...array, option]);
    };

    const [treatmentPlan, setTreatmentPlan] = useState<TreatmentPlan>({
        assessmentFindings: ["", "", "", "", ""],
        goals: ["", "", "", "", ""],
        prioritization: ["", "", "", "", ""],
    });
    const updateTreatment = (
        field: keyof TreatmentPlan,
        index: number,
        value: string
    ) => {
        const updated = { ...treatmentPlan };
        updated[field][index] = value;
        setTreatmentPlan(updated);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const functionalAssessment = {
            patient: {
                ...patient,
                admissionTypeOther: patient.admissionType.includes("Other") ? admissionOther : undefined,
                riskFactorsOther: patient.riskFactors.includes("Other") ? riskOther : undefined,
            },
            musculoskeletalEvaluation: musculoskeletal,
            motorTesting,
            respiratoryTest: respiratory,
            treatmentPlan
        };

        console.log("Functional Assessment Submitted:", functionalAssessment);
        alert("Form submitted! Check console for object.");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>

            {/* Name & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block font-medium mb-1">Full Name</label>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="border p-2 rounded w-full"
                        value={patient.fullName}
                        onChange={e => setPatient({ ...patient, fullName: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Age</label>
                    <input
                        type="number"
                        placeholder="Age"
                        className="border p-2 rounded"
                        value={patient.age}
                        onChange={e => setPatient({ ...patient, age: Number(e.target.value) })}
                    />
                </div>
            </div>

            {/* Sex */}
            <div>
                <span className="block font-medium mb-1">Sex</span>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={patient.sex === "Male"}
                            onChange={() => setPatient({ ...patient, sex: "Male" })}
                        />
                        Male
                    </label>
                    <label className="flex items-center gap-2">
                        <input
                            type="radio"
                            checked={patient.sex === "Female"}
                            onChange={() => setPatient({ ...patient, sex: "Female" })}
                        />
                        Female
                    </label>
                </div>
            </div>

            {/* Dates & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col">
                    <label className="block font-medium mb-1 text-sm sm:text-base">
                        Date of surgery / accident
                    </label>
                    <input
                        type="date"
                        className="border p-3 sm:p-2 rounded w-full text-base"
                        value={patient.dateOfAccident}
                        onChange={e => setPatient({ ...patient, dateOfAccident: e.target.value })}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="block font-medium mb-1 text-sm sm:text-base">
                        First Session Date
                    </label>
                    <input
                        type="date"
                        className="border p-3 sm:p-2 rounded w-full text-base"
                        value={patient.firstSessionDate}
                        onChange={e => setPatient({ ...patient, firstSessionDate: e.target.value })}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="block font-medium mb-1 text-sm sm:text-base">
                        Time
                    </label>
                    <input
                        type="time"
                        className="border p-3 sm:p-2 rounded w-full text-base"
                        value={patient.time}
                        onChange={e => setPatient({ ...patient, time: e.target.value })}
                    />
                </div>
            </div>

            {/* Admission Type */}
            <div>
                <label className="block font-medium mb-1">Admission Type</label>
                <div className="flex flex-wrap gap-4">
                    {admissionOptions.map(opt => (
                        <label key={opt} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={patient.admissionType.includes(opt)}
                                onChange={() =>
                                    toggleOption(opt, patient.admissionType, v => setPatient({ ...patient, admissionType: v }))
                                }
                            />
                            {opt}
                        </label>
                    ))}
                    {patient.admissionType.includes("Other") && (
                        <input
                            type="text"
                            placeholder="Specify other admission"
                            className="border p-2 rounded"
                            value={admissionOther}
                            onChange={e => setAdmissionOther(e.target.value)}
                        />
                    )}
                </div>
            </div>

            {/* Risk Factors */}
            <div>
                <label className="block font-medium mb-1">Risk Factors</label>
                <div className="flex flex-wrap gap-4">
                    {riskOptions.map(opt => (
                        <label key={opt} className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={patient.riskFactors.includes(opt)}
                                onChange={() =>
                                    toggleOption(opt, patient.riskFactors, v => setPatient({ ...patient, riskFactors: v }))
                                }
                            />
                            {opt}
                        </label>
                    ))}
                    {patient.riskFactors.includes("Other") && (
                        <input
                            type="text"
                            placeholder="Specify other risk factor"
                            className="border p-2 rounded"
                            value={riskOther}
                            onChange={e => setRiskOther(e.target.value)}
                        />
                    )}
                </div>
            </div>

            {/* Textareas */}
            <div className="mt-4">
                <label className="block font-medium mb-1">Indications</label>
                <textarea
                    placeholder="Indications"
                    className="border p-2 rounded w-full mb-2"
                    value={patient.indications}
                    onChange={e => setPatient({ ...patient, indications: e.target.value })}
                />
                <label className="block font-medium mb-1">Contraindications</label>
                <textarea
                    placeholder="Contraindications"
                    className="border p-2 rounded w-full mb-2"
                    value={patient.contraindications}
                    onChange={e => setPatient({ ...patient, contraindications: e.target.value })}
                />
                <label className="block font-medium mb-1">Precautions</label>
                <textarea
                    placeholder="Precautions"
                    className="border p-2 rounded w-full mb-2"
                    value={patient.precautions}
                    onChange={e => setPatient({ ...patient, precautions: e.target.value })}
                />
            </div>

            {/* Musculoskeletal Evaluation */}
            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-center">Musculoskeletal Evaluation</h2>

                {/* Range of Motion */}
                <div className="flex items-center gap-6">
                    <label className="font-medium">Range of Motion</label>
                    <div className="flex items-center gap-6">
                        {["Right", "Left"].map(side => (
                            <label key={side} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={musculoskeletal.rangeOfMotion.includes(side as "Right" | "Left")}
                                    onChange={() =>
                                        toggleOption(
                                            side as "Right" | "Left",
                                            musculoskeletal.rangeOfMotion,
                                            v => setMusculoskeletal({ ...musculoskeletal, rangeOfMotion: v })
                                        )
                                    }
                                />
                                {side}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Upper Limbs */}
                <div className="space-y-2">
                    <label className="font-medium">Upper Limbs ROM</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Shoulder</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={musculoskeletal.upperLimbsROM?.shoulder || ""}
                                onChange={e =>
                                    setMusculoskeletal({
                                        ...musculoskeletal,
                                        upperLimbsROM: { ...musculoskeletal.upperLimbsROM, shoulder: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Elbow</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={musculoskeletal.upperLimbsROM?.elbow || ""}
                                onChange={e =>
                                    setMusculoskeletal({
                                        ...musculoskeletal,
                                        upperLimbsROM: { ...musculoskeletal.upperLimbsROM, elbow: e.target.value },
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Lower Limbs */}
                <div className="space-y-2">
                    <label className="font-medium">Lower Limbs ROM</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Hip</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={musculoskeletal.lowerLimbsROM?.hip || ""}
                                onChange={e =>
                                    setMusculoskeletal({
                                        ...musculoskeletal,
                                        lowerLimbsROM: { ...musculoskeletal.lowerLimbsROM, hip: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Knee</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={musculoskeletal.lowerLimbsROM?.knee || ""}
                                onChange={e =>
                                    setMusculoskeletal({
                                        ...musculoskeletal,
                                        lowerLimbsROM: { ...musculoskeletal.lowerLimbsROM, knee: e.target.value },
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Spine */}
                <div className="space-y-2">
                    <label className="font-medium">Spine ROM</label>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1">Cervical</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={musculoskeletal.spineROM?.cervical || ""}
                                onChange={e =>
                                    setMusculoskeletal({
                                        ...musculoskeletal,
                                        spineROM: { ...musculoskeletal.spineROM, cervical: e.target.value },
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className="block mb-1">Lumbar</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={musculoskeletal.spineROM?.lumbar || ""}
                                onChange={e =>
                                    setMusculoskeletal({
                                        ...musculoskeletal,
                                        spineROM: { ...musculoskeletal.spineROM, lumbar: e.target.value },
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Functional Assessment */}
            <h2 className="text-xl font-semibold pt-10 text-center">
                Functional Assessment
            </h2>
            <h3 className="md:text-lg mb-2 space-x-5">
                <span className="font-semibold">Scoring:</span>
                <span>0 = Impossible </span>
                <span>1 = Possible with difficulty </span>
                <span>2 = Normal</span>
            </h3>
            {/* Functional Assessment Table */}
            <div className="w-full pt-4">
                <div className="w-full overflow-x-auto">
                    <table className="w-full border text-xs sm:text-sm md:text-base table-auto">
                        <thead className="">
                            <tr>
                                <th className="border p-2 text-left whitespace-nowrap">
                                    Date
                                </th>
                                {[...Array(5)].map((_, idx) => (
                                    <th key={idx} className="border p-2">
                                        <input
                                            type="date"
                                            className="w-full p-1 text-center bg-transparent outline-none text-xs sm:text-base" />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {[
                                "Sitting",
                                "Standing",
                                "Using living aid",
                                "Going to restroom",
                                "Going up/down stairs",
                                "Putting shoes/socks",
                                "Walking 10 meters"
                            ].map(field => (
                                <tr key={field}>
                                    <td className="border p-2 text-left font-medium whitespace-normal">
                                        {field}
                                    </td>
                                    {[...Array(5)].map((_, idx) => (
                                        <td key={idx} className="border p-2">
                                            <input
                                                type="number"
                                                min={0}
                                                max={2}
                                                className="w-full p-1 text-center bg-transparent outline-none text-xs sm:text-sm"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            <tr className=" font-semibold">
                                <td className="border p-2 text-left whitespace-nowrap">
                                    Total
                                </td>
                                {[...Array(5)].map((_, idx) => (
                                    <td key={idx} className="border p-2">
                                        <input
                                            type="text"
                                            className="w-full p-1 text-center bg-transparent outline-none text-xs sm:text-sm"
                                        />
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Additional Assessments */}
            <>
                {/* Sitting Position */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Sitting Position</label>
                    <div className="flex gap-4">
                        {sittingOptions.map(opt => (
                            <label key={opt} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={sittingPosition.includes(opt)}
                                    onChange={() => toggleOption(opt, sittingPosition, setSittingPosition)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>
                {/* Period Field */}
                <div className="mb-4 ">
                    <label className="block font-medium mb-1">Period</label>
                    <input
                        type="text"
                        className="border p-2 rounded"
                        value={period}
                        onChange={e => setPeriod(e.target.value)}
                    />
                </div>
                {/* Gait Training */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Gait Training</label>
                    <div className="flex flex-wrap gap-4">
                        {gaitOptions.map(opt => (
                            <label key={opt} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={gaitTraining.includes(opt)}
                                    onChange={() => toggleOption(opt, gaitTraining, setGaitTraining)}
                                />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Living Aids */}
                <div className="mb-4">
                    <label className="block font-medium mb-1">Living Aids</label>
                    <div className="flex flex-wrap gap-4">
                        {livingAidOptions.map(opt => (
                            <label key={opt} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={livingAids.includes(opt)}
                                    onChange={() => toggleOption(opt, livingAids, setLivingAids)}
                                />
                                {opt}
                            </label>
                        ))}

                        {livingAids.includes("Brace") && (
                            <input
                                type="text"
                                placeholder="Specify brace"
                                className="border p-2 rounded"
                                value={brace.braceField}
                                onChange={e => setBrace({ braceField: e.target.value })}
                            />
                        )}
                    </div>
                </div>

                {/* Pain Scale and Algo+ Score */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-x-10">

                    {/* Pain Scale */}
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                        <p className="font-medium w-full sm:w-auto">Pain Scale</p>

                        <label className="flex items-center gap-2 sm:pl-6">
                            <input
                                type="checkbox"
                                checked={painScale.numeric}
                                onChange={e =>
                                    setPainScale({ ...painScale, numeric: e.target.checked })
                                }
                            />
                            Numeric
                        </label>

                        <input
                            type="number"
                            min={0}
                            max={10}
                            className="border p-1 rounded w-16 shrink-0"
                            placeholder="0 - 10"
                            value={painScale.score ?? ""}
                            onChange={e =>
                                setPainScale({
                                    ...painScale,
                                    score: Number(e.target.value),
                                })
                            }
                            disabled={!painScale.numeric}
                        />
                        <p>/10</p>
                    </div>

                    {/* Algo+ Score */}
                    <div className="mb-4 flex flex-row items-center gap-2">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={algoPlus.algoChecked}
                                onChange={e =>
                                    setAlgoPlus({
                                        ...algoPlus,
                                        algoChecked: e.target.checked,
                                    })
                                }
                            />
                            Algo plus Score
                        </label>

                        <input
                            type="number"
                            className="border p-1 rounded w-16 shrink-0"
                            placeholder="Score"
                            value={algoPlus.algoPlusScore ?? ""}
                            onChange={e =>
                                setAlgoPlus({
                                    ...algoPlus,
                                    algoPlusScore: Number(e.target.value),
                                })
                            }
                            disabled={!algoPlus.algoChecked}
                        />
                        <p>/5</p>
                    </div>

                </div>
            </>

            {/* Pain Scale Table */}
            <div className="overflow-x-auto">
                <table className="min-w-40 w-full border-collapse text-left md:text-center md:text-base text-sm">
                    <thead className="hidden md:table-header-group text-lg">
                        <tr>
                            <th className="border p-2">Numerical Scale</th>
                            <th className="border p-2">
                                Algo plus scale (for patients not able to communicate)
                            </th>
                        </tr>
                    </thead>

                    <tbody className="md:table-row-group">
                        {/* Row 1 */}
                        <tr className="border block md:table-row">
                            <td className="text-center items-center font-semibold p-2 block md:hidden border-b text-base">Numerical Scale

                            </td>
                            <td className="border-b md:border p-2 align-top block md:table-cell" rowSpan={5}>
                                <PainScaleRating
                                    value={painScale.painScaleRate}
                                    onChange={val =>
                                        setPainScale({ ...painScale, painScaleRate: val })
                                    } />
                            </td>
                            <td className="border-b p-2 block md:hidden">
                                Pain management is satisfactory when the score remains strictly &lt; 4
                            </td>
                            <td className="md:border border-b p-2 text-center items-center font-semibold block md:hidden text-base">
                                Algo plus scale (for patients not able to communicate)
                            </td>
                            <td className="md:border p-2 text-left block md:table-cell">
                                1. Facial expressions: Frowning, grimacing, wincing, clenched teeth, unexpressive.
                            </td>
                        </tr>

                        <tr className="md:border-b block md:table-row">
                            <td className="border-x p-2 text-left block md:table-cell">
                                2. Look: Inattentive, blank stare, distant or imploring, teary eyed, closed eyes.
                            </td>
                        </tr>

                        <tr className="md:border-b block md:table-row">
                            <td className="border-x p-2 text-left block md:table-cell">
                                3. Complaints: “Ow-ouch”, that hurts, groaning, screaming.
                            </td>
                        </tr>

                        <tr className="md:border-b block md:table-row">
                            <td className="border p-2 text-left block md:table-cell">
                                4. Body position: Withdrawn, guarded, refuses to move, frozen posture.
                            </td>
                        </tr>

                        <tr className="md:border block md:table-row">
                            <td className="border-x p-2 text-left block md:table-cell">
                                5. Atypical behavior: Agitation, aggressivity, grabbing onto something or someone.
                            </td>
                        </tr>

                        {/* Last row */}
                        <tr className="block md:table-row">
                            <td className="border p-2 hidden md:table-cell">
                                Pain management is satisfactory when the score remains strictly &lt; 4
                            </td>
                            <td className="border p-2 text-left block md:table-cell">
                                Score each item YES (1) / NO (0).<br />
                                Pain management is satisfactory when the score remains ≤ 2
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Motor Testing */}
            <div className="pt-10 w-full max-w-350 mx-auto space-y-4">
                <h2 className="text-xl font-semibold text-center">Motor Testing</h2>

                {/* Scroll only on mobile */}
                <div className="w-full overflow-x-auto md:overflow-visible">
                    <table className="min-w-250 md:min-w-0 w-full md:table-fixed border border-collapse text-xs md:text-sm">

                        {/* HEADER */}
                        <thead>
                            <tr>
                                <th className="border p-2 w-28 md:w-44"></th>
                                <th className="border p-2" colSpan={5}>Right</th>
                                <th className="border p-2 border-l-4 border-l-black" colSpan={5}>Left</th>
                            </tr>

                            <tr>
                                <th className="border p-2">Date</th>

                                {motorTesting.motorDates.map((date, i) => (
                                    <th key={"r" + i} className="border p-2 align-middle">
                                        <input
                                            type="date"
                                            className="w-full p-1 text-xs"
                                            value={date}
                                            onChange={(e) => {
                                                const newDates = [...motorTesting.motorDates];
                                                newDates[i] = e.target.value;
                                                setMotorTesting({ ...motorTesting, motorDates: newDates });
                                            }}
                                        />
                                    </th>
                                ))}

                                {motorTesting.motorDates.map((date, i) => (
                                    <th
                                        key={"l" + i}
                                        className={`border p-2 align-middle ${i === 0 ? "border-l-4 border-l-black" : ""
                                            }`}
                                    >
                                        <input
                                            type="date"
                                            className="w-full p-1 text-xs"
                                            value={date}
                                            onChange={(e) => {
                                                const newDates = [...motorTesting.motorDates];
                                                newDates[i] = e.target.value;
                                                setMotorTesting({ ...motorTesting, motorDates: newDates });
                                            }}
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {motorTesting.rows.map((row, rowIndex) => (
                                <tr
                                    key={row.name}
                                    className={
                                        row.name.includes("Psoas")
                                            ? "border-t-4 border-t-black"
                                            : ""
                                    }
                                >
                                    {/* Muscle */}
                                    <td className="border p-2 text-left font-medium align-middle wrap-break-word">
                                        {row.name}
                                    </td>

                                    {/* RIGHT */}
                                    {row.right.map((val, colIndex) => (
                                        <td key={"r" + colIndex} className="border p-2 align-middle">
                                            <div className="flex justify-center">
                                                <input
                                                    type="text"
                                                    className="w-full max-w-15 p-1 text-center"
                                                    value={val}
                                                    onChange={(e) => {
                                                        const newRows = [...motorTesting.rows];
                                                        newRows[rowIndex].right[colIndex] = e.target.value;
                                                        setMotorTesting({ ...motorTesting, rows: newRows });
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    ))}

                                    {/* LEFT */}
                                    {row.left.map((val, colIndex) => (
                                        <td
                                            key={"l" + colIndex}
                                            className={`border p-2 align-middle ${colIndex === 0 ? "border-l-4 border-l-black" : ""
                                                }`}
                                        >
                                            <div className="flex justify-center">
                                                <input
                                                    type="text"
                                                    className="w-full max-w-15 p-1 text-center"
                                                    value={val}
                                                    onChange={(e) => {
                                                        const newRows = [...motorTesting.rows];
                                                        newRows[rowIndex].left[colIndex] = e.target.value;
                                                        setMotorTesting({ ...motorTesting, rows: newRows });
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            </div>

            {/* Respiratory Test */}
            <div className="pt-10 space-y-6">
                <h2 className="text-xl font-semibold text-center">
                    Respiratory Test
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

                    <CheckboxGroup
                        title="Breathing Type"
                        options={breathOptions}
                        values={respiratory.breathType}
                        onChange={(val) =>
                            setRespiratory({ ...respiratory, breathType: val as RespiratoryTest["breathType"] })
                        }
                    />

                    <CheckboxGroup
                        title="Auscultation"
                        options={auscultationOptions}
                        values={respiratory.auscultation}
                        onChange={(val) =>
                            setRespiratory({ ...respiratory, auscultation: val as RespiratoryTest["auscultation"] })
                        }
                    />

                    <CheckboxGroup
                        title="Cough"
                        options={coughOptions}
                        values={respiratory.cough}
                        onChange={(val) =>
                            setRespiratory({ ...respiratory, cough: val as RespiratoryTest["cough"] })
                        }
                    />

                    <CheckboxGroup
                        title="Secretion"
                        options={secretionOptions}
                        values={respiratory.secretion}
                        onChange={(val) =>
                            setRespiratory({ ...respiratory, secretion: val as RespiratoryTest["secretion"] })
                        }
                    />

                    <CheckboxGroup
                        title="Secretion Color"
                        options={colorOptions}
                        values={respiratory.secretionColor}
                        onChange={(val) =>
                            setRespiratory({ ...respiratory, secretionColor: val as RespiratoryTest["secretionColor"] })
                        }
                    />
                </div>
            </div>

            {/* Treatment Plan */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center">Treatment Plan</h2>

                <div className="w-full overflow-x-auto">
                    <table className="w-full table-auto text-sm md:text-base border">

                        {/* HEADER (desktop only) */}
                        <thead className="hidden md:table-header-group">
                            <tr>
                                <th className="border p-2 w-10">#</th>
                                <th className="border p-2">Assessment Findings</th>
                                <th className="border p-2">Goals of the Care Plan</th>
                                <th className="border p-2">Prioritization</th>
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {treatmentPlan.assessmentFindings.map((_, index) => (
                                <tr
                                    key={index}
                                    className="block md:table-row md:border-0"
                                >
                                    {/* MOBILE TITLE */}
                                    <td className="md:hidden font-semibold p-2 text-center">
                                        {index + 1}
                                    </td>

                                    {/* INDEX (desktop only) */}
                                    <td className="hidden md:table-cell border p-2 text-center">
                                        {index + 1}
                                    </td>

                                    {/* Assessment */}
                                    <td className="block md:table-cell border-t md:border p-2 first:border-t-0">
                                        <p className="md:hidden text-xs font-semibold mb-1">
                                            Assessment Findings
                                        </p>
                                        <textarea
                                            className="w-full p-2 resize-none"
                                            rows={2}
                                            value={treatmentPlan.assessmentFindings[index]}
                                            onChange={(e) =>
                                                updateTreatment("assessmentFindings", index, e.target.value)
                                            }
                                        />
                                    </td>

                                    {/* Goals */}
                                    <td className="block md:table-cell border-t md:border p-2 first:border-t-0">
                                        <p className="md:hidden text-xs font-semibold mb-1">
                                            Goals
                                        </p>
                                        <textarea
                                            className="w-full p-2 resize-none"
                                            rows={2}
                                            value={treatmentPlan.goals[index]}
                                            onChange={(e) =>
                                                updateTreatment("goals", index, e.target.value)
                                            }
                                        />
                                    </td>

                                    {/* Prioritization */}
                                    <td className="block md:table-cell border-t md:border p-2 first:border-t-0">
                                        <p className="md:hidden text-xs font-semibold mb-1">
                                            Prioritization
                                        </p>
                                        <textarea
                                            rows={2}
                                            className="w-full p-2 resize-none"
                                            placeholder="1st, 2nd..."
                                            value={treatmentPlan.prioritization[index]}
                                            onChange={(e) =>
                                                updateTreatment("prioritization", index, e.target.value)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <button
                type="submit"
                className="hover:bg-[#1e2939] text-white px-4 py-2 rounded bg-blue-700 mt-4 duration-500">
                Submit
            </button>
        </form>
    );
}