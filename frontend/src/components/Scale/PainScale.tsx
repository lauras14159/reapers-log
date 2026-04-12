import { useState } from "react";

type PainScaleProps = {
    value?: number;
    onChange?: (value: number) => void;
};

export default function PainScaleRating({ value = 0, onChange }: PainScaleProps) {
    const [internalValue, setInternalValue] = useState(value);

    const currentValue = onChange ? value : internalValue;

    const handleChange = (val: number) => {
        if (onChange) {
            onChange(val);
        } else {
            setInternalValue(val);
        }
    };

    return (
        <div className="w-full max-w-xl p-4">
            <h3 className="text-sm font-semibold mb-2">
                Pain Score (0–10 Numerical Rating)
            </h3>

            {/* Scale numbers */}
            <div className="flex justify-between text-sm pt-3">
                {Array.from({ length: 11 }, (_, i) => (
                    <span key={i}>{i}</span>
                ))}
            </div>

            {/* Slider */}
            <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={currentValue}
                onChange={(e) => handleChange(Number(e.target.value))}
                className="w-full mt-2 accent-gray-900 dark:accent-gray-300 dark:hover:accent-white" />

            {/* Labels */}
            <div className="flex justify-between text-xs mt-1 ">
                <span>No Pain</span>
                <span>Moderate Pain</span>
                <span className="text-center">Worst Pain <br />Possible</span>
            </div>

            {/* Selected value */}
            <div className="mt-3 text-center">
                <span className="text-lg font-bold">{currentValue}</span>
                <span className="text-sm"> / 10</span>
            </div>
        </div>
    );
}