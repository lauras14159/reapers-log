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
        <div className="flex flex-col">
            {title && <p className="font-medium mb-1">{title}</p>}

            <div className="flex flex-row">
                {options.map((opt) => (
                    <label
                        key={opt}
                        className="flex items-center gap-1 text-sm cursor-pointer w-35"
                    >
                        <input
                            type="checkbox"
                            checked={values.includes(opt)}
                            onChange={() =>
                                onChange(
                                    values.includes(opt)
                                        ? values.filter((v) => v !== opt)
                                        : [...values, opt]
                                )
                            }
                        />
                        <span className="truncate">{opt}</span>
                    </label>
                ))}
            </div>
        </div>
    );
}