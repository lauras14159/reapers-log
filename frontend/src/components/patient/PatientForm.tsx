
import { useState } from "react";
import type { Patient, MusculoskeletalEvaluation, AlgoPlusScore, Brace, GaitTraining, LivingAids, SittingPosition, PainScale, MotorRow, MotorTesting, RespiratoryTest, TreatmentPlan, PTWeek, FunctionalField } from "../types/patient";
import PainScaleRating from "../Scale/PainScale";
import CheckboxGroup from "../checkbox/CheckboxGroup";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { usePatientStore } from "../hooks/usePatients";
import { Bin } from "../../svg/bin";
import { ArrowDown } from "../../svg/arrowDown";
import generatePatientCode from "../../utils/GeneratePatientCode";

export default function PatientForm() {
    // Patient state
    const [patient, setPatient] = useState<Patient>({
        _id: undefined,
        id: undefined,
        patientCode: "",
        fullName: "",
        age: 0,
        dateOfBirth: "",
        sex: "Male",
        dateOfAccident: "",
        firstSessionDate: "",
        time: "",
        admissionType: [],
        riskFactors: [],
        indications: "",
        contraindications: "",
        precautions: "",
        history: "",
        period: "",
    });

    const admissionOptions: Patient["admissionType"] = ["Orthopedic", "Pulmonary", "Neurologic", "Other"];
    const riskOptions: Patient["riskFactors"] = ["Smoking", "Overweight", "Other"];
    const [gaitTraining, setGaitTraining] = useState<GaitTraining>([]);
    const [livingAids, setLivingAids] = useState<LivingAids>([]);
    const [brace, setBrace] = useState<Brace>({ braceField: "" });
    const [algoPlus, setAlgoPlus] = useState<AlgoPlusScore>({
        algoChecked: false,
        algoPlusScore: 0,
        algoPlusScale: [],
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
        { name: "Abductors", right: createEmptySide(), left: createEmptySide() },
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

    // PT Sessions state
    const [ptSchedule, setPtSchedule] = useState<PTWeek[]>([
        {
            weekNumber: 1,
            date: "",
            sessions: [{
                note: "",
                sessionNumber: 1
            }],
        },
    ]);
    // Function to add a new week
    const addWeek = () => {
        setPtSchedule([
            ...ptSchedule,
            {
                weekNumber: ptSchedule.length + 1,
                date: "",
                sessions: [{ note: "", sessionNumber: 1 }],
            },
        ]);
    };
    // Function to add a session to a specific week
    const addSession = (weekIndex: number) => {
        const updated = [...ptSchedule];
        updated[weekIndex].sessions.push({
            note: "",
            sessionNumber: 0
        });
        setPtSchedule(updated);
    };
    const updateSession = (weekIndex: number, sessionIndex: number, value: string) => {
        const updated = [...ptSchedule];
        updated[weekIndex].sessions[sessionIndex].note = value;
        setPtSchedule(updated);
    };
    const updateWeekDate = (weekIndex: number, value: string) => {
        const updated = [...ptSchedule];
        updated[weekIndex].date = value;
        setPtSchedule(updated);
    };
    const normalizeWeeks = (weeks: PTWeek[]): PTWeek[] => {
        return weeks.map((w, i) => ({
            ...w,
            weekNumber: i + 1,
        }));
    };
    const deleteWeek = (weekIndex: number) => {
        let updated = ptSchedule.filter((_, i) => i !== weekIndex);

        // keep at least 1 week
        if (updated.length === 0) {
            updated = [
                {
                    weekNumber: 1,
                    date: "",
                    sessions: [
                        {
                            note: "",
                            sessionNumber: 0
                        }
                    ]
                }
            ];
        }

        setPtSchedule(normalizeWeeks(updated));
    };
    const deleteSession = (weekIndex: number, sessionIndex: number) => {
        const updated = [...ptSchedule];

        updated[weekIndex].sessions = updated[weekIndex].sessions.filter(
            (_, i) => i !== sessionIndex
        );

        // keep at least 1 session
        if (updated[weekIndex].sessions.length === 0) {
            updated[weekIndex].sessions.push({
                note: "",
                sessionNumber: 0
            });
        }

        setPtSchedule(updated);
    };

    // Function to calculate age from DOB
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth();
        if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--; // Subtract 1 year if birthday hasn't occurred yet this year
        }
        return age;
    };
    const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const dob = e.target.value;
        setPatient({
            ...patient,
            dateOfBirth: dob,
            age: calculateAge(dob), // Calculate and update age when DOB changes
        });
    };

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

    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const { savePatient, patients, fetchPatients } = usePatientStore();
    const [showPTSessions, setShowPTSessions] = useState(false);

    const emptyArray = [0, 0, 0, 0, 0];
    const [functionalField, setFunctionalField] = useState<FunctionalField>({
        dateFunctionalField: ["", "", "", "", ""],
        sitting: [...emptyArray],
        standing: [...emptyArray],
        usingLivingAid: [...emptyArray],
        goingToRestroom: [...emptyArray],
        stairs: [...emptyArray],
        puttingShoesOrSocks: [...emptyArray],
        walking10Meters: [...emptyArray],
        total: ["", "", "", "", ""]
    });
    const functionalRows = [
        { key: "sitting", label: "Sitting" },
        { key: "standing", label: "Standing" },
        { key: "usingLivingAid", label: "Using living aid" },
        { key: "goingToRestroom", label: "Going to restroom" },
        { key: "stairs", label: "Going up/down stairs" },
        { key: "puttingShoesOrSocks", label: "Putting shoes/socks" },
        { key: "walking10Meters", label: "Walking 10 meters" }
    ] as const;


    useEffect(() => {
        if (!id) return;
        if (patients.length === 0) {
            fetchPatients();
            return;
        }

        const existingPatient = patients.find((p) => p._id === id); if (!existingPatient) return;

        setPatient(existingPatient);

        setPtSchedule((existingPatient).ptSchedule || []);

        const ff = existingPatient.functionalField;

        setFunctionalField({
            dateFunctionalField: ff?.dateFunctionalField || ["", "", "", "", ""],

            sitting: Array.isArray(ff?.sitting) ? ff.sitting : [0, 0, 0, 0, 0],
            standing: Array.isArray(ff?.standing) ? ff.standing : [0, 0, 0, 0, 0],
            usingLivingAid: Array.isArray(ff?.usingLivingAid) ? ff.usingLivingAid : [0, 0, 0, 0, 0],
            goingToRestroom: Array.isArray(ff?.goingToRestroom) ? ff.goingToRestroom : [0, 0, 0, 0, 0],
            stairs: Array.isArray(ff?.stairs) ? ff.stairs : [0, 0, 0, 0, 0],
            puttingShoesOrSocks: Array.isArray(ff?.puttingShoesOrSocks) ? ff.puttingShoesOrSocks : [0, 0, 0, 0, 0],
            walking10Meters: Array.isArray(ff?.walking10Meters) ? ff.walking10Meters : [0, 0, 0, 0, 0],

            total: Array.isArray(ff?.total) ? ff.total : ["", "", "", "", ""],
        });

        setGaitTraining(existingPatient.gaitTraining || []);
        setLivingAids(existingPatient.livingAids || []);
        setBrace(existingPatient.brace || { braceField: "" });

        setAlgoPlus(
            existingPatient.algoPlus || {
                algoChecked: false,
                algoPlusScore: 0,
                algoPlusScale: [],
            }
        );

        setSittingPosition(existingPatient.sittingPosition || []);

        setPainScale(
            existingPatient.painScale || {
                numeric: false,
                score: 0,
                painScaleRate: 0,
            }
        );

        setMusculoskeletal(
            existingPatient.musculoskeletal || {
                rangeOfMotion: [],
                upperLimbsROM: {},
                lowerLimbsROM: {},
                spineROM: {},
            }
        );

        setRespiratory(
            existingPatient.respiratory || {
                breathType: [],
                auscultation: [],
                cough: [],
                secretion: [],
                secretionColor: [],
            }
        );

        setMotorTesting(
            existingPatient.motorTesting || {
                motorDates: ["", "", "", "", ""],
                rows: motorRowsTemplate,
            }
        );

        setTreatmentPlan(
            existingPatient.treatmentPlan || {
                assessmentFindings: ["", "", "", "", ""],
                goals: ["", "", "", "", ""],
                prioritization: ["", "", "", "", ""],
            }
        );
    }, [id, patients]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newCode = generatePatientCode(patients);

        const safe = (v: any, fallback: any) =>
            v === undefined ? fallback : v;

        const finalPatient = {
            ...patient,
            id: patient.id || crypto.randomUUID(),
            patientCode: isEdit ? patient.patientCode : newCode,
            functionalField: safe(functionalField, {
                dateFunctionalField: [],
                sitting: [],
                standing: [],
                usingLivingAid: [],
                goingToRestroom: [],
                stairs: [],
                puttingShoesOrSocks: [],
                walking10Meters: [],
                total: [],
            }),

            ptSchedule: safe(ptSchedule, []),
            gaitTraining: safe(gaitTraining, []),
            livingAids: safe(livingAids, []),
            brace: safe(brace, { braceField: "" }),
            algoPlus: safe(algoPlus, {
                algoChecked: false,
                algoPlusScore: 0,
                algoPlusScale: [],
            }),
            sittingPosition: safe(sittingPosition, []),
            painScale: safe(painScale, {
                numeric: false,
                score: 0,
                painScaleRate: 0,
            }),
            musculoskeletal: safe(musculoskeletal, {
                rangeOfMotion: [],
            }),
            respiratory: safe(respiratory, {
                breathType: [],
                auscultation: [],
                cough: [],
                secretion: [],
                secretionColor: [],
            }),
            motorTesting: safe(motorTesting, {
                motorDates: [],
                rows: [],
            }),
            treatmentPlan: safe(treatmentPlan, {
                assessmentFindings: [],
                goals: [],
                prioritization: [],
            }),

            admissionTypeOther: patient.admissionType.includes("Other")
                ? patient.admissionTypeOther || ""
                : undefined,

            riskFactorsOther: patient.riskFactors.includes("Other")
                ? patient.riskFactorsOther || ""
                : undefined,
        };
        await savePatient(finalPatient);

        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>

            {/* Name & Age */}
            <div className="flex md:flex-row flex-col gap-x-10 gap-y-5">

                {/* Patient Code + Full Name */}
                <div className="flex flex-row gap-3 items-end w-full">

                    {/* Code */}
                    <div className="flex flex-col shrink-0 max-w-[40%]">
                        <label className="block font-medium mb-1 invisible">Code</label>
                        <div className="px-3 py-2 border rounded bg-gray-100 truncate">
                            {patient?.patientCode || "P---"}
                        </div>
                    </div>

                    {/* Full Name */}
                    <div className="flex flex-col flex-1 min-w-0">
                        <label className="block font-medium mb-1">Full Name*</label>
                        <input
                            required
                            type="text"
                            placeholder="Full Name"
                            className="border p-2 rounded w-full"
                            value={patient.fullName}
                            onChange={e => setPatient({ ...patient, fullName: e.target.value })}
                        />
                    </div>

                </div>

                {/* DOB */}
                <div>
                    <label className="block font-medium mb-1">Date of Birth</label>
                    <input
                        type="date"
                        className="border p-2 rounded md:w-full w-1/2"
                        value={patient.dateOfBirth}
                        onChange={handleDobChange}
                    />
                </div>

                {/* Age */}
                <div>
                    <label className="block font-medium mb-1">Age</label>
                    <input
                        type="number"
                        placeholder="Age"
                        className="border p-2 rounded md:w-1/2 w-1/4"
                        value={patient.age}
                        readOnly
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
                        className="border p-3 sm:p-2 rounded w-fit md:w-full text-base"
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
                        className="border p-3 sm:p-2 rounded w-fit md:w-full text-base"
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
                        className="border p-3 sm:p-2 rounded w-fit md:w-full text-base"
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
                            value={patient.admissionTypeOther || ""}
                            onChange={e =>
                                setPatient({
                                    ...patient,
                                    admissionTypeOther: e.target.value
                                })
                            }
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
                            value={patient.riskFactorsOther || ""}
                            onChange={e =>
                                setPatient({
                                    ...patient,
                                    riskFactorsOther: e.target.value
                                })
                            }
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
                <div>
                    <label className="block font-medium mb-1">History</label>
                    <textarea
                        placeholder="History"
                        className="border p-2 rounded w-full mb-2"
                        value={patient.history}
                        onChange={e => setPatient({ ...patient, history: e.target.value })}
                    />

                </div>
            </div>

            {/* pt sessions and assessments will go here */}
            <div className="py-5 space-y-6">
                {/* Dropdown Header */}
                <button
                    type="button"
                    onClick={() => setShowPTSessions(prev => !prev)}
                    className="w-full flex space-x-2 items-center text-lg font-semibold"
                >
                    <span>PT Sessions</span>
                    <ArrowDown
                        width={20}
                        fill="black"
                        className={`transition-transform duration-200 ${showPTSessions ? "rotate-180" : ""
                            }`}
                    />
                </button>

                {/* Dropdown Content */}
                {showPTSessions && (
                    <>
                        {ptSchedule.map((week, weekIndex) => (
                            <div key={weekIndex} className="border rounded p-4 space-y-4">

                                {/* Week Header */}
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <h3 className="font-semibold">Week {week.weekNumber}</h3>
                                    <div className="flex gap-3 items-center">
                                        <input
                                            type="date"
                                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={week.date}
                                            onChange={(e) => updateWeekDate(weekIndex, e.target.value)}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => deleteWeek(weekIndex)}
                                            disabled={ptSchedule.length === 1}
                                            className={`p-2 rounded transition
                                ${ptSchedule.length === 1
                                                    ? "opacity-30 cursor-not-allowed"
                                                    : "hover:bg-red-100"
                                                }`}
                                        >
                                            <Bin fill="#D2042D" width={20} />
                                        </button>
                                    </div>
                                </div>

                                {/* Sessions */}
                                <div className="space-y-3">
                                    {week.sessions.map((session, sessionIndex) => (
                                        <div key={sessionIndex} className="flex gap-3 items-start">

                                            <div className="flex-1">
                                                <label className="block font-medium mb-1">
                                                    Session {sessionIndex + 1}
                                                </label>

                                                <textarea
                                                    placeholder={`Session ${sessionIndex + 1}`}
                                                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    value={session.note}
                                                    onChange={(e) =>
                                                        updateSession(weekIndex, sessionIndex, e.target.value)
                                                    }
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => deleteSession(weekIndex, sessionIndex)}
                                                className={`mt-7 p-2 rounded transition
                                    ${week.sessions.length === 1
                                                        ? "opacity-30 cursor-not-allowed"
                                                        : ""
                                                    }`}
                                            >
                                                <Bin fill="#D2042D" width={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Add Session */}
                                <button
                                    type="button"
                                    onClick={() => addSession(weekIndex)}
                                    className="text-blue-600 text-sm hover:border p-2 rounded-lg"
                                >
                                    + Add Session
                                </button>
                            </div>
                        ))}

                        {/* Add Week */}
                        <button
                            type="button"
                            onClick={addWeek}
                            className="bg-blue-700 hover:opacity-90 px-4 py-2 rounded text-white"
                        >
                            + Add Week
                        </button>
                    </>
                )}
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
                    <div className="grid md:grid-cols-3 gap-4">
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
                        <div>
                            <label className="block mb-1">Wrist</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={musculoskeletal.upperLimbsROM?.wrist || ""}
                                onChange={e =>
                                    setMusculoskeletal({
                                        ...musculoskeletal,
                                        upperLimbsROM: { ...musculoskeletal.upperLimbsROM, wrist: e.target.value },
                                    })
                                }
                            />

                        </div>
                    </div>
                </div>

                {/* Lower Limbs */}
                <div className="space-y-2">
                    <label className="font-medium">Lower Limbs ROM</label>
                    <div className="grid md:grid-cols-3 gap-4">
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
                        <div>
                            <label className="block mb-1">Ankle</label>
                            <input
                                type="text"
                                className="border p-2 rounded w-full"
                                value={musculoskeletal.lowerLimbsROM?.ankle || ""}
                                onChange={e =>
                                    setMusculoskeletal({
                                        ...musculoskeletal,
                                        lowerLimbsROM: { ...musculoskeletal.lowerLimbsROM, ankle: e.target.value },
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Spine */}
                <div className="space-y-2">
                    <label className="font-medium">Spine ROM</label>
                    <div className="grid md:grid-cols-2 gap-4">
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

                        {/* HEADER */}
                        <thead>
                            <tr>
                                <th className="border p-2 text-left">Date</th>

                                {[...Array(5)].map((_, idx) => (
                                    <th key={idx} className="border p-2">
                                        <input
                                            type="date"
                                            value={functionalField.dateFunctionalField[idx] || ""}
                                            onChange={(e) => {
                                                const updated = [...functionalField.dateFunctionalField];
                                                updated[idx] = e.target.value;

                                                setFunctionalField(prev => ({
                                                    ...prev,
                                                    dateFunctionalField: updated
                                                }));
                                            }}
                                            className="text-center bg-transparent outline-none"
                                        />
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        {/* BODY */}
                        <tbody>
                            {functionalRows.map(({ key, label }) => (
                                <tr key={key}>
                                    <td className="border p-2 font-medium">{label}</td>

                                    {[...Array(5)].map((_, idx) => (
                                        <td key={idx} className="border p-2">
                                            <input
                                                type="number"
                                                min={0}
                                                max={2}
                                                value={functionalField[key]?.[idx] ?? ""}
                                                onChange={(e) => {
                                                    const newValue = +e.target.value;

                                                    setFunctionalField(prev => {
                                                        const updated = [...(prev[key] || [0, 0, 0, 0, 0])];
                                                        updated[idx] = newValue;

                                                        return {
                                                            ...prev,
                                                            [key]: updated
                                                        };
                                                    });
                                                }}
                                                className="w-full text-center bg-transparent outline-none"
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}

                            {/* TOTAL */}
                            <tr>
                                <td className="border p-2 font-semibold">Total</td>

                                {[...Array(5)].map((_, idx) => (
                                    <td key={idx} className="border p-2">
                                        <input
                                            type="text"
                                            value={functionalField.total?.[idx] ?? ""}
                                            onChange={(e) => {
                                                const updated = [...(functionalField.total || ["", "", "", "", ""])];
                                                updated[idx] = e.target.value;

                                                setFunctionalField(prev => ({
                                                    ...prev,
                                                    total: updated
                                                }));
                                            }}
                                            className="w-full text-center bg-transparent outline-none"
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
                        value={patient.period}
                        onChange={e => setPatient({
                            ...patient,
                            period: e.target.value,
                        })}
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
                        <tr className="border block md:table-row">
                            <td className="text-center items-center font-semibold p-2 block md:hidden border-b text-base">
                                Numerical Scale
                            </td>
                            <td className="border-b md:border p-2 align-top block md:table-cell" rowSpan={5}>
                                <PainScaleRating
                                    value={painScale.painScaleRate}
                                    onChange={val =>
                                        setPainScale({ ...painScale, painScaleRate: val })
                                    }
                                />
                            </td>
                            <td className="border-b p-2 block md:hidden">
                                Pain management is satisfactory when the score remains strictly &lt; 4
                            </td>
                            <td className="md:border border-b p-2 text-center items-center font-semibold block md:hidden text-base">
                                Algo plus scale (for patients not able to communicate)
                            </td>
                            <td className="md:border p-2 text-left md:table-cell">
                                <label className="flex gap-x-2">
                                    <input
                                        type="checkbox"
                                        checked={algoPlus.algoPlusScale.includes("Facial expressions")}
                                        onChange={e =>
                                            setAlgoPlus({
                                                ...algoPlus,
                                                algoPlusScale: e.target.checked
                                                    ? [...algoPlus.algoPlusScale, "Facial expressions"]
                                                    : algoPlus.algoPlusScale.filter((v) => v !== "Facial expressions"),
                                            })
                                        }
                                    />
                                    <span className="leading-tight">
                                        1. Facial expressions: Frowning, grimacing, wincing, clenched teeth, unexpressive.
                                    </span>
                                </label>
                            </td>
                        </tr>

                        <tr className="md:border-b block md:table-row">
                            <td className="border-x p-2 text-left md:table-cell">
                                <label className="flex gap-x-2">
                                    <input
                                        type="checkbox"
                                        checked={algoPlus.algoPlusScale.includes("Look")}
                                        onChange={e =>
                                            setAlgoPlus({
                                                ...algoPlus,
                                                algoPlusScale: e.target.checked
                                                    ? [...algoPlus.algoPlusScale, "Look"]
                                                    : algoPlus.algoPlusScale.filter((v) => v !== "Look"),
                                            })
                                        }
                                    />
                                    <span className="leading-tight">
                                        2. Look: Inattentive, blank stare, distant or imploring, teary eyed, closed eyes.
                                    </span>
                                </label>
                            </td>
                        </tr>

                        <tr className="md:border-b block md:table-row">
                            <td className="border-x p-2 text-left md:table-cell">
                                <label className="flex gap-x-2">
                                    <input
                                        type="checkbox"
                                        checked={algoPlus.algoPlusScale.includes("Complaints")}
                                        onChange={e =>
                                            setAlgoPlus({
                                                ...algoPlus,
                                                algoPlusScale: e.target.checked
                                                    ? [...algoPlus.algoPlusScale, "Complaints"]
                                                    : algoPlus.algoPlusScale.filter((v) => v !== "Complaints"),
                                            })
                                        }
                                    />
                                    <span className="leading-tight">
                                        3. Complaints: “Ow-ouch”, that hurts, groaning, screaming.
                                    </span>
                                </label>
                            </td>
                        </tr>

                        <tr className="md:border-b block md:table-row">
                            <td className="border p-2 text-left md:table-cell">
                                <label className="flex gap-x-2">                                    <input
                                    type="checkbox"
                                    checked={algoPlus.algoPlusScale.includes("Body position")}
                                    onChange={e =>
                                        setAlgoPlus({
                                            ...algoPlus,
                                            algoPlusScale: e.target.checked
                                                ? [...algoPlus.algoPlusScale, "Body position"]
                                                : algoPlus.algoPlusScale.filter((v) => v !== "Body position"),
                                        })
                                    }
                                />
                                    <span className="leading-tight">
                                        4. Body position: Withdrawn, guarded, refuses to move, frozen posture.
                                    </span>
                                </label>
                            </td>
                        </tr>
                        <tr className="md:border block md:table-row">
                            <td className="border-x p-2 text-left md:table-cell">
                                <label className="flex gap-x-2">
                                    <input
                                        type="checkbox"
                                        checked={algoPlus.algoPlusScale.includes("Atypical behavior")}
                                        onChange={e =>
                                            setAlgoPlus({
                                                ...algoPlus,
                                                algoPlusScale: e.target.checked
                                                    ? [...algoPlus.algoPlusScale, "Atypical behavior"]
                                                    : algoPlus.algoPlusScale.filter((v) => v !== "Atypical behavior"),
                                            })
                                        }
                                    />
                                    <span className="leading-tight">
                                        5. Atypical behavior: Agitation, aggressivity, grabbing onto something or someone.
                                    </span>
                                </label>
                            </td>
                        </tr>

                        {/* Last row */}
                        <tr className="block md:table-row">
                            <td className="border p-2 hidden md:table-cell">
                                Pain management is satisfactory when the score remains strictly &lt; 4
                            </td>
                            <td className="border p-2 text-left md:table-cell">
                                Pain management is satisfactory when the score remains 2
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
                                    <th key={"r" + i} className="border p-2 item-center">
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
            <div className="pt-10 space-y-6 overflow-x-scroll">
                <h2 className="text-xl font-semibold text-center">
                    Respiratory Test
                </h2>
                <table className="border border-collapse w-fit justify-center mx-auto">
                    <tbody>
                        <tr className="border">
                            <td className="p-4 border w-[20%] font-semibold align-top">
                                Breathing Type
                            </td>
                            <td className="p-4 border">
                                <div className="flex flex-col">
                                    <CheckboxGroup
                                        options={breathOptions}
                                        values={respiratory.breathType}
                                        onChange={(val) => setRespiratory({ ...respiratory, breathType: val as RespiratoryTest["breathType"] })}
                                        title={""}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr className="border">
                            <td className="p-4 border w-[20%] font-semibold align-top">
                                Auscultation
                            </td>
                            <td className="p-4 border">
                                <div className="flex flex-col">
                                    <CheckboxGroup
                                        options={auscultationOptions}
                                        values={respiratory.auscultation}
                                        onChange={(val) => setRespiratory({ ...respiratory, auscultation: val as RespiratoryTest["auscultation"] })}
                                        title={""}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr className="border">
                            <td className="p-4 border w-[20%] font-semibold align-top">
                                Cough
                            </td>
                            <td className="p-4 border">
                                <div className="flex flex-col">
                                    <CheckboxGroup
                                        options={coughOptions}
                                        values={respiratory.cough}
                                        onChange={(val) => setRespiratory({ ...respiratory, cough: val as RespiratoryTest["cough"] })}
                                        title={""}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr className="border">
                            <td className="p-4 border w-[20%] font-semibold align-top">
                                Secretion
                            </td>
                            <td className="p-4 border">
                                <div className="flex flex-col">
                                    <CheckboxGroup
                                        options={secretionOptions}
                                        values={respiratory.secretion}
                                        onChange={(val) => setRespiratory({ ...respiratory, secretion: val as RespiratoryTest["secretion"] })}
                                        title={""}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr className="border">
                            <td className="p-4 border w-[20%] font-semibold align-top">
                                Secretion Color
                            </td>
                            <td className="p-4 border">
                                <div className="flex flex-col">
                                    <CheckboxGroup
                                        options={colorOptions}
                                        values={respiratory.secretionColor}
                                        onChange={(val) => setRespiratory({ ...respiratory, secretionColor: val as RespiratoryTest["secretionColor"] })}
                                        title={""}
                                    />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Treatment Plan */}
            <div className="space-y-4 pt-10">
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
                                    <td className="md:hidden font-semibold p-2 text-center flex justify-center">
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
                                    <td className="block md:table-cell border-t md:border p-2 first:border-t-0 border-b">
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

            <div className="md:justify-start justify-center flex">
                <button
                    type="submit"
                    className="hover:bg-[#1e2939] text-white py-2 bg-blue-700 rounded mt-4 duration-500 max-w-xs md:max-w-40 w-full"
                >
                    {isEdit ? "Save" : "Submit"}
                </button>
            </div>
        </form>
    );
}