"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethodFactory = void 0;
const HttpMethod_1 = require("../../../../../infrastructure/repository/http-methods/HttpMethod");
const LoggerFactory_1 = require("../logger/LoggerFactory");
const HttpMethodFactory = () => {
    return new HttpMethod_1.HttpMethod((0, LoggerFactory_1.LoggerFactory)());
};
exports.HttpMethodFactory = HttpMethodFactory;
