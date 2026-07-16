import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ShaderBackground } from "@/components/luna/ShaderBackground";
import { AnimatedText } from "@/components/luna/AnimatedText";
import { TiltCard } from "@/components/luna/TiltCard";
import { Reveal } from "@/components/luna/Reveal";
import lunaLogo from "@/assets/luna-logo.png.asset.json";

const DOWNLOAD_URL = "https://sourceforge.net/projects/lunaos/files/latest/download";

export const Route = createFileRoute("/")({
  component: LunaOS,
});


const Icon = ({ name, className = "" }: { name: string; className?: string }) => (
  <span
    className={`material-symbols-outlined leading-none ${className}`}
    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
  >
    {name}
  </span>
);

const features = [
  { icon: "stadia_controller", title: "Gaming Ready", body: "Pre-configured drivers, custom kernel parameters, and gamemode enabled out of the box for maximum FPS and minimal latency." },
  { icon: "speed", title: "Performance First", body: "Bloatware removed. Minimal background services. Chaotic-AUR repositories included for cutting-edge software." },
  { icon: "desktop_windows", title: "KDE Plasma", body: "A heavily customized Plasma environment designed for productivity and aesthetics. Cyber-minimalist, Wayland-optimized." },
  { icon: "update", title: "Rolling Release", body: "Stay on the bleeding edge with Arch underneath. Latest Mesa, kernel, and software the moment they drop." },
];

const advantages = [
  { n: "01", icon: "rocket_launch", title: "Zero Post-Install Setup", body: "Boot, log in, launch Steam. No driver hunting, no config tweaks." },
  { n: "02", icon: "update", title: "Always Current", body: "Rolling release means new kernels, Mesa, Proton, and Wine releases immediately." },
  { n: "03", icon: "desktop_windows", title: "Full Desktop Freedom", body: "Not locked into Gaming Mode. Use KDE Plasma normally while gaming." },
  { n: "04", icon: "speed", title: "Tuned for Performance", body: "GameMode and vm.max_map_count tuned at build level for smooth gameplay." },
  { n: "05", icon: "memory", title: "Broad Hardware Support", body: "NVIDIA (proprietary), AMD (radeon/VCN), and Intel (i915/VirGL) all included." },
  { n: "06", icon: "security", title: "Privacy-Respecting", body: "No telemetry, no account required, fully open source." },
  { n: "07", icon: "usb", title: "Persistent Live USB", body: "Install to USB and carry your entire system in your pocket." },
];

const personas = [
  { icon: "sports_esports", title: "Gamers", body: "Latest Proton, Wine, and GPU drivers without manual configuration." },
  { icon: "movie_edit", title: "Content Creators", body: "Fast, stable system with multimedia tools ready to go." },
  { icon: "terminal", title: "Developers", body: "Arch-based system with a polished desktop experience." },
  { icon: "code", title: "Linux Enthusiasts", body: "Clean, performant alternative to bloated gaming distros." },
  { icon: "podcasts", title: "Streamers", body: "Low-latency PipeWire audio, GameMode, and MangoHud out of the box." },
];

const comparisons = [
  {
    icon: "sports_esports",
    title: "vs. SteamOS",
    points: [
      "Full KDE Plasma — no restricted Gaming Mode lock-in",
      "Pacman + AUR (rolling) vs. Flatpak-only (immutable)",
      "Full customization — modify anything",
      "Capable general-purpose daily driver",
      "NVIDIA + AMD + Intel Vulkan drivers included",
    ],
  },
  {
    icon: "developer_board",
    title: "vs. Pop!_OS",
    points: [
      "Arch rolling vs. Ubuntu cycle — always latest packages",
      "Complete gaming stack: Steam, Wine, Lutris, DXVK, vkd3d, GameMode, MangoHud, gamescope",
      "All GPU drivers preloaded — no manual switching",
      "PipeWire audio, gaming-optimized",
    ],
  },
  {
    icon: "settings_suggest",
    title: "vs. Manjaro / Endeavour",
    points: [
      "Purpose-built and tested gaming stack",
      "Plymouth, SDDM theme, sysctl tuning, Plasma theme pre-configured",
      "Target: gamers, creators, streamers — not general Arch users",
    ],
  },
];

