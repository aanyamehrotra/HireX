import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function GlassCard({ children, className, hoverEffect = false, ...props }) {
    return (
        <div
            className={twMerge(
                clsx(
                    "relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm shadow-xl",
                    hoverEffect && "transition-all duration-300 hover:border-white/10 hover:bg-white/10 hover:-translate-y-1",
                    className
                )
            )}
            {...props}
        >
            {/* Subtle noise texture or gradient could go here if needed, but keeping it clean for now */}
            {children}
        </div>
    );
}

export default GlassCard;
