import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
  depth?: number;
};

export function TiltCard({
  children,
  className = "",
  intensity = 12,
  glare = true,
  depth = 40,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const hover = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22 });
  const sy = useSpring(y, { stiffness: 220, damping: 22 });
  const sh = useSpring(hover, { stiffness: 180, damping: 20 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const lift = useTransform(sh, [0, 1], [0, -6]);
  const scale = useTransform(sh, [0, 1], [1, 1.015]);

  const glareX = useTransform(sx, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(sy, [-0.5, 0.5], ["0%", "100%"]);
  const glareBg = useTransform(
    [glareX, glareY, sh] as never,
    ([gx, gy, h]: (string | number)[]) =>
      `radial-gradient(520px circle at ${gx} ${gy}, rgba(121,249,202,${0.22 * (h as number)}), transparent 45%)`,
  );
  const glareOpacity = useTransform(sh, [0, 1], [0, 1]);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleEnter = () => hover.set(1);
  const handleLeave = () => {
    x.set(0);
    y.set(0);
    hover.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        y: lift,
        scale,
        transformStyle: "preserve-3d",
        transformPerspective: 1200,
      }}
      className={`relative [&>*]:[transform-style:preserve-3d] ${className}`}
    >
      {/* shadow plate — sits behind, catches lift */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-2 rounded-[inherit] bg-black/60 blur-2xl"
        style={{ opacity: glareOpacity, transform: "translateZ(-40px)" }}
      />

      {/* depth-lifted content */}
      <div
        style={{ transform: `translateZ(${depth}px)`, transformStyle: "preserve-3d" }}
        className="h-full relative"
      >
        {children}
      </div>

      {/* glare */}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-screen"
          style={{ background: glareBg, opacity: glareOpacity, transform: "translateZ(60px)" }}
        />
      )}

      {/* edge highlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-primary-container/0"
        style={{
          transform: "translateZ(1px)",
          boxShadow: useTransform(
            sh,
            [0, 1],
            [
              "inset 0 0 0 1px rgba(121,249,202,0.00)",
              "inset 0 0 0 1px rgba(121,249,202,0.35), 0 30px 60px -20px rgba(0,240,180,0.25)",
            ],
          ),
        }}
      />
    </motion.div>
  );
}
