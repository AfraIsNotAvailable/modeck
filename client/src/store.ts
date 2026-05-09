import { create } from "zustand";
import type { Button } from "./types";

const SETTINGS_KEY = "modeck-settings";

function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
    return {
      phoneGridCols: s.phoneGridCols ?? 3,
      phoneGridRows: s.phoneGridRows ?? 5,
      desktopColMinPx: s.desktopColMinPx ?? 100,
    };
  } catch {
    return { phoneGridCols: 3, phoneGridRows: 5, desktopColMinPx: 100 };
  }
}

function persistSettings(s: { phoneGridCols: number; phoneGridRows: number; desktopColMinPx: number }) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

type Store = {
  buttons: Button[];
  connected: boolean;
  editMode: boolean;
  phoneGridCols: number;
  phoneGridRows: number;
  desktopColMinPx: number;
  setButtons: (buttons: Button[]) => void;
  setConnected: (connected: boolean) => void;
  setEditMode: (editMode: boolean) => void;
  setGridSettings: (cols: number, rows: number, desktopColMinPx: number) => void;
  addButton: (button: Button) => void;
  updateButton: (button: Button) => void;
  removeButton: (id: string) => void;
};

const saved = loadSettings();

export const useStore = create<Store>((set) => ({
  buttons: [],
  connected: false,
  editMode: false,
  phoneGridCols: saved.phoneGridCols,
  phoneGridRows: saved.phoneGridRows,
  desktopColMinPx: saved.desktopColMinPx,
  setButtons: (buttons) => set({ buttons }),
  setConnected: (connected) => set({ connected }),
  setEditMode: (editMode) => set({ editMode }),
  setGridSettings: (phoneGridCols, phoneGridRows, desktopColMinPx) => {
    persistSettings({ phoneGridCols, phoneGridRows, desktopColMinPx });
    set({ phoneGridCols, phoneGridRows, desktopColMinPx });
  },
  addButton: (button) => set((s) => ({ buttons: [...s.buttons, button] })),
  updateButton: (button) =>
    set((s) => ({ buttons: s.buttons.map((b) => (b.id === button.id ? button : b)) })),
  removeButton: (id) =>
    set((s) => ({ buttons: s.buttons.filter((b) => b.id !== id) })),
}));
