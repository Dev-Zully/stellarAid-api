/**
 * Shared, cross-cutting types.
 *
 * Keep this module dependency-free so every layer can import from it.
 */

/** Field-level detail produced when a request fails validation. */
export interface ApiErrorField {
  readonly path: string;
  readonly message: string;
  readonly code?: string;
}

/** Error payload carried by failed API responses. */
export interface ApiError {
  readonly code?: string;
  readonly message: string;
  readonly details?: unknown;
  /** Present on validation failures (`VALIDATION_ERROR`). */
  readonly fields?: readonly ApiErrorField[];
}

/** Standard JSON envelope used by API responses. */
export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiError;
}
