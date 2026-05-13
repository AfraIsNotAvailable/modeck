# MoDeck Integrations

Button ideas and shell commands for automations. More to come.

---

## Media Control
Playerctl works across Spotify, mpv, and any MPRIS-compatible player.

| Button | Command |
|--------|---------|
| Play / Pause | `playerctl play-pause` |
| Next track | `playerctl next` |
| Previous track | `playerctl previous` |
| Volume up 5% | `pactl set-sink-volume @DEFAULT_SINK@ +5%` |
| Volume down 5% | `pactl set-sink-volume @DEFAULT_SINK@ -5%` |
| Mute speaker | `pactl set-sink-mute @DEFAULT_SINK@ toggle` |
| Mute mic | `pactl set-source-mute @DEFAULT_SOURCE@ toggle` |

---

## OBS
Basic CLI flags. OBS WebSocket integration (cleaner start/stop without killing the app) — TODO.

| Button | Command |
|--------|---------|
| Start recording | `obs --startrecording --minimize-to-tray` |
| Stop OBS | `pkill -SIGTERM obs` |
| Start streaming | `obs --startstreaming --minimize-to-tray` |

---

## Hyprland

| Button | Command |
|--------|---------|
| Lock screen | `loginctl lock-session` |
| Reload config | `hyprctl reload` |
| Toggle notifications | `dunstctl set-paused toggle` |
| Clear notifications | `dunstctl close-all` |
| Fullscreen focused window | `hyprctl dispatch fullscreen 0` |
| Kill focused window | `hyprctl dispatch killactive` |

---

## App Launchers

| Button | Command |
|--------|---------|
| Spotify | `spotify &` |
| Discord | `discord &` |
| GIMP | `gimp &` |
| Krita | `krita &` |
| Blender | `blender &` |
| Ardour 9 | `ardour9 &` |
| Anime Game Launcher | `an-anime-game-launcher-bin &` |

---

## Steam / Gaming

| Button | Command |
|--------|---------|
| Launch Steam | `steam &` |
| Steam Big Picture | `steam steam://open/bigpicture` |
| Kill Steam | `pkill steam` |

---

## System

| Button | Command |
|--------|---------|
| Sleep | `systemctl suspend` |
| Reboot | `systemctl reboot` |

---

## TODO / Future Ideas
- OBS WebSocket integration (start/stop recording/streaming without killing OBS)
- Waybar toggle (if added: `pkill -SIGUSR1 waybar`)
- Per-app volume control via PipeWire
- Hyprland workspace switching buttons
- Git shortcuts (pull, status, push for active repo)
