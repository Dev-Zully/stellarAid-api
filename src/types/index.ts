/**
 * Shared, cross-cutting types.
 *
 * Keep this module dependency-free so every layer can import from it.
 */

/** Error payload carried by failed API responses. */
export interface ApiError {
  readonly message: string;
}

/** Standard JSON envelope used by API responses. */
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
}
