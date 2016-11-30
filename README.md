# Home Assistant prototype in Svelte

This is a prototype UI to try out the new [Svelte framework](https://svelte.technology/) together with [Home Assistant websocket client](https://github.com/home-assistant/home-assistant-js-websocket).

 - Connect to the Home Assistant websocket API
 - Shows the current state of Home Assistant groups
 - Re-renders when the server pushes new states
 - Allows to turn switches and lights on/off (state represented as checkboxes)

Polymer on the left, Svelte with Material Design Lite on the right. Both streaming updates:

![demo](https://raw.githubusercontent.com/balloob/home-assistant-svelte-prototype/master/docs/demo.gif)

Home Assistant is an open source home automation framework. [Learn more.](https://home-assistant.io)

## Getting started

The Home Assistant websocket API is currently only available in the development release but can be installed locally. To install and run the demo mode:

```python3
pip3 install --upgrade git+git://github.com/home-assistant/home-assistant.git@dev
hass --demo
```

After that, clone this repository and open `index.html`.