const payload = {
  Gaming: ["Steam", "Lutris", "Wine-GE", "ProtonUp-Qt", "Heroic Launcher", "Bottles"],
  System: ["MangoHud", "GameMode", "PipeWire", "Btop++", "Alacritty", "gamescope"],
};

const minSpecs = [
  { icon: "memory", label: "CPU", value: "x86_64 Dual Core" },
  { icon: "developer_board", label: "RAM", value: "4 GB DDR4" },
  { icon: "storage", label: "Disk", value: "20 GB SSD" },
  { icon: "videogame_asset", label: "GPU", value: "OpenGL 3.3+" },
  { icon: "usb", label: "USB", value: "8 GB Flash Drive" },
];
const recSpecs = [
  { icon: "memory", label: "CPU", value: "Quad Core+ (Ryzen 5 / i5)" },
  { icon: "developer_board", label: "RAM", value: "16 GB+ DDR4/DDR5" },
  { icon: "storage", label: "Disk", value: "50 GB+ NVMe SSD" },
  { icon: "videogame_asset", label: "GPU", value: "Vulkan 1.3+ (RTX / RDNA)" },
  { icon: "usb", label: "USB", value: "USB 3.0+ Flash Drive" },
];

function LunaOS() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div className="relative min-h-screen">
      <ShaderBackground />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-primary-container via-secondary-container to-primary-container"
        style={{ scaleX: progress }}
      />

      <Nav />

      <main className="pt-24">
        <Hero />
        <IntroSplit />
        <FeaturesGrid />
        <MarqueeStrip />
        <AdvantagesSection />
        <PersonasSection />
        <ComparisonSection />
        <PayloadSection />
        <RequirementsSection />
        <InstallationSection />
        <ContactSection />
        <CTASection />

      </main>

      <Footer />
    </div>
  );
}

