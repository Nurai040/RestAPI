"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.cachService = void 0;
const redis = __importStar(require("redis"));
const config_1 = require("../config");
class CacheService {
    constructor() {
        this.client = redis.createClient({
            socket: {
                host: config_1.config.redis.host,
                port: config_1.config.redis.port,
            },
        });
        this.client.on('error', (err) => console.error('Redis error:', err));
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                console.log('Connected to Redis!');
            }
            catch (error) {
                console.error('Failed to connect to Redis: ', error);
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.client.get(key);
                return data ? JSON.parse(data) : null;
            }
            catch (error) {
                console.error('Error with Redis GET: ', error);
            }
        });
    }
    set(key, value, expInSec = 3600) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.setEx(key, expInSec, value);
            }
            catch (error) {
                console.error('Error with Redis SET: ', error);
            }
        });
    }
    del(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.del(key);
            }
            catch (error) {
                console.error('Error with Redis DEL: ', error);
            }
        });
    }
    delByPattern(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = yield this.client.keys(pattern);
                if (keys.length > 0) {
                    yield this.client.del(keys);
                }
            }
            catch (error) {
                console.error('Error with deleting by pattern in Redis: ', error);
            }
        });
    }
}
exports.cachService = new CacheService();
//# sourceMappingURL=redis.service.js.map