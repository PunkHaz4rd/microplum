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
Object.defineProperty(exports, "__esModule", { value: true });
var PlumError = (function () {
    function PlumError(code, name, message) {
        this.code = code;
        this.name = name;
        this.message = message;
    }
    ;
    return PlumError;
}());
exports.PlumError = PlumError;
var ServerPlumError = (function (_super) {
    __extends(ServerPlumError, _super);
    function ServerPlumError(message) {
        if (message === void 0) { message = "Unexpected server error"; }
        return _super.call(this, 500, exports.PlumErrorNames.server_error, message) || this;
    }
    return ServerPlumError;
}(PlumError));
exports.ServerPlumError = ServerPlumError;
var NotFoundPlumError = (function (_super) {
    __extends(NotFoundPlumError, _super);
    function NotFoundPlumError(message) {
        if (message === void 0) { message = "Entity not found error"; }
        return _super.call(this, 404, exports.PlumErrorNames.not_found, message) || this;
    }
    return NotFoundPlumError;
}(PlumError));
exports.NotFoundPlumError = NotFoundPlumError;
var ForbiddenPlumError = (function (_super) {
    __extends(ForbiddenPlumError, _super);
    function ForbiddenPlumError(message) {
        if (message === void 0) { message = "Access forbidden"; }
        return _super.call(this, 403, exports.PlumErrorNames.forbidden, message) || this;
    }
    return ForbiddenPlumError;
}(PlumError));
exports.ForbiddenPlumError = ForbiddenPlumError;
var UnauthorizedPlumError = (function (_super) {
    __extends(UnauthorizedPlumError, _super);
    function UnauthorizedPlumError(message) {
        if (message === void 0) { message = "Unauthorized access"; }
        return _super.call(this, 401, exports.PlumErrorNames.unauthorized, message) || this;
    }
    return UnauthorizedPlumError;
}(PlumError));
exports.UnauthorizedPlumError = UnauthorizedPlumError;
var ParametersPlumError = (function (_super) {
    __extends(ParametersPlumError, _super);
    function ParametersPlumError(message) {
        return _super.call(this, 400, exports.PlumErrorNames.parameters_error, message) || this;
    }
    return ParametersPlumError;
}(PlumError));
exports.ParametersPlumError = ParametersPlumError;
var FieldError = (function () {
    function FieldError(field, name, message) {
        this.field = field;
        this.name = name;
        this.message = message;
    }
    return FieldError;
}());
exports.FieldError = FieldError;
var ValidationPlumError = (function (_super) {
    __extends(ValidationPlumError, _super);
    function ValidationPlumError(fields, message) {
        if (message === void 0) { message = null; }
        var _this = _super.call(this, 422, exports.PlumErrorNames.validation_error, message) || this;
        _this.fields = fields;
        return _this;
    }
    return ValidationPlumError;
}(PlumError));
exports.ValidationPlumError = ValidationPlumError;
var PreconditionFailedPlumError = (function (_super) {
    __extends(PreconditionFailedPlumError, _super);
    function PreconditionFailedPlumError(message) {
        if (message === void 0) { message = null; }
        return _super.call(this, 412, exports.PlumErrorNames.predondition_error, message) || this;
    }
    return PreconditionFailedPlumError;
}(PlumError));
exports.PreconditionFailedPlumError = PreconditionFailedPlumError;
/** Utility function to create a K:V from a list of strings */
function strEnum(o) {
    return o.reduce(function (res, key) {
        res[key] = key;
        return res;
    }, Object.create(null));
}
/** Create a K:V */
exports.PlumErrorNames = strEnum([
    "server_error",
    "not_found",
    "forbidden",
    "unauthorized",
    "parameters_error",
    "validation_error",
    "predondition_error",
]);

//# sourceMappingURL=error.js.map
