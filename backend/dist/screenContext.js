"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateScreenText = updateScreenText;
exports.getScreenText = getScreenText;
let latestScreenText = '';
function updateScreenText(text) {
    latestScreenText = text;
}
function getScreenText() {
    return latestScreenText;
}
