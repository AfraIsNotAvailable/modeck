import { useRef, useState } from "react";
import { useStore } from "../store";
import { executeButton } from "../api";
import type { Button } from "../types";

type Props = {
  button: Button;
  onEditClick: () => void;
};

export default function DeckButton({ button, onEditClick }: Props) {
  const editMode = useStore((s) => s.editMode);
  const setEditMode = useStore((s) => s.setEditMode);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const [feedback, setFeedback] = useState<"idle" | "success" | "error">("idle");
  const shiverStyle = useRef({
    animationDuration: `${(0.25 + Math.random() * 0.2).toFixed(2)}s`,
    animationDelay: `${-(Math.random() * 0.35).toFixed(2)}s`,
  });

  const fire = async (longPress = false) => {
    try {
      await executeButton(button.id, longPress);
      setFeedback("success");
    } catch {
      setFeedback("error");
    }
    setTimeout(() => setFeedback("idle"), 800);
  };

  const handlePressStart = () => {
    if (editMode || !button.longPressAction) return;
    didLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      navigator.vibrate?.([30, 50, 30]);
      fire(true);
    }, 600);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const handleClick = () => {
    if (editMode) {
      setEditMode(false);
      onEditClick();
      return;
    }
    if (didLongPress.current) return;
    navigator.vibrate?.(50);
    fire();
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
      className={editMode ? "shiver" : undefined}
      style={{
        ...(editMode ? shiverStyle.current : {}),
        backgroundColor: button.color,
        borderRadius: "12px",
        border: "none",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        cursor: "pointer",
        fontSize: "32px",
        color: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {feedback !== "idle" && (
        <div
          key={feedback}
          className="feedback-overlay"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "12px",
            backgroundColor: feedback === "success" ? "rgba(34,197,94,0.75)" : "rgba(120,0,0,0.88)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
          }}
        >
          {feedback === "success" ? "✓" : "✗"}
        </div>
      )}
      {button.icon ? (
        <>
          {button.icon.startsWith("http") ? (
            <img src={button.icon} style={{ width: "55%", height: "55%", objectFit: "contain" }} />
          ) : (
            <span>{button.icon}</span>
          )}
          <span style={{ fontSize: "12px", fontWeight: 600, lineHeight: 1 }}>
            {button.label}
          </span>
        </>
      ) : (
        <span style={{ fontSize: "16px", fontWeight: 700, lineHeight: 1.2, textAlign: "center", padding: "0 8px" }}>
          {button.label}
        </span>
      )}
    </button>
  );
}
