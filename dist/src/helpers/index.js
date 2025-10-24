"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.getPaginationOptions = void 0;
const constants_1 = require("../constants");
const getPaginationOptions = params => {
    params = params || {};
    const pagination = { limit: constants_1.DEFAULT_LIMIT, offset: 0 };
    if (params.limit && !isNaN(params.limit)) {
        pagination.limit = parseInt(params.limit);
    }
    if (params.page && !isNaN(params.page)) {
        pagination.offset = (parseInt(params.page) - 1) * pagination.limit;
    }
    return pagination;
};
exports.getPaginationOptions = getPaginationOptions;
const getErrorMessage = error => {
    const errorMessage = (error.errors && error.errors.length && error.errors[0].message) || error?.message;
    return {
        message: errorMessage
    };
};
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=index.js.map