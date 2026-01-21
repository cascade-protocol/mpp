export class ValidationError extends Error {
    issues;
    constructor(message, issues) {
        super(message);
        this.name = 'ValidationError';
        this.issues = issues;
    }
}
/**
 * Unwraps a Standard Schema validation result.
 * Throws ValidationError if validation failed.
 */
export function unwrap(result, name) {
    if ('issues' in result && result.issues) {
        const messages = result.issues.map((i) => i.message).join(', ');
        const prefix = name ? `Invalid ${name}: ` : '';
        throw new ValidationError(`${prefix}${messages}`, result.issues);
    }
    return result.value;
}
//# sourceMappingURL=Schema.js.map