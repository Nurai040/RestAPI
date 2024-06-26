"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tearDownTest = exports.setUpTest = void 0;
const app_1 = require("./loaders/app");
let server;
function setUpTest() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield (0, app_1.loadApp)();
        server = app.listen(3007, () => console.log(`Test server is running on http://localhost:3001`));
        return server;
    });
}
exports.setUpTest = setUpTest;
function tearDownTest() {
    return __awaiter(this, void 0, void 0, function* () {
        if (server) {
            server.close();
        }
    });
}
exports.tearDownTest = tearDownTest;
//# sourceMappingURL=setUpTest.js.map