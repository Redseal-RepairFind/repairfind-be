"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyAPIFeature = exports.APIFeatures = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var APIFeatures = /** @class */ (function () {
    function APIFeatures(query, queryString) {
        this.query = query;
        this.queryString = queryString;
        this.filters = {};
    }
    APIFeatures.prototype.filter = function () {
        var queryObj = __assign({}, this.queryString);
        var excludedFields = ['page', 'sort', 'limit', 'fields', 'startDate', 'endDate', 'search', 'searchFields'];
        excludedFields.forEach(function (el) { return delete queryObj[el]; });
        // 1B) Advanced filtering
        var queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) { return "$".concat(match); });
        this.query = this.query.find(JSON.parse(queryStr));
        // Filtering by date range
        if (this.queryString.startDate) {
            var dateFilter = {};
            if (this.queryString.startDate) {
                var startDate = new Date(this.queryString.startDate);
                startDate.setUTCHours(0, 0, 0, 0);
                dateFilter.$gte = startDate;
            }
            if (this.queryString.endDate) {
                var endDate = new Date(this.queryString.endDate);
                endDate.setUTCHours(23, 59, 59, 999);
                dateFilter.$lte = endDate;
            }
            // If no end date is provided, set it to the end of the day
            if (!this.queryString.endDate) {
                var endDate = new Date(this.queryString.startDate);
                endDate.setUTCHours(23, 59, 59, 999);
                dateFilter.$lte = endDate;
            }
            this.query = this.query.find({ createdAt: dateFilter });
            // Pass the date filter to the filters object
            this.filters = __assign(__assign({}, JSON.parse(queryStr)), { createdAt: dateFilter });
        }
        return this;
    };
    APIFeatures.prototype.sort = function () {
        if (this.queryString.sort) {
            var sortBy = this.queryString.sort.split(',');
            var sortOptions_1 = '';
            sortBy.forEach(function (sortField) {
                if (sortField.startsWith('-')) {
                    // Sort in descending order
                    var field = sortField.substring(1);
                    sortOptions_1 += "-".concat(field, " ");
                }
                else {
                    // Sort in ascending order
                    sortOptions_1 += "".concat(sortField, " ");
                }
            });
            this.query = this.query.sort(sortOptions_1.trim());
        }
        else {
            // Default sorting by createdAt field in descending order
            this.query = this.query.sort('-createdAt');
        }
        return this;
    };
    APIFeatures.prototype.limitFields = function () {
        if (this.queryString.fields) {
            var fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }
        return this;
    };
    APIFeatures.prototype.paginate = function () {
        var page = this.queryString.page * 1 || 1;
        var limit = this.queryString.limit * 1 || 20;
        var skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    };
    APIFeatures.prototype.getTotalItems = function () {
        return __awaiter(this, void 0, void 0, function () {
            var totalItems;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.query.model.countDocuments(this.query._conditions)];
                    case 1:
                        totalItems = _a.sent();
                        return [2 /*return*/, totalItems];
                }
            });
        });
    };
    APIFeatures.prototype.search = function () {
        if (this.queryString.search && this.queryString.searchFields) {
            var searchRegex_1;
            if (mongoose_1.default.Types.ObjectId.isValid(this.queryString.search)) {
                searchRegex_1 = this.queryString.search; // Use ObjectId directly
            }
            else {
                searchRegex_1 = new RegExp(this.queryString.search, 'i');
            }
            var searchFields = this.queryString.searchFields.split(',');
            console.log('searchRegex', searchRegex_1);
            var searchConditions = searchFields.map(function (field) {
                var _a;
                return (_a = {}, _a[field] = searchRegex_1, _a);
            });
            console.log('searchConditions', searchConditions);
            this.query = this.query.find({ $or: searchConditions });
        }
        return this;
    };
    return APIFeatures;
}());
exports.APIFeatures = APIFeatures;
var applyAPIFeature = function (model, query, methods) { return __awaiter(void 0, void 0, void 0, function () {
    var features, queryMethods_1, dataQuery, limit, currentPage, totalItems, lastPage, data, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                features = new APIFeatures(model, query);
                queryMethods_1 = methods !== null && methods !== void 0 ? methods : [];
                features.filter().search().sort().limitFields().paginate();
                return [4 /*yield*/, features.query];
            case 1:
                dataQuery = _a.sent();
                if (!(dataQuery && dataQuery.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, Promise.all(dataQuery.map(function (doc) { return __awaiter(void 0, void 0, void 0, function () {
                        var methods;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    methods = Object.keys(doc.schema.methods);
                                    return [4 /*yield*/, Promise.all(methods.map(function (method) { return __awaiter(void 0, void 0, void 0, function () {
                                            var result, methodName;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        if (!(typeof doc[method] === 'function' && queryMethods_1.includes(method))) return [3 /*break*/, 2];
                                                        return [4 /*yield*/, doc[method]()];
                                                    case 1:
                                                        result = _a.sent();
                                                        methodName = method.charAt(3).toLowerCase() + method.slice(4);
                                                        doc[methodName] = result; // Assign the resolved result to the document
                                                        _a.label = 2;
                                                    case 2: return [2 /*return*/];
                                                }
                                            });
                                        }); }))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 2:
                _a.sent();
                _a.label = 3;
            case 3:
                limit = features.queryString.limit;
                currentPage = features.queryString.page;
                return [4 /*yield*/, features.getTotalItems()];
            case 4:
                totalItems = _a.sent();
                lastPage = Math.ceil(totalItems / limit);
                data = {
                    totalItems: totalItems,
                    limit: limit,
                    currentPage: currentPage,
                    lastPage: lastPage,
                    data: dataQuery,
                };
                return [2 /*return*/, { data: data, error: null, filter: features.filters }];
            case 5:
                error_1 = _a.sent();
                console.log(error_1);
                return [2 /*return*/, { data: null, error: error_1 }];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.applyAPIFeature = applyAPIFeature;
