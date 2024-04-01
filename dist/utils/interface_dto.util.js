"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castPayloadToDTO = void 0;
// Define a generic function to cast payload to DTO based on an interface
function castPayloadToDTO(payload, dtoInterface) {
    var dto = {}; // Initialize DTO as partial to allow for optional properties
    // Extract keys from the DTO interface
    var dtoKeys = Object.keys(dtoInterface);
    // Iterate over the keys and assign corresponding payload properties to DTO
    dtoKeys.forEach(function (key) {
        if (payload.hasOwnProperty(key)) {
            dto[key] = payload[key];
        }
    });
    return dto; // Cast DTO to type T
}
exports.castPayloadToDTO = castPayloadToDTO;
