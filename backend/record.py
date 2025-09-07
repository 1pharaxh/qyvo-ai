from pynput import mouse, keyboard
from pyvda import VirtualDesktop
import json
import time
import pyautogui
from datetime import datetime

screen_width, screen_height = pyautogui.size()


class RecordUiEvents:
    def __init__(self, recorded_events=[]):
        self._recorded_events = recorded_events
        self.mouse_listener = None
        self.keyboard_listener = None

    def _on_move(self, x, y):
        self._recorded_events.append({
            "type": "move",
            "x": x / screen_width,
            "y": y / screen_height,
            "time": time.time()
        })

    def _on_click(self, x, y, button, pressed):
        self._recorded_events.append({
            "type": "click",
            "x": x,
            "y": y,
            "button": str(button),
            "pressed": pressed,
            "time": time.time()
        })

    def _on_press(self, key):
        self._recorded_events.append({
            "type": "key",
            "key": str(key),
            "time": time.time()
        })

    def _on_release(self, key):
        if key == keyboard.Key.esc:
            # Stop both listeners
            print("ESC pressed: stopping recording...")
            if self.mouse_listener:
                self.mouse_listener.stop()
            if self.keyboard_listener:
                self.keyboard_listener.stop()
            return False  # stop keyboard listener

    def record(self):
        # Start mouse and keyboard listeners
        print("recording to workflow.json")

        mouse_listener = mouse.Listener(
            on_move=self._on_move, on_click=self._on_click)
        keyboard_listener = keyboard.Listener(
            on_press=self._on_press, on_release=self._on_release)

        self.mouse_listener = mouse_listener
        self.keyboard_listener = keyboard_listener
        keyboard_listener.start()
        mouse_listener.start()

        # Wait until both finish
        mouse_listener.join()
        keyboard_listener.join()
        current_datetime = datetime.now()

        timestamp_string = current_datetime.strftime("%Y-%m-%d %H:%M:%S")

        with open(f'workflow-${timestamp_string}.json', "w") as f:
            json.dump(self._recorded_events, f, indent=2)
        print("Recording saved to workflow.json")


class PlayEvents:
    def __init__(self, virtual_desktop=False):
        self._virtual_desktop = virtual_desktop

    def play(self, filename):
        print("playing workflow.json")
        if (self._virtual_desktop):
            new_desktop = VirtualDesktop.create()
            time.sleep(0.5)
            new_desktop.go()
            time.sleep(1)  # allow desktop switch

        # ---------------------------
        # Step 2: Load recorded workflow
        # ---------------------------
        with open(filename, "r") as f:
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


# Create recorder instance
recorder = RecordUiEvents([])
play = PlayEvents()

recorder.record()

# play.play()
