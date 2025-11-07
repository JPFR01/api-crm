"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrievePersonalDataFactory = void 0;
const HttpMethodFactory_1 = require("../../../../../../main/factories/repository/http-methods/HttpMethodFactory");
const TokenFactory_1 = require("../../../../../../main/factories/repository/token/TokenFactory");
const RetrievePersonalData_1 = require("../../../../../../v1/application/entities/cooperative-member/retrieve-personal-data/RetrievePersonalData");
const RetrievePersonalDataFactory = () => {
    return new RetrievePersonalData_1.RetrievePersonalData((0, TokenFactory_1.TokenFactory)(), (0, HttpMethodFactory_1.HttpMethodFactory)());
};
exports.RetrievePersonalDataFactory = RetrievePersonalDataFactory;
