from pynput.keyboard import Controller, Key
import subprocess
import time

KEY_MAP = {
    "ctrl": Key.ctrl,
    "alt": Key.alt,
    "shift": Key.shift,
    "super": Key.cmd,
    "enter": Key.enter,
    "tab": Key.tab,
    "esc": Key.esc,
    "space": Key.space,
}


def _parse_key(key_str: str):
    return KEY_MAP.get(key_str.lower(), key_str)


def execute(action: dict) -> bool:
    action_type = action.get("type")
    if action_type == "shell" or action_type == "app":

        command = action.get("command")
        if not command:
            return False
        try:
            proc = subprocess.Popen(command, shell=True, stderr=subprocess.PIPE)
            time.sleep(0.2)
            exit_code = proc.poll()
            if exit_code is not None and exit_code != 0:
                err = proc.stderr.read().decode().strip() if proc.stderr else ""
                print(f"Command failed ({exit_code}): {err}")
                return False
            return True
        except Exception as e:
            print(f"Error executing command: {e}")
            return False
    elif action_type == "hotkey":
        shortcut = action.get("command")
        if not shortcut:
            return False
        try:
            keys = shortcut.split("+")
            keyboard = Controller()

            for key in keys:
                keyboard.press(_parse_key(key.strip()))
            for key in reversed(keys):
                keyboard.release(_parse_key(key.strip()))

            return True
        except Exception as e:
            print(f"Error executing hotkey: {e}")
            return False
    else:
        print(f"Unknown action type: {action_type}")
        return False
