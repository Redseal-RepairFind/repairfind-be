"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castPayloadToDTO = void 0;
// Define a generic function to cast payload to DTO based on an interface
function castPayloadToDTO(payload, dtoInterface) {
    var dto = {}; // Initialize DTO as partial to allow for optional properties
    // Recursive function to handle nested properties
    var assignNestedProperties = function (source, target) {
        Object.keys(source).forEach(function (key) {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                // If the property is an object, recursively assign its properties
                target[key] = {}; // Type assertion here
                assignNestedProperties(source[key], target[key]);
            }
            else {
                // Otherwise, assign the property directly
                target[key] = source[key];
            }
        });
    };
    // Assign properties from payload to DTO
    Object.keys(dtoInterface).forEach(function (key) {
        if (payload.hasOwnProperty(key)) {
            if (typeof payload[key] === 'object' && payload[key] !== null && !Array.isArray(payload[key])) {
                // If the property is an object, recursively assign its properties
                dto[key] = {}; // Type assertion here
                assignNestedProperties(payload[key], dto[key]);
            }
            else {
                // Otherwise, assign the property directly
                dto[key] = payload[key];
            }
        }
    });
    return dto; // Cast DTO to type T
}
exports.castPayloadToDTO = castPayloadToDTO;
