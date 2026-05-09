import { useState } from "react";
import { useStore } from "../store";
import { getServerUrl } from "../api";

type Props = { onSettingsClick: () => void };

export default function StatusBar({ onSettingsClick }: Props) {
  const connected = useStore((s) => s.connected);
  const editMode = useStore((s) => s.editMode);
  const setEditMode = useStore((s) => s.setEditMode);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "8px 16px",
      backgroundColor: "#1a1a1a",
      fontSize: "12px",
      color: "#888",
      position: "relative",
    }}>
      <div style={{
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        backgroundColor: connected ? "#22c55e" : "#ef4444",
      }} />
      <span style={{ flex: 1 }}>{connected ? getServerUrl() : "Disconnected"}</span>

      <button
        onClick={() => setMenuOpen((o) => !o)}
        style={{ background: "none", border: "none", color: "#888", fontSize: "18px", cursor: "pointer", padding: "0 4px", lineHeight: 1 }}
      >
        ···
      </button>

      {menuOpen && (
        <div style={{
          position: "absolute", top: "100%", right: "8px", backgroundColor: "#2a2a2a",
          borderRadius: "8px", border: "1px solid #444", zIndex: 200, minWidth: "140px",
        }}>
          <button
            onClick={() => { setEditMode(!editMode); setMenuOpen(false); }}
            style={{ display: "block", width: "100%", background: "none", border: "none", color: editMode ? "#3498db" : "#fff", padding: "10px 16px", textAlign: "left", cursor: "pointer", fontSize: "13px" }}
          >
            {editMode ? "✓ Edit Buttons" : "Edit Buttons"}
          </button>
          <button
            onClick={() => { onSettingsClick(); setMenuOpen(false); }}
            style={{ display: "block", width: "100%", background: "none", border: "none", color: "#fff", padding: "10px 16px", textAlign: "left", cursor: "pointer", fontSize: "13px", borderTop: "1px solid #333" }}
          >
            Settings
          </button>
        </div>
      )}
    </div>
  );
}
