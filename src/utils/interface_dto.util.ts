// Define a generic function to cast payload to DTO based on an interface
export function castPayloadToDTO<T>(payload: any, dtoInterface: T): T {
    const dto: Partial<T> = {}; // Initialize DTO as partial to allow for optional properties
    
    // Extract keys from the DTO interface
    const dtoKeys = Object.keys(dtoInterface as Record<string, any>);

    // Iterate over the keys and assign corresponding payload properties to DTO
    dtoKeys.forEach((key) => {
        if (payload.hasOwnProperty(key)) {
            dto[key as keyof T] = payload[key];
        }
    });

    return dto as T; // Cast DTO to type T
}