from pyvda import VirtualDesktop
from pynput import mouse, keyboard
import json
import time
import pyautogui

screen_width, screen_height = pyautogui.size()


# ---------------------------
# Step 1: Create new virtual desktop
# ---------------------------
# new_desktop = VirtualDesktop.create()
# time.sleep(0.5)
# new_desktop.go()
# time.sleep(1)  # allow desktop switch

# ---------------------------
# Step 2: Load recorded workflow
# ---------------------------
with open("workflow.json", "r") as f:
    events = json.load(f)

mouse_controller = mouse.Controller()
keyboard_controller = keyboard.Controller()

# Step 3: Playback events
if len(events) == 0:
    print("No events recorded!")
    exit()

start_time = events[0]["time"]

for event in events:
    # Wait for the relative delay
    time.sleep(event["time"] - start_time)
    start_time = event["time"]

    if event["type"] == "move":
        # Convert normalized coordinates back to current screen size
        x = int(event["x"] * screen_width)
        y = int(event["y"] * screen_height)
        mouse_controller.position = (x, y)
    elif event["type"] == "click":
        btn = mouse.Button.left if event["button"].endswith(
            ".left") else mouse.Button.right
        if event["pressed"]:
            mouse_controller.press(btn)
        else:
            mouse_controller.release(btn)
    elif event["type"] == "key":
        try:
            key_str = event["key"].replace("'", "")  # remove quotes
            key = getattr(keyboard.Key, key_str.split(".")[-1])
        except AttributeError:
            key = key_str  # regular character
        keyboard_controller.press(key)
        keyboard_controller.release(key)

print("Workflow playback complete!")
