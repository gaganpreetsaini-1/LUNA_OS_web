import { motion, useInView } from "framer-motion";
import { useRef, type CSSProperties, type ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
  delay?: number;
  wordMode?: boolean;
  /**
   * Paint each letter with the Luna text gradient directly, bypassing the
   * broken `-webkit-background-clip: text` inheritance across per-letter
   * transform stacking contexts (rotateX).
   */
  gradient?: boolean;
};

/**
 * Per-token reveal. Each token gets its OWN overflow-hidden mask so
 * multi-line wrapping works — a single outer overflow-hidden would
 * clip everything below the first line.
 */
export function AnimatedText({
  text,
  as: Tag = "span",
  className = "",
  stagger = 0.025,
  delay = 0,
  wordMode = false,
  gradient = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const parts = wordMode ? text.split(" ") : Array.from(text);

  const gradientStyle: CSSProperties = gradient
    ? {
        backgroundImage:
          "linear-gradient(120deg, var(--primary-container), var(--secondary-container) 60%, #a0fff0)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }
    : {};

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {parts.map((p, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ perspective: 800, lineHeight: 1.05 }}
        >
          <motion.span
            initial={{ y: "110%", rotateX: -70, opacity: 0 }}
            animate={inView ? { y: 0, rotateX: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.75,
              ease: [0.2, 0.8, 0.2, 1],
              delay: delay + i * stagger,
            }}
            className="inline-block whitespace-pre will-change-transform"
            style={{ transformOrigin: "50% 100%", ...gradientStyle }}
          >
            {p === " " ? "\u00A0" : p}
            {wordMode && i < parts.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
