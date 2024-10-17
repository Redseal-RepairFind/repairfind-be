"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.s3FileUpload = exports.uploadToS3 = exports.diskUpload = exports.memoryUpload = void 0;
var multer_1 = __importDefault(require("multer"));
var client_s3_1 = require("@aws-sdk/client-s3");
var config_1 = require("../config");
var util_1 = require("util");
var fs = __importStar(require("fs"));
exports.memoryUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // Store images in memory before uploading to S3
});
exports.diskUpload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/'); // Destination folder for uploads
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname); // Use the original filename
        },
    })
});
var uploadToS3 = function (buffer, originalFilename) { return __awaiter(void 0, void 0, void 0, function () {
    var awsAccessKey, awsAccessSecretKey, awsBucketName, s3, timestamp, key, params, command, response, fileLocation, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
                    return [2 /*return*/, null];
                }
                awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
                awsAccessSecretKey = (_a = process.env.AWS_SECRET_ACCESS_KEY) === null || _a === void 0 ? void 0 : _a.toString();
                awsBucketName = (_b = process.env.AWS_BUCKET_NAME) === null || _b === void 0 ? void 0 : _b.toString();
                s3 = new client_s3_1.S3Client({
                    region: 'us-east-1',
                    credentials: {
                        accessKeyId: awsAccessKey,
                        secretAccessKey: awsAccessSecretKey,
                    },
                });
                timestamp = Date.now().toString();
                key = "".concat(timestamp, "-").concat(originalFilename);
                params = {
                    Bucket: awsBucketName,
                    Key: key,
                    Body: buffer,
                    ACL: 'public-read',
                };
                command = new client_s3_1.PutObjectCommand(params);
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                return [4 /*yield*/, s3.send(command)];
            case 2:
                response = _c.sent();
                fileLocation = "https://".concat(params.Bucket, ".s3.amazonaws.com/").concat(params.Key);
                return [2 /*return*/, { response: response, Location: fileLocation }];
            case 3:
                error_1 = _c.sent();
                console.error('Error uploading to S3:', error_1);
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.uploadToS3 = uploadToS3;
var readFileAsync = (0, util_1.promisify)(fs.readFile);
var s3UploadAsync = (0, util_1.promisify)(config_1.s3.upload.bind(config_1.s3));
var s3FileUpload = function (files) { return __awaiter(void 0, void 0, void 0, function () {
    var uploadedUrls, _i, files_1, file, originalname, buffer, mimetype, path, fileName, objectName, fileExtension, parameters, data, error_2;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 7, , 8]);
                uploadedUrls = [];
                _i = 0, files_1 = files;
                _d.label = 1;
            case 1:
                if (!(_i < files_1.length)) return [3 /*break*/, 6];
                file = files_1[_i];
                originalname = file.originalname, buffer = file.buffer, mimetype = file.mimetype, path = file.path;
                if (!(path && !buffer)) return [3 /*break*/, 3];
                return [4 /*yield*/, readFileAsync(path)];
            case 2:
                buffer = _d.sent();
                _d.label = 3;
            case 3:
                fileName = (_c = (_b = (_a = originalname === null || originalname === void 0 ? void 0 : originalname.split('\\')) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.split('/').pop()) !== null && _c !== void 0 ? _c : '';
                objectName = "".concat(new Date().getTime() + fileName);
                fileExtension = originalname.slice((originalname.lastIndexOf(".") - 1 >>> 0) + 2);
                parameters = {
                    Bucket: config_1.config.aws.s3BucketName,
                    Key: objectName,
                    Body: buffer,
                    ContentType: mimetype !== null && mimetype !== void 0 ? mimetype : "image/".concat(fileExtension),
                };
                return [4 /*yield*/, s3UploadAsync(parameters)];
            case 4:
                data = _d.sent();
                console.log("File uploaded successfully. ".concat(data.Location));
                uploadedUrls.push(data.Location);
                _d.label = 5;
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, uploadedUrls];
            case 7:
                error_2 = _d.sent();
                console.error('Error uploading files to s3:', error_2);
                return [2 /*return*/, undefined];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.s3FileUpload = s3FileUpload;
