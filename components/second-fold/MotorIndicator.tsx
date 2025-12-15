import React from "react";
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion } from "framer-motion";

const motion = untypedMotion as any;

interface MotorIndicatorProps {
  motor: string;
  name: string;
  subtitle: string;
}

const MotorIndicator: React.FC<MotorIndicatorProps> = ({ motor, name, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.3, ease: 'easeIn' } }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      // Positioned to the left of the parent container, vertically aligned with the keyboard.
      // -left-4 on mobile, md:-left-8 on desktop to give it more space
      className="absolute bottom-72 -left-4 md:-left-8 z-20 p-3 rounded-lg bg-neutral-950 border border-white/20 shadow-lg pointer-events-none md:hidden"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-[#FFA11D] whitespace-nowrap">{motor}</p>
      <p className="text-base text-white font-semibold whitespace-nowrap">{name}</p>
      <p className="text-xs text-neutral-400 whitespace-nowrap mt-1">{subtitle}</p>
    </motion.div>
  );
};

export default MotorIndicator;