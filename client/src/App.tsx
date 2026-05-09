import { useEffect, useRef, useState } from "react";
import { fetchButtons, createWebSocket } from "./api";
import { useStore } from "./store";
import StatusBar from "./components/StatusBar";
import Deck from "./components/Deck";
import ButtonEditor from "./components/ButtonEditor";
import Settings from "./components/Settings";
import type { Button } from "./types";

export default function App() {
  const { setButtons, setConnected } = useStore();
  const [editingButton, setEditingButton] = useState<Button | undefined>();
  const [editorOpen, setEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addPage, setAddPage] = useState(0);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = () => {
    fetchButtons().then(setButtons).catch(console.error);

    wsRef.current = createWebSocket(
      () => setConnected(true),
      () => {
        setConnected(false);
        setTimeout(connect, 3000);
      }
    );
  };

  useEffect(() => {
    connect();
    return () => wsRef.current?.close();
  }, []);

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100dvh", backgroundColor:"#0f0f0f" }}>
      <StatusBar onSettingsClick={() => setSettingsOpen(true)} />
      <Deck
        onAddClick={(page) => { setAddPage(page); setEditingButton(undefined); setEditorOpen(true); }}
        onEditClick={(b) => { setEditingButton(b); setEditorOpen(true); }}
      />
      {editorOpen && (
        <ButtonEditor
          button={editingButton}
          initialPage={addPage}
          onClose={() => setEditorOpen(false)}
        />
      )}
      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}
