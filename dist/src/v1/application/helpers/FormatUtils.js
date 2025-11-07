"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNumbers = extractNumbers;
exports.extractUsername = extractUsername;
function extractNumbers(input) {
    return input.replace(/\D+/g, '');
}
function extractUsername(input) {
    const parts = input.split('@');
    return parts.length === 2 ? parts[0] : input;
}
