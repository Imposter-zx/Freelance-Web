// Reusable animation variants for Framer Motion

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInDown = {
  initial: { opacity: 0, y: -30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const fadeInRight = {
  initial: { opacity: 0, x: 50 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const rotateIn = {
  initial: { opacity: 0, rotate: -10 },
  whileInView: { opacity: 1, rotate: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.7, ease: "easeOut" }
};

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 }
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: "0 20px 50px rgba(37, 99, 235, 0.3)",
    y: -5
  }
};

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const float = {
  animate: {
    y: [0, -10, 0],
    transition: { 
      duration: 3, 
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};

// 3D Tilt and Premium Interactions
export const cardTilt = {
  initial: { rotateX: 0, rotateY: 0, perspective: 1000 },
  hover: {
    rotateX: 2,
    rotateY: 2,
    scale: 1.02,
    transition: { type: "spring", stiffness: 400, damping: 20 }
  }
};

export const cardHover3D = {
  whileHover: { 
    y: -10,
    rotateX: 5,
    rotateY: 5,
    perspective: 1000,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    transition: { type: "spring", stiffness: 300, damping: 15 }
  }
};
