"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionFactory = void 0;
const Permission_1 = require("../../../../../infrastructure/repository/permission/Permission");
const HttpMethodFactory_1 = require("../../repository/http-methods/HttpMethodFactory");
const PermissionFactory = () => {
    return new Permission_1.Permission((0, HttpMethodFactory_1.HttpMethodFactory)());
};
exports.PermissionFactory = PermissionFactory;
