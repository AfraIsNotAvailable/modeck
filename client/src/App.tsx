import { useEffect, useRef, useState } from "react";
import { fetchButtons, createWebSocket } from "./api";
import { useStore } from "./store";
import StatusBar from "./components/StatusBar";
import Deck from "./components/Deck";
import ButtonEditor from "./components/ButtonEditor";
import Settings from "./components/Settings";
import CertSetupPopup from "./components/CertSetupPopup";
import CertSetupPage from "./components/CertSetupPage";
import type { Button } from "./types";

const needsCertSetup =
  window.location.protocol !== "https:" &&
  !["localhost", "127.0.0.1"].includes(window.location.hostname);

export default function App() {
  const { setButtons, setConnected } = useStore();
  const [editingButton, setEditingButton] = useState<Button | undefined>();
  const [editorOpen, setEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addPage, setAddPage] = useState(0);
  const [showCertPopup, setShowCertPopup] = useState(
    needsCertSetup && !localStorage.getItem("certSetupSeen")
  );
  const [certSetupOpen, setCertSetupOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = () => {
    fetchButtons().then(setButtons).catch(console.error);
    wsRef.current = createWebSocket(
      () => setConnected(true),
      () => { setConnected(false); setTimeout(connect, 3000); }
    );
  };

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismissCertPopup = () => {
    localStorage.setItem("certSetupSeen", "1");
    setShowCertPopup(false);
  };

  const openCertSetup = () => {
    localStorage.setItem("certSetupSeen", "1");
    setShowCertPopup(false);
    setCertSetupOpen(true);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", backgroundColor:"#0f0f0f" }}>
      <StatusBar
        onSettingsClick={() => setSettingsOpen(true)}
        onCertSetupClick={() => setCertSetupOpen(true)}
      />
      <Deck
        onAddClick={(page) => { setAddPage(page); setEditingButton(undefined); setEditorOpen(true); }}
        onEditClick={(b) => { setEditingButton(b); setEditorOpen(true); }}
      />
      {editorOpen && (
        <ButtonEditor button={editingButton} initialPage={addPage} onClose={() => setEditorOpen(false)} />
      )}
      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
      {showCertPopup && <CertSetupPopup onSetup={openCertSetup} onDismiss={dismissCertPopup} />}
      {certSetupOpen && <CertSetupPage onClose={() => setCertSetupOpen(false)} installPrompt={installPrompt} />}
    </div>
  );
}
