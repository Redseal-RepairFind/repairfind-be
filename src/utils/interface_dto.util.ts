// Define a generic function to cast payload to DTO based on an interface
export function castPayloadToDTO<T>(payload: any, dtoInterface: T): T {
    const dto: Partial<T> = {}; // Initialize DTO as partial to allow for optional properties
    
    // Recursive function to handle nested properties
    const assignNestedProperties = (source: any, target: any) => {
        Object.keys(source).forEach((key) => {
            if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                // If the property is an object, recursively assign its properties
                target[key] = {} as any; // Type assertion here
                assignNestedProperties(source[key], target[key]);
            } else {
                // Otherwise, assign the property directly
                target[key] = source[key];
            }
        });
    };

    // Assign properties from payload to DTO
    Object.keys(dtoInterface as Record<string, any>).forEach((key) => {
        if (payload.hasOwnProperty(key)) {
            if (typeof payload[key] === 'object' && payload[key] !== null && !Array.isArray(payload[key])) {
                // If the property is an object, recursively assign its properties
                dto[key as keyof T] = {} as any; // Type assertion here
                assignNestedProperties(payload[key], dto[key as keyof T]);
            } else {
                // Otherwise, assign the property directly
                dto[key as keyof T] = payload[key];
            }
        }
    });


    return dto as T; // Cast DTO to type T
}
