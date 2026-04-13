import type { ReactNode } from "react";
import { ArrowDown } from "../../svg/arrowDown";

type AccordionSectionProps = {
    title: string;
    sectionKey: string;
    openSection: string | null;
    setOpenSection: React.Dispatch<React.SetStateAction<string | null>>;
    children: ReactNode;
};

export function AccordionSection({
    title,
    sectionKey,
    openSection,
    setOpenSection,
    children,
}: AccordionSectionProps) {
    const isOpen = openSection === sectionKey;

    const toggle = () => {
        setOpenSection(prev => (prev === sectionKey ? null : sectionKey));
    };

    return (
        <div className="mb-4 rounded-xl bg-white dark:bg-gray-900 shadow-sm transition-all duration-200">

            {/* Header */}
            <button
                type="button"
                onClick={toggle}
                className="
                    w-full flex items-center justify-between
                    px-5 py-4
                    text-left font-semibold
                    rounded-xl
                    transition
                "
            >
                <span className="text-gray-800 dark:text-gray-100 text-xl font-semibold">
                    {title}
                </span>

                <ArrowDown
                    fill="current"
                    width={20}
                    className={`fill-current text-gray-800 dark:text-white transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {/* Content */}
            <div
                className={`
                    grid transition-all duration-300 ease-in-out
                    ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                `}
            >
                <div className="overflow-hidden px-5 pb-5 pt-2">
                    {children}
                </div>
            </div>
        </div>
    );
}