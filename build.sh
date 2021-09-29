#!/bin/bash
rm -rf build && mkdir build && cp -R src/* build/ && cp workbox-config.js build/ && cd build && workbox generateSW --injectManifest workbox-config.js && rm workbox-config.js && cd ..
