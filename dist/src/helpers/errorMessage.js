"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = void 0;
const getErrorMessage = error => {
    const errorMessage = (error.errors && error.errors.length && error.errors[0].message) || error?.message;
    return {
        message: errorMessage
    };
};
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=errorMessage.js.map