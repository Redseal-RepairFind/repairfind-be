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
exports.transferFileToS3Sync = exports.transferFileToS3 = exports.s3FileUpload = exports.uploadToS3 = exports.diskUpload = exports.memoryUpload = void 0;
var multer_1 = __importDefault(require("multer"));
var client_s3_1 = require("@aws-sdk/client-s3");
var config_1 = require("../../config");
var util_1 = require("util");
var fs = __importStar(require("fs"));
var axios_1 = __importDefault(require("axios"));
var crypto = __importStar(require("crypto"));
var path = __importStar(require("path"));
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
                console.log('uploadToS3', response);
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
var s3FileUpload = function (files) { return __awaiter(void 0, void 0, void 0, function () {
    var readFileAsync, s3UploadAsync, uploadedUrls, _i, files_1, file, originalname, buffer, mimetype, path_1, fileName, objectName, fileExtension, parameters, data, error_2;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                readFileAsync = (0, util_1.promisify)(fs.readFile);
                s3UploadAsync = (0, util_1.promisify)(config_1.s3.upload.bind(config_1.s3));
                _d.label = 1;
            case 1:
                _d.trys.push([1, 8, , 9]);
                uploadedUrls = [];
                _i = 0, files_1 = files;
                _d.label = 2;
            case 2:
                if (!(_i < files_1.length)) return [3 /*break*/, 7];
                file = files_1[_i];
                originalname = file.originalname, buffer = file.buffer, mimetype = file.mimetype, path_1 = file.path;
                if (!(path_1 && !buffer)) return [3 /*break*/, 4];
                return [4 /*yield*/, readFileAsync(path_1)];
            case 3:
                buffer = _d.sent();
                _d.label = 4;
            case 4:
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
            case 5:
                data = _d.sent();
                console.log("File uploaded successfully. ".concat(data.Location));
                uploadedUrls.push(data.Location);
                _d.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/, uploadedUrls];
            case 8:
                error_2 = _d.sent();
                console.error('Error uploading files to s3:', error_2);
                return [2 /*return*/, undefined];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.s3FileUpload = s3FileUpload;
function transferFileToS3(url, key) {
    return __awaiter(this, void 0, void 0, function () {
        var response, contentLength_1, response_1, chunks_1, error_3, error_4;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: url,
                            method: 'GET',
                            responseType: 'stream'
                        })];
                case 1:
                    response = _a.sent();
                    contentLength_1 = 0;
                    response.data.on('data', function (chunk) {
                        contentLength_1 += chunk.length;
                    });
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, axios_1.default)({
                            url: url,
                            method: 'GET',
                            responseType: 'stream' // Set responseType to stream to handle binary data
                        })];
                case 3:
                    response_1 = _a.sent();
                    chunks_1 = [];
                    response_1.data.on('data', function (chunk) {
                        chunks_1.push(chunk);
                    });
                    return [4 /*yield*/, response_1.data.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                            var dataBuffer, contentMD5, urlPath, filename, extension, uploadParams, s3Response;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        dataBuffer = Buffer.concat(chunks_1);
                                        contentMD5 = crypto.createHash('md5').update(dataBuffer).digest('base64');
                                        urlPath = new URL(url).pathname;
                                        filename = path.basename(urlPath);
                                        extension = path.extname(filename);
                                        uploadParams = {
                                            Bucket: config_1.config.aws.s3BucketName,
                                            Key: key + extension, // Append the extension to the key
                                            Body: dataBuffer,
                                            ContentLength: dataBuffer.length, // Provide the content length
                                            ContentMD5: contentMD5 // Provide the calculated MD5 hash
                                        };
                                        return [4 /*yield*/, config_1.s3.upload(uploadParams).promise()];
                                    case 1:
                                        s3Response = _a.sent();
                                        console.log('File uploaded successfully. URL:', s3Response);
                                        return [2 /*return*/, s3Response];
                                }
                            });
                        }); })];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error transferring file to S3:', error_3);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_4 = _a.sent();
                    console.error('Error transferring file to S3:', error_4);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.transferFileToS3 = transferFileToS3;
function transferFileToS3Sync(url, key) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var response, contentLength_2, chunks_2, error_5;
                    var _this = this;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, (0, axios_1.default)({
                                        url: url,
                                        method: 'GET',
                                        responseType: 'stream'
                                    })];
                            case 1:
                                response = _a.sent();
                                contentLength_2 = 0;
                                response.data.on('data', function (chunk) {
                                    contentLength_2 += chunk.length;
                                });
                                chunks_2 = [];
                                response.data.on('data', function (chunk) {
                                    chunks_2.push(chunk);
                                });
                                // When the download is complete, concatenate the chunks into a single Buffer
                                response.data.on('end', function () { return __awaiter(_this, void 0, void 0, function () {
                                    var dataBuffer, contentMD5, filename, extension, uploadParams, s3Response, error_6;
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                _a.trys.push([0, 2, , 3]);
                                                dataBuffer = Buffer.concat(chunks_2);
                                                contentMD5 = crypto.createHash('md5').update(dataBuffer).digest('base64');
                                                filename = path.basename(url);
                                                extension = path.extname(filename);
                                                uploadParams = {
                                                    Bucket: config_1.config.aws.s3BucketName,
                                                    Key: key + extension, // Append the extension to the key
                                                    Body: dataBuffer,
                                                    ContentLength: dataBuffer.length, // Provide the content length
                                                    ContentMD5: contentMD5 // Provide the calculated MD5 hash
                                                };
                                                return [4 /*yield*/, config_1.s3.upload(uploadParams).promise()];
                                            case 1:
                                                s3Response = _a.sent();
                                                // console.log('File uploaded successfully. URL:', s3Response.Location);
                                                resolve(s3Response.Location); // Resolve with the S3 file URL
                                                return [3 /*break*/, 3];
                                            case 2:
                                                error_6 = _a.sent();
                                                console.error('Error uploading file to S3:', error_6);
                                                reject(error_6); // Reject with the error if uploading fails
                                                return [3 /*break*/, 3];
                                            case 3: return [2 /*return*/];
                                        }
                                    });
                                }); });
                                return [3 /*break*/, 3];
                            case 2:
                                error_5 = _a.sent();
                                console.error('Error downloading file:', error_5);
                                reject(error_5); // Reject with the error if downloading fails
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })];
        });
    });
}
exports.transferFileToS3Sync = transferFileToS3Sync;
