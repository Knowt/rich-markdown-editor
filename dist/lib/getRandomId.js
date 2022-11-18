"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomId = void 0;
const nanoid_1 = require("nanoid");
const getRandomId = (randomness = 4) => {
    return nanoid_1.nanoid(randomness);
};
exports.getRandomId = getRandomId;
//# sourceMappingURL=getRandomId.js.map