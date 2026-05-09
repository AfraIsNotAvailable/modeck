import { useState, useRef } from "react";

function hsvToHex(h: number, s: number, v: number): string {
  s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else              { r = c; b = x; }
  return "#" + [r + m, g + m, b + m]
    .map((v) => Math.round(v * 255).toString(16).padStart(2, "0"))
    .join("");
}

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d % 6) * 60;
    else if (max === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
    if (h < 0) h += 360;
  }
  return [Math.round(h), Math.round(max ? (d / max) * 100 : 0), Math.round(max * 100)];
}

function useDrag(
  ref: React.RefObject<HTMLDivElement | null>,
  onMove: (x: number, y: number, rect: DOMRect) => void
) {
  const start = (cx: number, cy: number) => {
    const rect = ref.current!.getBoundingClientRect();
    onMove(cx, cy, rect);
    const move = (e: MouseEvent) => onMove(e.clientX, e.clientY, rect);
    const up = () => { document.removeEventListener("mousemove", move); document.removeEventListener("mouseup", up); };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  };
  const startTouch = (cx: number, cy: number) => {
    const rect = ref.current!.getBoundingClientRect();
    onMove(cx, cy, rect);
    const move = (e: TouchEvent) => { e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY, rect); };
    const end = () => { document.removeEventListener("touchmove", move); document.removeEventListener("touchend", end); };
    document.addEventListener("touchmove", move, { passive: false });
    document.addEventListener("touchend", end);
  };
  return {
    onMouseDown: (e: React.MouseEvent) => { e.preventDefault(); start(e.clientX, e.clientY); },
    onTouchStart: (e: React.TouchEvent) => startTouch(e.touches[0].clientX, e.touches[0].clientY),
  };
}

type Props = { color: string; onChange: (color: string) => void; onClose: () => void; };

export default function ColorPicker({ color, onChange, onClose }: Props) {
  const [hue, sat, val] = hexToHsv(color);
  const [h, setH] = useState(hue);
  const [s, setS] = useState(sat);
  const [v, setV] = useState(val);

  const emit = (nh: number, ns: number, nv: number) => onChange(hsvToHex(nh, ns, nv));

  const svRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  const svDrag = useDrag(svRef, (cx, cy, rect) => {
    const ns = Math.round(Math.min(1, Math.max(0, (cx - rect.left) / rect.width)) * 100);
    const nv = Math.round(Math.min(1, Math.max(0, 1 - (cy - rect.top) / rect.height)) * 100);
    setS(ns); setV(nv); emit(h, ns, nv);
  });

  const hueDrag = useDrag(hueRef, (cx, _, rect) => {
    const nh = Math.round(Math.min(360, Math.max(0, (cx - rect.left) / rect.width * 360)));
    setH(nh); emit(nh, s, v);
  });

  const hueColor = hsvToHex(h, 100, 100);

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.6)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:300 }}
    >
      <div style={{ backgroundColor:"#1a1a1a", borderRadius:"16px", padding:"16px", display:"flex", flexDirection:"column", gap:"14px" }}>

        {/* SV square */}
        <div
          ref={svRef}
          {...svDrag}
          style={{
            width:260, height:220, borderRadius:"8px", position:"relative",
            cursor:"crosshair", touchAction:"none",
            background:`linear-gradient(to right, #fff, ${hueColor})`,
          }}
        >
          <div style={{ position:"absolute", inset:0, borderRadius:"8px", background:"linear-gradient(to bottom, transparent, #000)" }} />
          <div style={{
            position:"absolute", pointerEvents:"none",
            left:`${s}%`, top:`${100 - v}%`,
            width:14, height:14, borderRadius:"50%",
            border:"2px solid #fff", transform:"translate(-50%,-50%)",
            boxShadow:"0 0 3px rgba(0,0,0,0.9)",
          }} />
        </div>

        {/* Hue slider */}
        <div
          ref={hueRef}
          {...hueDrag}
          style={{
            width:260, height:18, borderRadius:9, position:"relative",
            cursor:"pointer", touchAction:"none",
            background:"linear-gradient(to right,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)",
          }}
        >
          <div style={{
            position:"absolute", pointerEvents:"none",
            left:`${h / 360 * 100}%`, top:"50%",
            width:20, height:20, borderRadius:"50%",
            border:"2px solid #fff", transform:"translate(-50%,-50%)",
            backgroundColor:hueColor, boxShadow:"0 0 3px rgba(0,0,0,0.9)",
          }} />
        </div>

        <button
          onClick={onClose}
          style={{ backgroundColor:"#3498db", border:"none", borderRadius:"8px", padding:"10px", color:"#fff", cursor:"pointer", fontSize:"14px" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
