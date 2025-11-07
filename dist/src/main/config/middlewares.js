"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
exports.default = (app) => {
    app.use((0, cors_1.default)());
    app.use((0, express_1.json)({ limit: '10mb' }));
    app.use(body_parser_1.default.urlencoded({ extended: true }));
};
