import { useRef, useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function BackgroundSquares({

    borderColor = "#333", // Darker border for subtlety
    squareSize = 40,
    hoverFillColor = "#222",
}) {
    const containerRef = useRef(null);
    const [gridSize, setGridSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setGridSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    const numCols = Math.ceil(gridSize.width / squareSize);
    const numRows = Math.ceil(gridSize.height / squareSize);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 -z-10 w-full h-full overflow-hidden bg-[#0a0a0a]" // Very dark base
        >
            {/* Subtle grid lines */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `linear-gradient(to right, ${borderColor} 1px, transparent 1px), linear-gradient(to bottom, ${borderColor} 1px, transparent 1px)`,
                    backgroundSize: `${squareSize}px ${squareSize}px`,
                    opacity: 0.15
                }}
            />

            <div className="absolute inset-0 flex flex-wrap content-start">
                {Array.from({ length: numRows * numCols }).map((_, i) => (
                    <Square key={i} size={squareSize} hoverFillColor={hoverFillColor} />
                ))}
            </div>

            {/* Radial fade for depth */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)]" />
        </div>
    );
}

const Square = ({ size }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={{ width: size, height: size }}
            className="relative transition-colors duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isHovered && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-primary/20" // Use primary color for hover but very subtle
                />
            )}
        </div>
    );
};

export default BackgroundSquares;
