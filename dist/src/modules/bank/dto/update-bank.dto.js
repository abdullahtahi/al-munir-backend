"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBankDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_bank_dto_1 = require("./create-bank.dto");
class UpdateBankDto extends (0, swagger_1.PartialType)(create_bank_dto_1.CreateBankDto) {
}
exports.UpdateBankDto = UpdateBankDto;
//# sourceMappingURL=update-bank.dto.js.map