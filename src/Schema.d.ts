import type { StandardSchemaV1 } from '@standard-schema/spec';
export type { StandardSchemaV1 as Schema } from '@standard-schema/spec';
export declare class ValidationError extends Error {
    readonly issues: ReadonlyArray<StandardSchemaV1.Issue>;
    constructor(message: string, issues: ReadonlyArray<StandardSchemaV1.Issue>);
}
/**
 * Unwraps a Standard Schema validation result.
 * Throws ValidationError if validation failed.
 */
export declare function unwrap<T>(result: StandardSchemaV1.Result<T>, name?: string): T;
//# sourceMappingURL=Schema.d.ts.map