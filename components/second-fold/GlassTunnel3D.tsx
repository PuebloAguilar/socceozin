import React from "react";
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion, AnimatePresence } from "framer-motion";

const motion = untypedMotion as any;

interface GlassTunnel3DProps {
  isAnimated: boolean;
  activeIndex: number;
}

const tunnelVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
    rotateX: -20,
  },
  animate: (i: number) => ({
    opacity: 1 - i * 0.15, // Fade out outer layers
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.08, // Staggered delay
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1], // easeOutQuint
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    scale: 1.2,
    transition: {
      delay: (4 - i) * 0.05, // Reverse stagger on exit
      duration: 0.3,
      ease: "easeIn",
    },
  }),
};

const GlassTunnel3D: React.FC<GlassTunnel3DProps> = ({ isAnimated, activeIndex }) => {
  const numLayers = 5;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ perspective: "1000px" }}
      aria-hidden="true"
    >
      <AnimatePresence>
        {isAnimated && (
          <motion.div
            key={activeIndex} // Change key to re-trigger animation on stage change
            className="relative w-full h-full"
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {Array.from({ length: numLayers }).map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={tunnelVariants}
                className="absolute inset-0 border border-white/20 bg-black/10 backdrop-blur-sm"
                style={{
                  borderRadius: `${32 + i * 8}px`, // Slightly different border radius
                  margin: `${i * 16}px`, // Creates the tunnel effect
                  boxShadow: "0 0 20px rgba(0, 166, 245, 0.25)",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlassTunnel3D;
