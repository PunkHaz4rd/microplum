"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("./error");
var ServiceEntity = (function () {
    function ServiceEntity(name, facade, servicePin) {
        this.name = name;
        this.facade = facade;
        this.servicePin = servicePin;
        this.act = function (args) {
            console.log("[Microplum] '.act' not set in the service entity. Please use setAct method before.");
            throw new error_1.ServerPlumError("'.act' service not found.");
        };
        if (this.facade) {
            this.facade.act = this.act;
        }
    }
    ServiceEntity.prototype.setAct = function (act) {
        this.act = act;
        if (this.facade) {
            this.facade.act = this.act;
        }
    };
    ServiceEntity.prototype.getAct = function (user) {
        var _this = this;
        return function (args) {
            if (user) {
                args.user = args.user || user;
            }
            return _this.act(args);
        };
    };
    ServiceEntity.prototype.plugin = function () {
        var addServices = this.addServices.bind(this);
        var addDefaultService = this.addDefaultService.bind(this);
        return function (options) {
            addServices(this, options);
            addDefaultService(this, options);
        };
    };
    ServiceEntity.prototype.publicPin = function () {
        return { role: this.name };
    };
    ServiceEntity.prototype.addDefaultService = function (seneca, options) {
        var _this = this;
        var pin = this.pin(this.name, "*");
        seneca.add(pin, this.handleService(function (args) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("WARNING: [Microplum] Method is not registered for PIN:" + JSON.stringify(pin));
                if (args.nonErrorDefault) {
                    return [2 /*return*/, Promise.resolve()];
                }
                else {
                    throw new error_1.NotAllowedPlumError("Service not found.", { service: pin, args: args });
                }
                return [2 /*return*/];
            });
        }); }));
    };
    ServiceEntity.prototype.pin = function (role, cmd) {
        var pin = Object.assign({}, this.servicePin || {});
        pin.role = role;
        pin.cmd = cmd;
        return pin;
    };
    ServiceEntity.prototype.handleService = function (cb) {
        var escapeDoc = this.escapeDoc.bind(this);
        return function (args, done) {
            cb(args)
                .then(function (doc) { return done(null, { status: true, data: escapeDoc(doc) }); })
                .catch(function (err) {
                if (err instanceof error_1.PlumError) {
                    done(null, { status: false, error: err });
                }
                else {
                    done(err);
                }
            });
        };
    };
    ServiceEntity.prototype.escapeDoc = function (doc) {
        var _this = this;
        if (Array.isArray(doc)) {
            return doc.map(function (docElement) { return _this.escapeDoc(docElement); });
        }
        else if (doc && doc.toObject) {
            return doc.toObject();
        }
        else if (doc) {
            return doc;
        }
        else {
            return null;
        }
    };
    return ServiceEntity;
}());
exports.ServiceEntity = ServiceEntity;
/**
 * CRUD for the entity
 */
var RestEntity = (function (_super) {
    __extends(RestEntity, _super);
    function RestEntity() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RestEntity.prototype.addServices = function (seneca, options) {
        this.addGetServices(seneca);
        this.addStatisticalServices(seneca);
        this.addModifyServices(seneca);
    };
    RestEntity.prototype.addGetServices = function (seneca) {
        var _this = this;
        if (this.facade.find) {
            seneca.add(this.pin(this.name, "find"), this.handleService(function (args) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.facade.find(args.conditions)];
            }); }); }));
        }
        if (this.facade.findOne) {
            seneca.add(this.pin(this.name, "findOne"), this.handleService(function (args) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.facade.findOne(args.conditions)];
            }); }); }));
        }
        if (this.facade.findById) {
            seneca.add(this.pin(this.name, "findById"), this.handleService(function (args) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.facade.findById(args.id)];
            }); }); }));
        }
    };
    RestEntity.prototype.addStatisticalServices = function (seneca) {
        var _this = this;
        if (this.facade.count) {
            seneca.add(this.pin(this.name, "count"), this.handleService(function (args) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.facade.count(args.conditions)];
            }); }); }));
        }
    };
    RestEntity.prototype.addModifyServices = function (seneca) {
        var _this = this;
        if (this.facade.create) {
            seneca.add(this.pin(this.name, "create"), this.handleService(function (args) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.facade.create(args.input)];
            }); }); }));
        }
        if (this.facade.update) {
            seneca.add(this.pin(this.name, "update"), this.handleService(function (args) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.facade.update(args.conditions, args.input)];
            }); }); }));
        }
        if (this.facade.remove) {
            seneca.add(this.pin(this.name, "remove"), this.handleService(function (args) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, this.facade.remove(args.id)];
            }); }); }));
        }
    };
    return RestEntity;
}(ServiceEntity));
exports.RestEntity = RestEntity;

//# sourceMappingURL=entity.js.map
