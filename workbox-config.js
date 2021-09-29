module.exports = {
    globDirectory: "./",
    globPatterns: ["**/*.{html,css,png,jpg,jpeg,webp,js,json,svg,ico}"],
    globIgnores: ["workbox-config.js"],
    swDest: "sw.js",
    skipWaiting: true,
    clientsClaim: true,
    cleanupOutdatedCaches: true,
    maximumFileSizeToCacheInBytes: 5242880
};