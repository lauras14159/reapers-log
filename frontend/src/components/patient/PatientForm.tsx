
import { useState } from "react";
import type { Patient, MusculoskeletalEvaluation, FunctionalAssessment, AlgoPlusScore, Brace, GaitTraining, LivingAids, SittingPosition, PainScale } from "../types/patient";
import PainScaleRating from "../Scale/PainScale";

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

    const gaitOptions: GaitTraining = [
        "Full weight bearing",
        "Inside the room",
        "Partial weight bearing",
        "Outside the room",
        "Without weight bearing",
    ];

    const livingAidOptions: LivingAids = ["Walker", "Crutches", "Stick", "Brace"];

    const sittingOptions: SittingPosition = ["Side of the bed", "On Chair"];

    // Generic toggle function for checkbox arrays
    const toggleOption = <T extends string>(option: T, array: T[], setter: (v: T[]) => void) => {
        setter(array.includes(option) ? array.filter(o => o !== option) : [...array, option]);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const functionalAssessment: FunctionalAssessment = {
            patient: {
                ...patient,
                admissionTypeOther: patient.admissionType.includes("Other") ? admissionOther : undefined,
                riskFactorsOther: patient.riskFactors.includes("Other") ? riskOther : undefined,
            },
            musculoskeletalEvaluation: musculoskeletal,
        };

        console.log("Functional Assessment Submitted:", functionalAssessment);
        alert("Form submitted! Check console for object.");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white shadow rounded-md">
            <h2 className="text-xl font-semibold mb-4">Patient Information</h2>

            {/* Name & Age */}
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block font-medium mb-1">Date of surgery / accident</label>
                    <input
                        type="date"
                        className="border p-2 rounded w-full"
                        value={patient.dateOfAccident}
                        onChange={e => setPatient({ ...patient, dateOfAccident: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">First Session Date</label>
                    <input
                        type="date"
                        className="border p-2 rounded w-full"
                        value={patient.firstSessionDate}
                        onChange={e => setPatient({ ...patient, firstSessionDate: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Time</label>
                    <input
                        type="time"
                        className="border p-2 rounded w-full"
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
                <h2 className="text-xl font-semibold">Musculoskeletal Evaluation</h2>

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

            {/* Functional Assessment Table */}
            <h2 className="text-xl font-semibold mt-6 mb-2">Functional Assessment</h2>
            <h3 className="text-lg mb-2 space-x-5">
                <span className="font-semibold">Scoring:</span>
                <span>0 = Impossible </span>
                <span>1 = Possible with difficulty </span>
                <span>2 = Normal</span>
            </h3>
            <table className="w-full border-collapse border border-gray-300 text-center">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Date</th>
                        {[...Array(5)].map((_, idx) => (
                            <th key={idx} className="border p-2">
                                <input
                                    type="date"
                                    className="w-full text-center"
                                />
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
                            <td className="border p-2 text-left font-medium">{field}</td>
                            {[...Array(5)].map((_, idx) => (
                                <td key={idx} className="border p-2">
                                    <input
                                        type="number"
                                        min={0}
                                        max={2}
                                        className="w-full p-1 text-center"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}

                    <tr>
                        <td className="border p-2 text-left font-medium">Total</td>
                        {[...Array(5)].map((_, idx) => (
                            <td key={idx} className="border p-2">
                                <input
                                    type="text"
                                    className="p-1 w-full text-center"
                                />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>

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
                <div className="flex flex-row gap-x-10">
                    <div className="mb-4 flex items-center gap-x-2">
                        <p className="font-medium">Pain Scale</p>

                        <label className="flex items-center gap-2 pl-6">
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
                            className="border p-1 rounded w-16"
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
                    <div className="mb-4 flex items-center gap-x-2">
                        <label className="flex items-center gap-2 font-medium">
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
                            className="border p-1 rounded w-16"
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

            <PainScaleRating
                value={painScale.painScaleRate}
                onChange={val =>
                    setPainScale({ ...painScale, painScaleRate: val })
                }
            />

            <button
                type="submit"
                className="hover:bg-[#1e2939] text-white px-4 py-2 rounded bg-blue-700 mt-4 duration-500"
            >
                Submit
            </button>
        </form>
    );
}