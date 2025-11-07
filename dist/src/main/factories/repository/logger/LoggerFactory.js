"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerFactory = void 0;
const Logger_1 = require("../../../../../infrastructure/repository/logger/Logger");
const LoggerFactory = () => {
    return new Logger_1.Logger();
};
exports.LoggerFactory = LoggerFactory;
