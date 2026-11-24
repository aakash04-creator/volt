# VoltTrack Real-Time Controls

A standalone browser based Ohm's law experiment for the VoltTrack Lite project. It lives in its own folder so the existing Express API remains untouched.

## Run it

Open a terminal in this folder and run `python3 -m http.server 8080`, then visit `http://localhost:8080`. ES modules require a local HTTP server; opening `index.html` as a `file://` URL may be blocked by the browser.

## How it works

`calculations.js` contains the pure Ohm's law calculation and input validation. `app.js` owns the voltage, resistance and power state, recalculates once per slider or power change, and renders all displays from that shared state. When power is off the ammeter and result are zero. The canvas graph plots current against voltage for the selected resistance and marks the current operating point. The SVG circuit animates when powered. Reset restores 12 V, 6 Ω and power off.
