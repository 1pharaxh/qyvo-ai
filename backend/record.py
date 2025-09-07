from pynput import mouse, keyboard
import json
import time
import pyautogui


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

        with open("workflow.json", "w") as f:
            json.dump(self._recorded_events, f, indent=2)
        print("Recording saved to workflow.json")


# Create recorder instance
recorder = RecordUiEvents([])
recorder.record()
