import React from 'react';
import { motion } from 'framer-motion';

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggleIcon = ({ open, className, duration = 0.3 }: { open: boolean, className?: string, duration?: number }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" className={className}>
    <Path
      variants={{
        closed: { d: "M 2 4 L 18 4" },
        open: { d: "M 3 17 L 17 3" }
      }}
      initial={false}
      animate={open ? "open" : "closed"}
      transition={{ duration }}
    />
    <Path
      d="M 2 10 L 18 10"
      variants={{
        closed: { opacity: 1 },
        open: { opacity: 0 }
      }}
      initial={false}
      animate={open ? "open" : "closed"}
      transition={{ duration }}
    />
    <Path
      variants={{
        closed: { d: "M 2 16 L 18 16" },
        open: { d: "M 3 3 L 17 17" }
      }}
      initial={false}
      animate={open ? "open" : "closed"}
      transition={{ duration }}
    />
  </svg>
);