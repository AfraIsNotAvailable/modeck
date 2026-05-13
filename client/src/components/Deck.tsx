import { useRef, useState, useEffect } from "react";
import { useStore } from "../store";
import DeckButton from "./DeckButton";
import type { Button } from "../types";


function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isDesktop;
}

type Props = {
  onAddClick: (page: number) => void;
  onEditClick: (button: Button) => void;
};

export default function Deck({ onAddClick, onEditClick }: Props) {
  const buttons = useStore((s) => s.buttons);
  const phoneGridCols = useStore((s) => s.phoneGridCols);
  const phoneGridRows = useStore((s) => s.phoneGridRows);
  const desktopColMinPx = useStore((s) => s.desktopColMinPx);
  const [currentPage, setCurrentPage] = useState(0);
  const touchStartX = useRef(0);
  const isDesktop = useIsDesktop();

  const PER_PAGE = phoneGridCols * phoneGridRows;

  if (isDesktop) {
    const sorted = [...buttons].sort((a, b) => a.position - b.position);
    return (
      <div style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center" }}>
        <div style={{
          width: "100%",
          maxWidth: "960px",
          display: "grid",
          gridTemplateColumns: `repeat(auto-fill, minmax(${desktopColMinPx}px, 1fr))`,
          gridAutoRows: `${desktopColMinPx}px`,
          gap: "12px",
          padding: "16px",
          alignContent: "start",
        }}>
          {sorted.map((button) => (
            <DeckButton key={button.id} button={button} onEditClick={() => onEditClick(button)} />
          ))}
          <button
            onClick={() => onAddClick(0)}
            style={{
              backgroundColor: "#2a2a2a",
              borderRadius: "12px",
              border: "2px dashed #444",
              cursor: "pointer",
              fontSize: "32px",
              color: "#666",
              width: "100%",
              height: "100%",
            }}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  const totalPages = buttons.length === 0 ? 1 : Math.max(...buttons.map((b) => b.page ?? 0)) + 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50 && currentPage < totalPages - 1) setCurrentPage((p) => p + 1);
    if (diff < -50 && currentPage > 0) setCurrentPage((p) => p - 1);
  };

  return (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          transform: `translateX(calc(-${currentPage * 100}%))`,
          transition: "transform 0.3s ease",
          touchAction: "pan-x",
        }}
      >
        {Array.from({ length: totalPages }).map((_, pageIndex) => {
          const pageButtons = buttons
            .filter((b) => (b.page ?? 0) === pageIndex)
            .sort((a, b) => a.position - b.position);
          const hasRoom = pageButtons.length < PER_PAGE;

          return (
            <div
              key={pageIndex}
              style={{
                minWidth: "100%",
                height: "100%",
                display: "grid",
                gridTemplateColumns: `repeat(${phoneGridCols}, 1fr)`,
                gridTemplateRows: `repeat(${phoneGridRows}, 1fr)`,
                gap: "12px",
                padding: "16px",
                paddingBottom: totalPages > 1 ? "16px" : "calc(16px + env(safe-area-inset-bottom, 0px))",
              }}
            >
              {pageButtons.map((button) => (
                <DeckButton key={button.id} button={button} onEditClick={() => onEditClick(button)} />
              ))}
              {hasRoom && (
                <button
                  onClick={() => onAddClick(pageIndex)}
                  style={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "12px",
                    border: "2px dashed #444",
                    cursor: "pointer",
                    fontSize: "32px",
                    color: "#666",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  +
                </button>
              )}
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", padding: "12px", paddingBottom: "calc(12px + env(safe-area-inset-bottom, 0px))" }}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentPage(i)}
              style={{
                width: "8px", height: "8px", borderRadius: "50%", cursor: "pointer",
                backgroundColor: i === currentPage ? "#fff" : "#444",
                transition: "background-color 0.2s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
