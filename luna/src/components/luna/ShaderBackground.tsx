import { useEffect, useRef } from "react";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // Respect user preference — skip GPU work entirely.

    const gl = canvas.getContext("webgl", { antialias: false, powerPreference: "low-power", alpha: false }) as WebGLRenderingContext | null;
    if (!gl) return;

    // Cap dpr aggressively — full-screen fragment shader cost scales with pixels.
    const dpr = Math.min(window.devicePixelRatio || 1, 1);
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const vs = `attribute vec2 a;varying vec2 v;void main(){v=a*0.5+0.5;gl_Position=vec4(a,0.0,1.0);}`;
    const fs = `precision mediump float;uniform float u_time;uniform vec2 u_mouse;varying vec2 v;
    // cheap 2d hash noise
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),u.x),mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),u.x),u.y);}
    void main(){
      vec2 uv=v;
      vec2 p=uv-0.5;
      float t=u_time*0.06;
      // slow, soft flowing nebula
      float n = noise(p*2.2 + vec2(t, -t*0.6));
      float n2 = noise(p*4.0 - vec2(t*0.9, t*0.7));
      float neb = n*0.65 + n2*0.35;
      vec3 col=vec3(0.035,0.03,0.055);
      vec3 violet=vec3(0.706,0.490,1.0);
      vec3 indigo=vec3(0.30,0.18,0.75);
      vec3 cyan=vec3(0.28,0.55,0.88);
      col += mix(indigo, violet, neb) * neb * 0.28;
      col += cyan * pow(1.0-uv.y,3.5) * 0.04;
      // gentle cursor aurora
      float d=distance(uv,u_mouse);
      col+=violet*smoothstep(0.40,0.0,d)*0.18;
      // vignette
      float vg=smoothstep(1.15,0.30,length(uv-0.5));
      col*=0.60+0.70*vg;
      gl_FragColor=vec4(col,1.0);
    }`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uT = gl.getUniformLocation(prog, "u_time");
    const uM = gl.getUniformLocation(prog, "u_mouse");

    // Throttle mouse to rAF via passive listener
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Pause when tab hidden or canvas off-screen
    let visible = true;
    const onVis = () => { visible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVis);

    let onScreen = true;
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    // Throttle to ~30 fps
    const frameInterval = 1000 / 30;
    let lastFrame = 0;
    let raf = 0;
    const start = performance.now();
    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible || !onScreen) return;
      if (now - lastFrame < frameInterval) return;
      lastFrame = now;
      const t = (now - start) / 1000;
      gl.uniform1f(uT, t);
      gl.uniform2f(uM, mouse.current.x, mouse.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, []);


  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block opacity-80" />
      <div className="absolute inset-0 grid-bg opacity-40" />
    </div>
  );
}
