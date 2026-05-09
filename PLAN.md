# MoDeck — Mobile Deck for PC Control

PWA "stream deck" running in phone/tablet browser, sends commands to a Python service on the PC via local network. No cloud, no auth, home-network trust model.

---

## Stack

| Layer    | Tech                                         |
| -------- | -------------------------------------------- |
| Frontend | React + Vite, `vite-plugin-pwa`              |
| Backend  | Python + FastAPI + uvicorn                   |
| Storage  | JSON flat file on server (buttons + layouts) |
| Realtime | WebSocket (connection status ping)           |
| System   | systemd user service                         |

---

## Project Structure

```dir
modeck/
├── server/
│   ├── main.py              # FastAPI app entry
│   ├── routes/
│   │   ├── buttons.py       # CRUD for buttons
│   │   ├── execute.py       # run commands
│   │   └── ws.py            # WebSocket heartbeat
│   ├── executor.py          # shell / hotkey / app dispatch
│   ├── store.py             # JSON read/write for buttons
│   ├── data/
│   │   └── buttons.json     # persisted button config
│   ├── requirements.txt
│   └── modeck.service       # systemd unit template
└── client/
    ├── index.html
    ├── vite.config.ts
    ├── public/
    │   ├── manifest.json
    │   └── icons/           # PWA icons (192, 512)
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api.ts            # fetch + WS wrapper
        ├── store.ts          # zustand state
        ├── components/
        │   ├── Deck.tsx           # button grid
        │   ├── DeckButton.tsx
        │   ├── ButtonEditor.tsx   # add/edit modal
        │   └── StatusBar.tsx      # connection indicator
        └── types.ts
```

---

## Data Model

```typescript
// Button
{
  id: string,           // uuid
  label: string,        // display text
  icon: string,         // emoji or lucide icon name
  color: string,        // hex bg color
  action: {
    type: "shell" | "app" | "hotkey",
    command: string     // e.g. "notify-send hello" / "firefox" / "ctrl+shift+t"
  },
  position: number      // grid order index
}
```

---

## API Surface

| Method | Path            | Body           | Description                     |
| ------ | --------------- | -------------- | ------------------------------- |
| GET    | `/buttons`      | —              | All buttons ordered by position |
| POST   | `/buttons`      | Button (no id) | Create button                   |
| PUT    | `/buttons/{id}` | Partial Button | Update button                   |
| DELETE | `/buttons/{id}` | —              | Delete button                   |
| POST   | `/execute/{id}` | —              | Run button's action             |
| WS     | `/ws`           | —              | Heartbeat channel               |

---

## Implementation Order

### Phase 1 — Server scaffold

1. `server/requirements.txt`: fastapi, uvicorn, pynput
2. `server/store.py`: load/save `buttons.json`
3. `server/executor.py`:
   - `shell`: `subprocess.Popen(cmd, shell=True)`
   - `app`: same as shell, or `xdg-open`
   - `hotkey`: `pynput.keyboard.Controller` press combo
4. `server/routes/execute.py`: `POST /execute/{id}` — look up button, dispatch executor
5. `server/routes/buttons.py`: CRUD — `GET /buttons`, `POST /buttons`, `PUT /buttons/{id}`, `DELETE /buttons/{id}`
6. `server/routes/ws.py`: `WS /ws` — ping/pong heartbeat every 5s
7. `server/main.py`: assemble app, CORS allow-all (LAN only), mount routes
8. `server/modeck.service`: systemd user service pointing to uvicorn

### Phase 2 — Client scaffold

1. `npm create vite@latest client -- --template react-ts`
2. Add `vite-plugin-pwa`, `zustand`, `lucide-react`
3. `client/vite.config.ts`: PWA config (manifest, SW, icons)
4. `client/public/manifest.json`: name, icons, display standalone, theme color
5. `client/src/types.ts`: Button type
6. `client/src/api.ts`: REST calls + WebSocket manager (auto-reconnect)

### Phase 3 — Core UI

