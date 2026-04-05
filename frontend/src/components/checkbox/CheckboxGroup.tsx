export default function CheckboxGroup({
    title,
    options,
    values,
    onChange,
}: {
    title: string;
    options: string[];
    values: string[];
    onChange: (val: string[]) => void;
}) {
    return (
        <div className="space-y-3">
            <p className="font-medium">{title}</p>

            <div className="flex flex-wrap gap-x-8 gap-y-3">
                {options.map((opt) => (
                    <label
                        key={opt}
                        className="flex items-start gap-2 text-sm cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            className="mt-1"
                            checked={values.includes(opt)}
                            onChange={() =>
                                onChange(
                                    values.includes(opt)
                                        ? values.filter((v) => v !== opt)
                                        : [...values, opt]
                                )
                            }
                        />
                        <span className="leading-snug">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}