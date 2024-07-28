// Function to check if the message contains phone numbers, email addresses, contact addresses, or specific keywords
const containsRestrictedMessageContent = (message: string): { isRestricted: boolean, errorMessage?: string } => {
    // Enhanced regex for matching various phone number formats
    const phoneRegex = /\b(?:\+?(\d{1,3}))?[-.\s]?((\d{3})|(\(\d{3}\)))[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/; // Regex for email addresses
    const addressRegex = /\b\d{1,5}\s\w+(\s\w+){1,5}\b/; // Simple regex for street addresses (may need to be adjusted)

    // Keywords to check for
    const restrictedKeywords = ["phone", "email", "phone number"];

    // Check if message contains any restricted keywords (case-insensitive)
    const containsKeywords = restrictedKeywords.some(keyword => 
        message.toLowerCase().includes(keyword.toLowerCase())
    );

    if (phoneRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains a phone number' };
    } else if (emailRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains an email address' };
    } else if (addressRegex.test(message)) {
        return { isRestricted: true, errorMessage: 'Message contains a contact address' };
    } else if (containsKeywords) {
        return { isRestricted: true, errorMessage: 'Message contains restricted keywords (phone, email, phone number)' };
    }

    return { isRestricted: false };
};


export const ContentModeration = {
    containsRestrictedMessageContent
}