1. `StatusBar.tsx`: colored dot (green=connected, red=disconnected), shows server URL
2. `DeckButton.tsx`: colored tile, label + icon, `onPress` → `POST /execute/{id}`
3. `Deck.tsx`: CSS grid layout, renders buttons from store, `+` add button slot
4. `App.tsx`: fetch buttons on mount, hold in zustand store, render Deck + StatusBar

### Phase 4 — Button editor

1. `ButtonEditor.tsx`: modal with fields — label, icon (emoji input), color picker, action type select, command text input
2. Long-press on existing button → open editor (edit mode)
3. Tap `+` → open editor (create mode)
4. Save → `POST` or `PUT` to server, refresh store

### Phase 5 — Polish + PWA

1. `manifest.json` icons: generate 192×192 and 512×512 PNGs
2. Service worker: offline fallback page ("Server unreachable")
3. Add to home screen prompt handling
4. Responsive grid: 2 cols on phone, 3–4 cols on tablet (CSS grid auto-fill)
5. Haptic feedback on button press: `navigator.vibrate(50)`

### Phase 6 — systemd + docs

1. Finalize `modeck.service` with `ExecStart`, `Restart=always`, `WantedBy=default.target`
2. `server/README.md`: install steps, `systemctl --user enable modeck`, how to find local IP for PWA

### Phase 7 — Future features

1. **Image icons**: ✓ URL support done. Local file upload pending (store base64 in `icon` field)
2. **Configurable long-press**: per-button optional `longPressAction` field (same shape as `action`). Long press when not in edit mode runs secondary command
3. **Paged grid layout**: ✓ done — 3×5 phone pages + desktop scrollable grid
4. **Visual feedback on fire**: success/error overlay on button after execution (green flash / red flash, 1s)
5. **Execution error toast**: show error message if command fails
6. **Button reordering**: drag to rearrange buttons on the grid
7. **Button groups / layouts**: save a named set of buttons, switch between them
8. **Script editor**: write/edit shell scripts directly in the app
9. **Server URL settings UI**: in-app panel to change server URL, and other settings (see below)
10. **HTTPS setup**: mkcert self-signed cert for proper PWA install prompt on Android
11. **Local image upload**: upload image from phone/PC, store as base64 in `icon` field
12. **Receive data from PC**: new action type `receive` — server pushes data (e.g. PC clipboard contents) to the phone via WebSocket. Phone receives and saves to its own clipboard (`navigator.clipboard.writeText`)
13. **HTTP request action**: new action type `request` — button fires a GET or POST to an arbitrary URL (e.g. WLED at `http://192.168.x.x/json`), with optional JSON body configured in the editor. Useful for smart home / local API control
14. **Request response handling**: for GET requests, response body can be:
    - Saved to phone clipboard
    - Written to a file on the PC (path configured per button)
    - Toggle switch in button editor to choose between the two output modes

### Data flow for receive/request actions

```
receive:
  PC side: server reads clipboard (xclip/xsel) → pushes via WS → phone saves to clipboard

request (no output):
  phone → server → HTTP request to target URL → success/error feedback

request (with output):
  phone → server → HTTP GET → response body →
    if clipboard: send via WS → phone navigator.clipboard.writeText()
    if file: write to configured path on PC
```

### Settings UI (Phase 9 detail)

In-app settings panel accessible from the `···` menu. Possible settings:
- **Server URL** — change without opening browser console
- **Grid columns override** — override auto-fill column count on desktop
- **Button size** — small / medium / large preset for desktop grid

---

## Verification

- `uvicorn main:app --host 0.0.0.0 --port 8765` starts cleanly
- Phone browser hits `http://<pc-ip>:8765` → loads React PWA
- Buttons auto-load, tapping one runs command on PC
- Add/edit button modal saves and persists across reload
- Service worker intercepts offline → shows fallback
- `systemctl --user start modeck` brings server up; `status` shows active
- "Add to Home Screen" on Android/iOS creates standalone icon
