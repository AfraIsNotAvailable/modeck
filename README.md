# MoDeck

Mobile deck for PC control. Run commands, launch apps, and trigger hotkeys from your phone or tablet — served as a PWA from your PC over local network.

## Requirements

- Python 3.11+
- Node.js 18+
- Linux (uses `pynput` for hotkeys)

## Install

### Server

```bash
cd modeck
python -m venv .venv
.venv/bin/pip install fastapi "uvicorn[standard]" pynput Pillow requests
```

Install and start the systemd service:

```bash
cp server/modeck.service ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now modeck
```

The server runs on port `8765` and starts automatically on login.

### Client

```bash
cd client
npm install
npm run build
```

The built app is served by the server — no separate hosting needed.

### Find your PC's IP

```bash
ip a | grep "inet " | grep -v 127.0.0.1
```

Open `http://<ip>:8765` on your phone or tablet.

## Features

- **Button grid** — configurable columns × rows per page, swipe between pages on phone
- **Desktop layout** — scrollable auto-fill grid with max-width container
- **Button actions** — shell commands, app launchers, hotkey combos
- **Long press** — optional secondary action per button
- **Icon support** — emoji, text, or any image URL (accent color auto-detected)
- **Custom color picker** — HSV square + hue slider, or quick swatches
- **Live preview** — see the button as it will appear while editing
- **Visual feedback** — green ✓ on success, dark red ✗ on error
- **Edit mode** — tap ··· → Edit Buttons, buttons shiver, tap one to edit
- **Settings** — server URL, phone grid size, desktop button size via ··· → Settings
- **PWA** — add to home screen, works offline with fallback page

## Adding buttons

1. Open the app on your phone
2. Tap **+** to add a button
3. Fill in:
   - **Name** — label shown on the button
   - **Icon** — emoji, or paste an image URL (color auto-fills from the image)
   - **Color** — pick a swatch, or tap the rainbow circle for the full HSV picker
   - **Type** — `shell`, `app`, or `hotkey`
   - **Command** — the shell command, app name, or key combo (e.g. `ctrl+shift+t`)
   - **Long press action** — optional secondary command on long press
4. Tap **Save**

## Editing buttons

1. Tap **···** top-right → **Edit Buttons**
2. Buttons start shivering
3. Tap any button to edit or delete it
4. Tap **Edit Buttons** again to exit

## Settings

Tap **···** top-right → **Settings**:

- **Server URL** — point the app at a different machine or port (reloads on save)
- **Phone grid** — columns × rows per page (default 3 × 5)
- **Desktop button size** — min px for auto-fill columns (default 100)

## Hotkey format

Keys joined by `+`. Supported modifiers: `ctrl`, `shift`, `alt`, `super`. Examples:

```
ctrl+shift+t
super+l
ctrl+c
```

## Updating after code changes

```bash
cd client && npm run build
```

Rebuilds the app and restarts the server automatically.

## Planned

- Local image upload as button icon
- Button drag-to-reorder
- Button groups / layout switching
- Script editor in-app
- HTTPS setup for proper PWA install prompt
