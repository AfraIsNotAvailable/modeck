import { useState } from "react";
import { createButton, updateButton, deleteButton, getColorFromUrl } from "../api";
import { useStore } from "../store";
import ColorPicker from "./ColorPicker";
import type { Button } from "../types";

type Props = {
  button?: Button;
  initialPage?: number;
  onClose: () => void;
};

const COLORS = ["#e74c3c","#e67e22","#f1c40f","#2ecc71","#3498db","#9b59b6","#1abc9c","#34495e"];

export default function ButtonEditor({ button, initialPage = 0, onClose }: Props) {
  const { addButton, updateButton: updateStore, removeButton } = useStore();
  const [label, setLabel] = useState(button?.label ?? "");
  const [icon, setIcon] = useState(button?.icon ?? "");
  const [color, setColor] = useState(button?.color ?? COLORS[0]);
  const [actionType, setActionType] = useState(button?.action.type ?? "shell");
  const [command, setCommand] = useState(button?.action.command ?? "");
  const [lpEnabled, setLpEnabled] = useState(!!button?.longPressAction);
  const [lpType, setLpType] = useState(button?.longPressAction?.type ?? "shell");
  const [lpCommand, setLpCommand] = useState(button?.longPressAction?.command ?? "");
  const [page] = useState(button?.page ?? initialPage ?? 0);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSave = async () => {
    const data = {
      label, icon, color, page,
      action: { type: actionType as Button["action"]["type"], command },
      longPressAction: lpEnabled ? { type: lpType as Button["action"]["type"], command: lpCommand } : undefined,
      position: button?.position ?? 0,
    };
    if (button) {
      const updated = await updateButton(button.id, data);
      updateStore(updated);
    } else {
      const created = await createButton(data);
      addButton(created);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!button) return;
    await deleteButton(button.id);
    removeButton(button.id);
    onClose();
  };

  return (
    <>
    <div style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.8)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:100 }}>
      <div style={{ backgroundColor:"#1a1a1a", borderRadius:"16px", padding:"24px", width:"90%", maxWidth:"400px", display:"flex", flexDirection:"column", gap:"16px" }}>

        {/* Preview */}
        <div style={{ display:"flex", justifyContent:"center" }}>
          <div style={{
            width:100, height:100, backgroundColor:color, borderRadius:"12px",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            gap:"8px", fontSize:"32px", color:"#fff", overflow:"hidden",
          }}>
            {icon ? (
              <>
                {icon.startsWith("http") ? (
                  <img src={icon} style={{ width:"55%", height:"55%", objectFit:"contain" }} />
                ) : (
                  <span>{icon}</span>
                )}
                <span style={{ fontSize:"12px", fontWeight:600, lineHeight:1 }}>{label}</span>
              </>
            ) : (
              <span style={{ fontSize:"16px", fontWeight:700, lineHeight:1.2, textAlign:"center", padding:"0 8px" }}>{label}</span>
            )}
          </div>
        </div>

        <input
          placeholder="Button name"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{ ...inputStyle, fontSize:"18px", fontWeight:600, color:"#fff", backgroundColor:"transparent", border:"none", borderBottom:"1px solid #444", borderRadius:0, padding:"4px 0" }}
        />
        <input
          placeholder="Icon (emoji or image URL)"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          onBlur={async (e) => {
            const val = e.target.value;
            if (val.startsWith("http")) {
              const extracted = await getColorFromUrl(val);
              if (extracted) setColor(extracted);
            }
          }}
          style={inputStyle}
        />

        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          {COLORS.map((c) => (
            <div key={c} onClick={() => setColor(c)} style={{ width:28, height:28, borderRadius:"50%", backgroundColor:c, cursor:"pointer", outline: color===c ? "3px solid #fff" : "none", flexShrink:0 }} />
          ))}
          <div
            onClick={() => setShowColorPicker(true)}
            style={{
              width:28, height:28, borderRadius:"50%", flexShrink:0, cursor:"pointer",
              background:"conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
              outline: !COLORS.includes(color) ? "3px solid #fff" : "none",
            }}
          />
        </div>

        <select value={actionType} onChange={(e) => setActionType(e.target.value as Button["action"]["type"])} style={inputStyle}>
          <option value="shell">Shell</option>
          <option value="app">App</option>
          <option value="hotkey">Hotkey</option>
        </select>
        <input placeholder="Command" value={command} onChange={(e) => setCommand(e.target.value)} style={inputStyle} />
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <input type="checkbox" id="lp-enable" checked={lpEnabled} onChange={(e) => setLpEnabled(e.target.checked)} />
          <label htmlFor="lp-enable" style={{ color:"#888", fontSize:"13px", cursor:"pointer" }}>Long press action</label>
        </div>
        {lpEnabled && (
          <>
            <select value={lpType} onChange={(e) => setLpType(e.target.value as Button["action"]["type"])} style={inputStyle}>
              <option value="shell">Shell</option>
              <option value="app">App</option>
              <option value="hotkey">Hotkey</option>
            </select>
            <input placeholder="Long press command" value={lpCommand} onChange={(e) => setLpCommand(e.target.value)} style={inputStyle} />
          </>
        )}
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={handleSave} style={btnStyle("#3498db")}>Save</button>
          {button && <button onClick={handleDelete} style={btnStyle("#e74c3c")}>Delete</button>}
          <button onClick={onClose} style={btnStyle("#444")}>Cancel</button>
        </div>
      </div>
    </div>
    {showColorPicker && (
      <ColorPicker color={color} onChange={setColor} onClose={() => setShowColorPicker(false)} />
    )}
    </>
  );
}

const inputStyle: React.CSSProperties = { backgroundColor:"#2a2a2a", border:"1px solid #444", borderRadius:"8px", padding:"10px", color:"#fff", fontSize:"14px" };
const btnStyle = (bg: string): React.CSSProperties => ({ backgroundColor:bg, border:"none", borderRadius:"8px", padding:"10px 16px", color:"#fff", cursor:"pointer", flex:1 });
