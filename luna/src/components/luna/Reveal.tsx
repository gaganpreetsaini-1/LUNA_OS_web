import { motion, type Variants, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  delay?: number;
  y?: number;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1], delay },
  }),
};

export function Reveal({ children, delay = 0, className, ...rest }: Props) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      custom={delay}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
