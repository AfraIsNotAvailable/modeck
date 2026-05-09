import { useState } from "react";
import { useStore } from "../store";

type Props = {
  onClose: () => void;
};

export default function Settings({ onClose }: Props) {
  const { phoneGridCols, phoneGridRows, desktopColMinPx, setGridSettings } = useStore();
  const [serverUrl, setServerUrl] = useState(localStorage.getItem("serverUrl") ?? "");
  const [cols, setCols] = useState(String(phoneGridCols));
  const [rows, setRows] = useState(String(phoneGridRows));
  const [deskPx, setDeskPx] = useState(String(desktopColMinPx));

  const handleSave = () => {
    const urlChanged = serverUrl !== (localStorage.getItem("serverUrl") ?? "");
    if (serverUrl) localStorage.setItem("serverUrl", serverUrl);
    else localStorage.removeItem("serverUrl");
    setGridSettings(
      Math.max(1, Math.min(8, parseInt(cols) || 3)),
      Math.max(1, Math.min(12, parseInt(rows) || 5)),
      Math.max(60, Math.min(300, parseInt(deskPx) || 100)),
    );
    onClose();
    if (urlChanged) window.location.reload();
  };

  return (
    <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
      <div style={{ backgroundColor:"#1a1a1a", borderRadius:"16px", padding:"24px", width:"90%", maxWidth:"400px", display:"flex", flexDirection:"column", gap:"16px" }}>
        <span style={{ color:"#fff", fontSize:"18px", fontWeight:600 }}>Settings</span>

        <label style={{ color:"#888", fontSize:"12px" }}>Server URL</label>
        <input
          value={serverUrl}
          onChange={(e) => setServerUrl(e.target.value)}
          placeholder="http://192.168.x.x:8765"
          style={inputStyle}
        />

        <label style={{ color:"#888", fontSize:"12px" }}>Phone grid — columns × rows</label>
        <div style={{ display:"flex", gap:"8px" }}>
          <input type="number" value={cols} min={1} max={8} onChange={(e) => setCols(e.target.value)} style={{ ...inputStyle, flex:1 }} />
          <span style={{ color:"#888", alignSelf:"center" }}>×</span>
          <input type="number" value={rows} min={1} max={12} onChange={(e) => setRows(e.target.value)} style={{ ...inputStyle, flex:1 }} />
        </div>

        <label style={{ color:"#888", fontSize:"12px" }}>Desktop button size (px)</label>
        <input type="number" value={deskPx} min={60} max={300} onChange={(e) => setDeskPx(e.target.value)} style={inputStyle} />

        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={handleSave} style={btnStyle("#3498db")}>Save</button>
          <button onClick={onClose} style={btnStyle("#444")}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { backgroundColor:"#2a2a2a", border:"1px solid #444", borderRadius:"8px", padding:"10px", color:"#fff", fontSize:"14px" };
const btnStyle = (bg: string): React.CSSProperties => ({ backgroundColor:bg, border:"none", borderRadius:"8px", padding:"10px 16px", color:"#fff", cursor:"pointer", flex:1 });