/* ─────────────── NAV ─────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-void/85 backdrop-blur-2xl border-b border-outline-variant/30 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 md:px-8 h-20">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-xl bg-primary-container/40 blur-xl group-hover:bg-primary-container/70 transition-colors" />
            <img
              src={lunaLogo.url}
              alt="LUNA OS logo"
              width={40}
              height={40}
              className="relative w-10 h-10 object-contain drop-shadow-[0_0_18px_rgba(180,125,255,0.55)] group-hover:rotate-6 transition-transform duration-500"
            />
          </div>
          <span className="font-[var(--font-display)] text-xl font-bold tracking-tight text-primary">
            LUNA<span className="text-primary-container"> OS</span>
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-on-surface-variant">
          {[
            ["Features", "#features"],
            ["Advantages", "#advantages"],
            ["Compare", "#compare"],
            ["Install", "#install"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="relative group hover:text-primary transition-colors"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full bg-primary-container transition-all duration-300" />
            </a>
          ))}
        </nav>

        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          data-text="Download"
          className="btn-glitch relative inline-flex items-center gap-2 bg-primary-container text-void px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-md"
        >
          <Icon name="download" className="text-[16px]" />
          <span className="relative hidden xs:inline">Download</span>
        </a>
      </div>
    </motion.header>
  );
}


/* ─────────────── HERO ─────────────── */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  // Cursor-follow spotlight
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const smx = useSpring(mx, { stiffness: 80, damping: 20 });
  const smy = useSpring(my, { stiffness: 80, damping: 20 });
  const spot = useTransform(
    [smx, smy] as never,
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x}% ${y}%, rgba(192,132,252,0.18), transparent 60%)`,
  );

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-4 sm:px-6"
    >
      {/* cursor spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: spot }}
      />

      {/* Orbital rings + halo + logo */}
      <motion.div
        style={{ y, opacity, scale }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] md:w-[560px] md:h-[560px] rounded-full bg-[radial-gradient(circle,rgba(180,125,255,0.55)_0%,rgba(180,125,255,0)_70%)] animate-breathing-glow mix-blend-screen blur-3xl" />
        <motion.img
          src={lunaLogo.url}
          alt=""
          aria-hidden
          width={300}
          height={300}
          fetchPriority="low"
          decoding="async"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[180px] sm:w-[240px] md:w-[300px] opacity-[0.18] blur-[1px] mix-blend-screen"
        />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="absolute w-[500px] h-[500px] sm:w-[680px] sm:h-[680px] md:w-[820px] md:h-[820px] rounded-full border border-primary-container/10"
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-container shadow-[0_0_20px_rgba(180,125,255,0.9)]" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] md:w-[560px] md:h-[560px] rounded-full border border-primary-container/20"
        >
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-secondary-container shadow-[0_0_16px_rgba(168,85,247,0.9)]" />
        </motion.div>
      </motion.div>

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center max-w-5xl mx-auto flex flex-col items-center w-full"
      >
        <Reveal delay={0}>
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] sm:tracking-[0.3em] text-primary-container uppercase inline-flex items-center gap-2 precise-border px-3 py-1.5 bg-surface/60 backdrop-blur-md rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
            <span className="whitespace-nowrap">v2.0 · Arch · KDE Plasma</span>
          </span>
        </Reveal>

        <h1 className="mt-6 sm:mt-8 font-[var(--font-display)] text-[56px] xs:text-[68px] sm:text-[92px] md:text-[116px] lg:text-[140px] leading-[0.92] tracking-[-0.045em] font-bold text-white">
          <AnimatedText text="Light. Fast." as="span" className="block text-white" />
          <span className="block mt-1 sm:mt-2">
            <AnimatedText
              text="Limitless."
              as="span"
              delay={0.3}
              gradient
              className="inline-block"
            />
          </span>
        </h1>

        <Reveal delay={0.9} className="mt-6 sm:mt-8 max-w-2xl px-2">
          <p className="text-base sm:text-lg md:text-xl text-on-surface-variant/90 leading-relaxed">
            The performance-focused gaming distro designed for the stars.
            Built on Arch, tuned for hardware, delivered with cyber-minimalist precision.
          </p>
        </Reveal>

        <Reveal
          delay={1.1}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full sm:w-auto px-2"
        >
          <a
            href={DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-text="Download ISO"
            className="btn-glitch relative inline-flex items-center justify-center gap-2 bg-primary-container text-void px-6 sm:px-8 py-3.5 sm:py-4 rounded-md font-semibold text-sm w-full sm:w-auto"
          >
            <Icon name="download" className="text-[18px]" />
            <span className="relative">Download ISO — Free</span>
          </a>
          <a
            href="#features"
            className="group inline-flex items-center justify-center gap-2 bg-transparent border border-outline-variant/60 text-primary px-6 sm:px-8 py-3.5 sm:py-4 rounded-md font-semibold text-sm hover:border-primary-container hover:text-primary-container hover:bg-primary-container/5 transition-all w-full sm:w-auto"
          >
            <Icon name="arrow_downward" className="text-[18px] group-hover:translate-y-0.5 transition-transform" />
            Explore Features
          </a>
        </Reveal>

        <Reveal
          delay={1.3}
          className="mt-10 sm:mt-14 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-8 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-muted px-2"
        >
          {["Arch Linux", "KDE Plasma", "Wayland", "PipeWire"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary-container" />
              {t}
            </span>
          ))}
        </Reveal>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-muted flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        <motion.div
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
          className="w-[1px] h-10 bg-gradient-to-b from-primary-container to-transparent"
        />
      </motion.div>
    </section>
  );

}

/* ─────────────── SECTION HEADER ─────────────── */
function SectionHeader({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="relative mb-10 sm:mb-12 md:mb-16 max-w-4xl">
      {/* ambient glow behind title */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-8 w-56 h-56 sm:w-72 sm:h-72 rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle, var(--accent-luna) 0%, transparent 70%)",
        }}
      />
      <Reveal>
        <span className="relative font-mono text-[18px] sm:text-[22px] md:text-[26px] lg:text-[30px] tracking-[0.28em] sm:tracking-[0.34em] text-primary-container uppercase inline-flex items-center gap-3 sm:gap-4 font-semibold">
          <span className="w-10 sm:w-14 h-px bg-primary-container/60" />
          {kicker}
          <span className="w-2 h-2 rounded-full bg-primary-container animate-breathing-glow" />
        </span>
      </Reveal>
      <AnimatedText
        text={title}
        as="h2"
        wordMode
        stagger={0.06}
        className="relative block mt-4 sm:mt-6 font-[var(--font-display)] text-[64px] xs:text-[80px] sm:text-[96px] md:text-[120px] lg:text-[140px] leading-[0.92] font-bold tracking-[-0.045em] text-primary shimmer-text"
      />
      {sub && (
        <Reveal delay={0.2}>
          <p className="relative mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl">{sub}</p>
        </Reveal>
      )}
      {/* Scroll-drawn accent underline */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1], delay: 0.35 }}
        style={{ transformOrigin: "left" }}
        className="relative mt-5 sm:mt-6 h-px w-28 sm:w-32 bg-gradient-to-r from-primary-container via-primary-container/40 to-transparent"
      />
    </div>
  );
}

/* ─────────────── SECTIONS ─────────────── */
function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section
      id={id}
      className={`relative py-14 sm:py-20 md:py-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto border-t border-outline-variant/20 ${className}`}
    >
      {children}
    </section>
  );
}

function IntroSplit() {
  return (
    <Section>
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Reveal>
            <span className="font-mono text-[11px] tracking-[0.3em] text-primary-container uppercase inline-flex items-center gap-2">
              <Icon name="info" className="text-[14px]" />
              What is LUNA OS?
            </span>
          </Reveal>
          <AnimatedText
            text="A live, installable Arch OS engineered for gaming, creation, and speed."
            as="h3"
            wordMode
            stagger={0.04}
            className="block mt-4 font-[var(--font-display)] text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-primary leading-tight"
          />
        </div>
        <Reveal delay={0.15}>
          <div className="relative p-8 rounded-xl precise-border bg-surface/50 backdrop-blur-md border-l-2 border-l-primary-container">
            <Icon name="format_quote" className="text-primary-container text-[36px] absolute -top-4 left-6 bg-void px-2" />
            <p className="text-lg italic text-on-surface-variant leading-relaxed">
              Unlike generic Linux distributions that require hours of post-install setup to get gaming-ready,
              LUNA OS ships with everything you need out of the box — boot, play, create.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function FeaturesGrid() {
  return (
    <Section id="features">
      <SectionHeader kicker="System Architecture" title="Engineered for uncompromising performance." />
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <TiltCard className="h-full">
              <div className="relative h-full p-6 md:p-8 rounded-xl bg-surface-container/60 backdrop-blur-xl precise-border shimmer-card overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary-container/10 rounded-full blur-3xl group-hover:bg-primary-container/25 transition-colors" style={{ transform: "translateZ(10px)" }} />
                <div className="relative flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-lg bg-primary-container/10 border border-primary-container/30 grid place-items-center text-primary-container shrink-0 group-hover:scale-110 transition-transform"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    <Icon name={f.icon} className="text-[24px]" />
                  </div>
                  <div style={{ transform: "translateZ(25px)" }}>
                    <h3 className="font-[var(--font-display)] text-xl md:text-2xl font-semibold text-primary">{f.title}</h3>
                    <p className="mt-3 text-sm md:text-base text-on-surface-variant leading-relaxed">{f.body}</p>
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function MarqueeStrip() {
  const items = ["Arch Linux", "KDE Plasma", "Wayland", "PipeWire", "GameMode", "MangoHud", "Vulkan", "Mesa", "Proton", "Chaotic-AUR", "Steam", "Lutris"];
  return (
    <div className="relative py-10 border-y border-outline-variant/20 overflow-hidden bg-surface-container-lowest/60">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="font-[var(--font-display)] text-4xl md:text-6xl font-bold tracking-tight text-primary/20 hover:text-primary-container transition-colors flex items-center gap-16"
          >
            {t}
            <span className="text-primary-container/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function AdvantagesSection() {
  return (
    <Section id="advantages">
      <SectionHeader kicker="Key Advantages" title="Seven reasons it feels different." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {advantages.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.06}>
            <TiltCard intensity={8} className="h-full">
              <div className="relative h-full p-6 md:p-7 rounded-xl bg-surface-container/50 backdrop-blur-xl precise-border shimmer-card group overflow-hidden">
                <span className="absolute top-4 right-5 font-mono text-xs text-muted/60" style={{ transform: "translateZ(35px)" }}>{a.n}</span>
                <Icon name={a.icon} className="text-primary-container text-[28px] mb-4 inline-block group-hover:-translate-y-1 transition-transform" />
                <h3 className="font-[var(--font-display)] text-lg md:text-xl font-semibold text-primary" style={{ transform: "translateZ(20px)" }}>{a.title}</h3>
                <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">{a.body}</p>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function PersonasSection() {
  return (
    <Section id="personas">
      <SectionHeader kicker="Who is it for?" title="Tailored for the people who push machines hardest." />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <TiltCard className="h-full">
              <div className="relative p-8 rounded-xl bg-gradient-to-br from-surface-container/60 to-surface/40 backdrop-blur-xl precise-border h-full group overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,125,255,0.15),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <Icon name={p.icon} className="text-primary-container text-[32px]" />
                  <h3 className="mt-4 font-[var(--font-display)] text-xl font-semibold text-primary">{p.title}</h3>
                  <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">{p.body}</p>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ComparisonSection() {
  return (
    <Section id="compare">
      <SectionHeader kicker="Why LUNA OS" title="How we compare to other gaming distributions." />
      <div className="grid lg:grid-cols-3 gap-6">
        {comparisons.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <TiltCard intensity={6} className="h-full">
              <div className="relative h-full p-8 rounded-xl bg-surface-container-lowest/70 backdrop-blur-xl precise-border shimmer-card">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name={c.icon} className="text-primary-container text-[26px]" />
                  <h3 className="font-[var(--font-display)] text-xl font-semibold text-primary">{c.title}</h3>
                </div>
                <ul className="space-y-3">
                  {c.points.map((p, j) => (
                    <li key={j} className="flex gap-3 text-sm text-on-surface-variant">
                      <span className="text-primary-container mt-1">✓</span>
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function PayloadSection() {
  return (
    <Section className="bg-surface-container-lowest/40">
      <SectionHeader kicker="Payload" title="Everything you need, pre-installed." />
      <div className="grid md:grid-cols-2 gap-12">
        {Object.entries(payload).map(([cat, items], idx) => (
          <Reveal key={cat} delay={idx * 0.1}>
            <h4 className="font-mono text-[11px] tracking-[0.3em] uppercase text-muted mb-6">
              {cat === "Gaming" ? "Gaming Ecosystem" : "System Tools"}
            </h4>
            <div className="flex flex-wrap gap-3">
              {items.map((it, i) => (
                <motion.span
                  key={it}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                  whileHover={{ y: -3, borderColor: "var(--accent-luna)", color: "var(--accent-luna)" }}
                  className="px-4 py-2 bg-surface-container-high/60 precise-border rounded-md font-mono text-sm text-primary cursor-default backdrop-blur-md"
                >
                  {it}
                </motion.span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function SpecCard({ title, icon, specs, featured }: { title: string; icon: string; specs: typeof minSpecs; featured?: boolean }) {
  return (
    <TiltCard intensity={10} className="h-full">
      <div
        className={`relative h-full p-8 rounded-2xl backdrop-blur-xl overflow-hidden ${
          featured
            ? "bg-gradient-to-br from-primary-container/10 via-surface-container/60 to-surface/40 border-2 border-primary-container/40 halo-glow"
            : "bg-surface-container-low/60 precise-border"
        }`}
      >
        {featured && (
          <span className="absolute top-5 right-5 font-mono text-[10px] tracking-[0.25em] uppercase bg-primary-container text-void px-2 py-1 rounded">
            Recommended
          </span>
        )}
        <div className="flex items-center gap-3 mb-8">
          <Icon name={icon} className={featured ? "text-primary-container text-[28px]" : "text-on-surface-variant text-[28px]"} />
          <h3 className="font-[var(--font-display)] text-2xl font-bold text-primary">{title}</h3>
        </div>
        <ul className="space-y-5">
          {specs.map((s) => (
            <li key={s.label} className="flex items-center gap-4">
              <Icon name={s.icon} className="text-primary-container text-[22px]" />
              <div className="flex-1 flex justify-between items-baseline border-b border-dashed border-outline-variant/40 pb-2">
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{s.label}</span>
                <span className="text-primary font-medium">{s.value}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </TiltCard>
  );
}

function RequirementsSection() {
  return (
    <Section id="requirements">
      <SectionHeader kicker="System Requirements" title="Runs light. Scales limitless." />
      <div className="grid md:grid-cols-2 gap-8">
        <Reveal>
          <SpecCard title="Minimum" icon="settings_suggest" specs={minSpecs} />
        </Reveal>
        <Reveal delay={0.15}>
          <SpecCard title="Recommended" icon="rocket_launch" specs={recSpecs} featured />
        </Reveal>
      </div>
    </Section>
  );
}

function InstallationSection() {
  const steps = [
    { icon: "usb", title: "Flash", body: "Download the ISO and flash it to a USB drive using BalenaEtcher or Ventoy." },
    { icon: "restart_alt", title: "Boot", body: "Restart your PC and boot from the USB via your BIOS/UEFI menu." },
    { icon: "install_desktop", title: "Install", body: "Launch the 'Install LUNA OS' shortcut and follow the guided wizard." },
  ];
  return (
    <Section id="install">
      <SectionHeader kicker="Installation" title="Three steps to a faster machine." />
      <div className="grid md:grid-cols-3 gap-6 relative">
        <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-primary-container/40 to-transparent" />
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.12}>
            <div className="relative p-8 rounded-xl bg-surface-container-low/60 backdrop-blur-xl precise-border h-full">
              <div className="w-14 h-14 rounded-full bg-void border border-primary-container/60 grid place-items-center text-primary-container mb-6 relative z-10">
                <Icon name={s.icon} className="text-[24px]" />
                <span className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-primary-container text-void grid place-items-center font-mono text-[10px] font-bold">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-[var(--font-display)] text-2xl font-semibold text-primary">Step {i + 1}: {s.title}</h3>
              <p className="mt-3 text-on-surface-variant leading-relaxed">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

function ContactSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const channels = [
    { icon: "mail", label: "Support email", value: "support@lunaos.dpdns.org", href: "mailto:support@lunaos.dpdns.org" },
    { icon: "bug_report", label: "Report a bug", value: "Open a ticket", href: "https://sourceforge.net/p/lunaos/tickets/" },
    { icon: "download", label: "Downloads", value: "SourceForge mirror", href: DOWNLOAD_URL },
  ];

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
      website: String(fd.get("website") ?? ""),
    };
    // Basic client-side guard; server validates authoritatively
    if (!payload.name || !payload.email || !payload.message) {
      setStatus("error");
      setErrorMsg("Please fill in every field.");
      return;
    }
    if (payload.message.length > 2000) {
      setStatus("error");
      setErrorMsg("Message is too long (max 2000 characters).");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? "Something went wrong");
      }
      setStatus("sent");
      formRef.current?.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Section id="contact">
      <SectionHeader
        kicker="Get in touch"
        title="Questions, feedback, or want to contribute?"
        sub="Send a message and we'll get back to you — usually within a couple of days."
      />
      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
        {/* Real form — spans 3 cols on desktop */}
        <Reveal className="lg:col-span-3">
          <TiltCard intensity={4} className="h-full">
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              className="relative h-full p-6 sm:p-8 rounded-xl bg-surface-container/60 backdrop-blur-xl precise-border overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />
              <div className="relative grid gap-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="block">
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Name</span>
                    <input
                      name="name"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="name"
                      disabled={status === "sending"}
                      placeholder="Ada Lovelace"
                      className="mt-2 w-full bg-void/60 border border-outline-variant/50 rounded-md px-4 py-3 text-primary placeholder:text-muted/60 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/30 transition-all disabled:opacity-50"
                    />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Email</span>
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={255}
                      autoComplete="email"
                      disabled={status === "sending"}
                      placeholder="you@domain.com"
                      className="mt-2 w-full bg-void/60 border border-outline-variant/50 rounded-md px-4 py-3 text-primary placeholder:text-muted/60 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/30 transition-all disabled:opacity-50"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted">Message</span>
                  <textarea
                    name="message"
                    required
                    maxLength={2000}
                    rows={6}
                    disabled={status === "sending"}
                    placeholder="Tell us what's on your mind…"
                    className="mt-2 w-full bg-void/60 border border-outline-variant/50 rounded-md px-4 py-3 text-primary placeholder:text-muted/60 outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/30 transition-all resize-y disabled:opacity-50"
                  />
                </label>
                {/* Honeypot — hidden from users, catches naive bots */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute -left-[9999px] w-px h-px opacity-0"
                />

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={status === "sending" || status === "sent"}
                    data-text={status === "sending" ? "Sending…" : status === "sent" ? "Sent ✓" : "Send message"}
                    className="btn-glitch relative inline-flex items-center justify-center gap-2 bg-primary-container text-void px-7 py-3.5 rounded-md font-semibold text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <Icon name={status === "sent" ? "check_circle" : "send"} className="text-[18px]" />
                    <span className="relative">
                      {status === "sending" ? "Sending…" : status === "sent" ? "Message sent" : "Send message"}
                    </span>
                  </button>
                  <p
                    className={`text-sm transition-colors ${
                      status === "error" ? "text-red-400" : status === "sent" ? "text-primary-container" : "text-muted"
                    }`}
                    role="status"
                    aria-live="polite"
                  >
                    {status === "error" && errorMsg}
                    {status === "sent" && "Thanks — we'll get back to you soon."}
                    {status === "idle" && "We never share your email."}
                    {status === "sending" && "Delivering your message…"}
                  </p>
                </div>
              </div>
            </form>
          </TiltCard>
        </Reveal>

        {/* Channel links — spans 2 cols */}
        <div className="lg:col-span-2 grid gap-4">
          {channels.map((c, i) => (
            <Reveal key={c.label} delay={0.1 + i * 0.08}>
              <TiltCard intensity={6}>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group relative flex items-center gap-4 p-5 rounded-xl bg-surface/60 backdrop-blur-xl precise-border hover:border-primary-container transition-all overflow-hidden"
                >
                  <Icon
                    name={c.icon}
                    className="text-primary-container text-[28px] shrink-0 group-hover:drop-shadow-[0_0_16px_rgba(180,125,255,0.8)] transition-all group-hover:scale-110"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{c.label}</span>
                    <p className="font-[var(--font-display)] text-base font-semibold text-primary group-hover:text-primary-container transition-colors truncate">
                      {c.value}
                    </p>
                  </div>
                  <Icon
                    name="arrow_outward"
                    className="text-on-surface-variant text-[18px] group-hover:text-primary-container group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all"
                  />
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}


function CTASection() {
  return (
    <Section>
      <Reveal>
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden precise-border p-8 sm:p-14 md:p-20 lg:p-24 text-center halo-glow bg-surface-container-lowest/70 backdrop-blur-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,125,255,0.15),transparent_65%)]" />
          <div className="absolute inset-0 grid-bg opacity-30" />
          <motion.img
            src={lunaLogo.url}
            alt=""
            aria-hidden
            width={256}
            height={256}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}

            className="absolute -right-16 -bottom-16 w-64 opacity-10 blur-[1px]"
          />
          <div className="relative z-10 max-w-3xl mx-auto">
            <AnimatedText
              text="Ready to ascend?"
              as="h2"
              wordMode
              stagger={0.08}
              className="block font-[var(--font-display)] text-5xl md:text-7xl lg:text-[88px] font-bold tracking-[-0.03em] text-primary shimmer-text"
            />
            <Reveal delay={0.3}>
              <p className="mt-6 text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto">
                Experience the fastest gaming distro on the planet. Built for performance, designed for the stars.
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={DOWNLOAD_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-text="Download LUNA OS"
                  className="btn-glitch relative inline-flex items-center justify-center gap-2 bg-primary-container text-void px-8 py-4 rounded-md font-semibold"
                >
                  <Icon name="download" className="text-[18px]" />
                  <span className="relative">Download LUNA OS</span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 border border-outline-variant/60 text-primary px-8 py-4 rounded-md font-semibold hover:border-primary-container transition-colors"
                >
                  <Icon name="mail" className="text-[18px]" />
                  Contact us
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-outline-variant/20 bg-surface-container-lowest/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={lunaLogo.url} alt="LUNA OS" width={28} height={28} loading="lazy" decoding="async" className="w-7 h-7 object-contain" />
          <span className="font-[var(--font-display)] font-bold text-primary">
            LUNA<span className="text-primary-container"> OS</span>
          </span>
        </div>
        <p className="font-mono text-xs text-muted tracking-widest uppercase">
          © {new Date().getFullYear()} · Built for the stars
        </p>
      </div>
    </footer>
  );
}

