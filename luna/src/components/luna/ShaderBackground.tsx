import { useEffect, useRef } from "react";

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl") || (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const vs = `attribute vec2 a;varying vec2 v;void main(){v=a*0.5+0.5;gl_Position=vec4(a,0.0,1.0);}`;
    const fs = `precision highp float;uniform float u_time;uniform vec2 u_res;uniform vec2 u_mouse;varying vec2 v;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    void main(){
      vec2 uv=v;
      vec3 col=vec3(0.04,0.045,0.06);
      // Aurora waves
      float w1=sin(uv.x*3.0+u_time*0.6)*0.5+0.5;
      float w2=sin(uv.y*2.4-u_time*0.8+w1*2.0)*0.5+0.5;
      float flow=w1*w2;
      vec3 accent=vec3(0.474,0.976,0.792);
      vec3 accent2=vec3(0.35,0.85,1.0);
      col+=accent*flow*0.10;
      col+=accent2*pow(1.0-uv.y,3.0)*0.05;
      // Sharp grid pulse
      float g=sin(uv.x*80.0+u_time*1.2)*cos(uv.y*80.0+u_time*1.4);
      g=smoothstep(0.95,1.0,g);
      col+=accent*g*0.18;
      // Streak
      float streak=step(0.994,fract(uv.y*24.0-u_time*2.2));
      col+=accent*streak*0.18*flow;
      // Mouse halo
      float d=distance(uv,u_mouse);
      col+=accent*smoothstep(0.28,0.0,d)*0.18;
      // Vignette
      float vg=smoothstep(1.1,0.35,length(uv-0.5));
      col*=0.6+0.6*vg;
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
    const uR = gl.getUniformLocation(prog, "u_res");
    const uM = gl.getUniformLocation(prog, "u_mouse");

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const start = performance.now();
    const render = () => {
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uT, t);
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform2f(uM, mouse.current.x, mouse.current.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block opacity-80" />
      <div className="absolute inset-0 grid-bg opacity-40" />
    </div>
  );
}
