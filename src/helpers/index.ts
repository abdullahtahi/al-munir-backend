import { DEFAULT_LIMIT } from "@/constants";

export const getPaginationOptions = params => {
    params = params || {};
    const pagination = { limit: DEFAULT_LIMIT, offset: 0 };
    if (params.limit && !isNaN(params.limit)) {
        pagination.limit = parseInt(params.limit);
    }
    if (params.page && !isNaN(params.page)) {
        pagination.offset = (parseInt(params.page) - 1) * pagination.limit;
    }
    return pagination;
};

export const getErrorMessage = error => {
    const errorMessage = (error.errors && error.errors.length && error.errors[0].message) || error?.message;
    return {
        message: errorMessage
    };
};