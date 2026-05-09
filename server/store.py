import json
import uuid
from pathlib import Path
from typing import Optional

DATA_FILE = Path(__file__).parent / "data" / "buttons.json"


def _save(data):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)


def _load():
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


def get_all():
    return _load()


def get_by_id(button_id: str) -> Optional[dict]:
    buttons = _load()
    for button in buttons:
        if button["id"] == button_id:
            return button
    return None


def create(button_data: dict) -> dict:
    buttons = _load()
    new_button = {
        "id": str(uuid.uuid4()),
        "label": button_data.get("label", ""),
        "icon": button_data.get("icon", ""),
        "color": button_data.get("color", "#FFFFFF"),
        "action": button_data.get("action", ""),
        "position": button_data.get("position", len(buttons)),
        "page": button_data.get("page", 0),
        "longPressAction": button_data.get("longPressAction", None),
    }
    buttons.append(new_button)
    _save(buttons)
    return new_button


def update(button_id: str, button_data: dict) -> Optional[dict]:
    buttons = _load()
    for i, button in enumerate(buttons):
        if button["id"] == button_id:
            updated_button = {
                "id": button_id,
                "label": button_data.get("label", button["label"]),
                "icon": button_data.get("icon", button["icon"]),
                "color": button_data.get("color", button["color"]),
                "action": button_data.get("action", button["action"]),
                "position": button_data.get("position", button["position"]),
                "page": button_data.get("page", button.get("page", 0)),
                "longPressAction": button_data.get("longPressAction", button.get("longPressAction", None)),
            }
            buttons[i] = updated_button
            _save(buttons)
            return updated_button
    return None


def delete(button_id: str) -> bool:
    buttons = _load()
    for i, button in enumerate(buttons):
        if button["id"] == button_id:
            del buttons[i]
            _save(buttons)
            return True
    return False
