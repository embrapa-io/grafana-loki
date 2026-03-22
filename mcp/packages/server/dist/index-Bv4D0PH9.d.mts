import * as z from "zod/v4";
import { Ajv } from "ajv";
import { JSONSchema } from "json-schema-typed";

//#region ../core/src/shared/auth.d.ts
/**
 * Reusable URL validation that disallows `javascript:` scheme
 */
declare const SafeUrlSchema: z.ZodURL;
/**
 * RFC 9728 OAuth Protected Resource Metadata
 */
declare const OAuthProtectedResourceMetadataSchema: z.ZodObject<{
  resource: z.ZodString;
  authorization_servers: z.ZodOptional<z.ZodArray<z.ZodURL>>;
  jwks_uri: z.ZodOptional<z.ZodString>;
  scopes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  bearer_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  resource_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  resource_name: z.ZodOptional<z.ZodString>;
  resource_documentation: z.ZodOptional<z.ZodString>;
  resource_policy_uri: z.ZodOptional<z.ZodString>;
  resource_tos_uri: z.ZodOptional<z.ZodString>;
  tls_client_certificate_bound_access_tokens: z.ZodOptional<z.ZodBoolean>;
  authorization_details_types_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  dpop_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  dpop_bound_access_tokens_required: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
/**
 * RFC 8414 OAuth 2.0 Authorization Server Metadata
 */
declare const OAuthMetadataSchema: z.ZodObject<{
  issuer: z.ZodString;
  authorization_endpoint: z.ZodURL;
  token_endpoint: z.ZodURL;
  registration_endpoint: z.ZodOptional<z.ZodURL>;
  scopes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  response_types_supported: z.ZodArray<z.ZodString>;
  response_modes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  token_endpoint_auth_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  service_documentation: z.ZodOptional<z.ZodURL>;
  revocation_endpoint: z.ZodOptional<z.ZodURL>;
  revocation_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  revocation_endpoint_auth_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  introspection_endpoint: z.ZodOptional<z.ZodString>;
  introspection_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  introspection_endpoint_auth_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  client_id_metadata_document_supported: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
/**
 * OpenID Connect Discovery 1.0 Provider Metadata
 *
 * @see https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
 */
declare const OpenIdProviderMetadataSchema: z.ZodObject<{
  issuer: z.ZodString;
  authorization_endpoint: z.ZodURL;
  token_endpoint: z.ZodURL;
  userinfo_endpoint: z.ZodOptional<z.ZodURL>;
  jwks_uri: z.ZodURL;
  registration_endpoint: z.ZodOptional<z.ZodURL>;
  scopes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  response_types_supported: z.ZodArray<z.ZodString>;
  response_modes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  acr_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  subject_types_supported: z.ZodArray<z.ZodString>;
  id_token_signing_alg_values_supported: z.ZodArray<z.ZodString>;
  id_token_encryption_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  id_token_encryption_enc_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  userinfo_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  userinfo_encryption_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  userinfo_encryption_enc_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  request_object_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  request_object_encryption_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  request_object_encryption_enc_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  token_endpoint_auth_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  display_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  claim_types_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  claims_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  service_documentation: z.ZodOptional<z.ZodString>;
  claims_locales_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  ui_locales_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  claims_parameter_supported: z.ZodOptional<z.ZodBoolean>;
  request_parameter_supported: z.ZodOptional<z.ZodBoolean>;
  request_uri_parameter_supported: z.ZodOptional<z.ZodBoolean>;
  require_request_uri_registration: z.ZodOptional<z.ZodBoolean>;
  op_policy_uri: z.ZodOptional<z.ZodURL>;
  op_tos_uri: z.ZodOptional<z.ZodURL>;
  client_id_metadata_document_supported: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
/**
 * OpenID Connect Discovery metadata that may include OAuth 2.0 fields
 * This schema represents the real-world scenario where OIDC providers
 * return a mix of OpenID Connect and OAuth 2.0 metadata fields
 */
declare const OpenIdProviderDiscoveryMetadataSchema: z.ZodObject<{
  code_challenge_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  issuer: z.ZodString;
  authorization_endpoint: z.ZodURL;
  token_endpoint: z.ZodURL;
  userinfo_endpoint: z.ZodOptional<z.ZodURL>;
  jwks_uri: z.ZodURL;
  registration_endpoint: z.ZodOptional<z.ZodURL>;
  scopes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  response_types_supported: z.ZodArray<z.ZodString>;
  response_modes_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  grant_types_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  acr_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  subject_types_supported: z.ZodArray<z.ZodString>;
  id_token_signing_alg_values_supported: z.ZodArray<z.ZodString>;
  id_token_encryption_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  id_token_encryption_enc_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  userinfo_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  userinfo_encryption_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  userinfo_encryption_enc_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  request_object_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  request_object_encryption_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  request_object_encryption_enc_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  token_endpoint_auth_methods_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  token_endpoint_auth_signing_alg_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  display_values_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  claim_types_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  claims_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  service_documentation: z.ZodOptional<z.ZodString>;
  claims_locales_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  ui_locales_supported: z.ZodOptional<z.ZodArray<z.ZodString>>;
  claims_parameter_supported: z.ZodOptional<z.ZodBoolean>;
  request_parameter_supported: z.ZodOptional<z.ZodBoolean>;
  request_uri_parameter_supported: z.ZodOptional<z.ZodBoolean>;
  require_request_uri_registration: z.ZodOptional<z.ZodBoolean>;
  op_policy_uri: z.ZodOptional<z.ZodURL>;
  op_tos_uri: z.ZodOptional<z.ZodURL>;
  client_id_metadata_document_supported: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * OAuth 2.1 token response
 */
declare const OAuthTokensSchema: z.ZodObject<{
  access_token: z.ZodString;
  id_token: z.ZodOptional<z.ZodString>;
  token_type: z.ZodString;
  expires_in: z.ZodOptional<z.ZodCoercedNumber<unknown>>;
  scope: z.ZodOptional<z.ZodString>;
  refresh_token: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * RFC 8693 §2.2.1 Token Exchange response for ID-JAG tokens.
 *
 * `token_type` is intentionally optional: per RFC 8693 §2.2.1 it is informational when
 * the issued token is not an access token, and per RFC 6749 §5.1 it is case-insensitive,
 * so strict checking rejects conformant IdPs.
 */
declare const IdJagTokenExchangeResponseSchema: z.ZodObject<{
  issued_token_type: z.ZodLiteral<"urn:ietf:params:oauth:token-type:id-jag">;
  access_token: z.ZodString;
  token_type: z.ZodOptional<z.ZodString>;
  expires_in: z.ZodOptional<z.ZodNumber>;
  scope: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type IdJagTokenExchangeResponse = z.infer<typeof IdJagTokenExchangeResponseSchema>;
/**
 * OAuth 2.1 error response
 */
declare const OAuthErrorResponseSchema: z.ZodObject<{
  error: z.ZodString;
  error_description: z.ZodOptional<z.ZodString>;
  error_uri: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Optional version of {@linkcode SafeUrlSchema} that allows empty string for backward compatibility on `tos_uri` and `logo_uri`
 */
declare const OptionalSafeUrlSchema: z.ZodUnion<[z.ZodOptional<z.ZodURL>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>;
/**
 * RFC 7591 OAuth 2.0 Dynamic Client Registration metadata
 */
declare const OAuthClientMetadataSchema: z.ZodObject<{
  redirect_uris: z.ZodArray<z.ZodURL>;
  token_endpoint_auth_method: z.ZodOptional<z.ZodString>;
  grant_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
  response_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
  client_name: z.ZodOptional<z.ZodString>;
  client_uri: z.ZodOptional<z.ZodURL>;
  logo_uri: z.ZodUnion<[z.ZodOptional<z.ZodURL>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>;
  scope: z.ZodOptional<z.ZodString>;
  contacts: z.ZodOptional<z.ZodArray<z.ZodString>>;
  tos_uri: z.ZodUnion<[z.ZodOptional<z.ZodURL>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>;
  policy_uri: z.ZodOptional<z.ZodString>;
  jwks_uri: z.ZodOptional<z.ZodURL>;
  jwks: z.ZodOptional<z.ZodAny>;
  software_id: z.ZodOptional<z.ZodString>;
  software_version: z.ZodOptional<z.ZodString>;
  software_statement: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * RFC 7591 OAuth 2.0 Dynamic Client Registration client information
 */
declare const OAuthClientInformationSchema: z.ZodObject<{
  client_id: z.ZodString;
  client_secret: z.ZodOptional<z.ZodString>;
  client_id_issued_at: z.ZodOptional<z.ZodNumber>;
  client_secret_expires_at: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * RFC 7591 OAuth 2.0 Dynamic Client Registration full response (client information plus metadata)
 */
declare const OAuthClientInformationFullSchema: z.ZodObject<{
  redirect_uris: z.ZodArray<z.ZodURL>;
  token_endpoint_auth_method: z.ZodOptional<z.ZodString>;
  grant_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
  response_types: z.ZodOptional<z.ZodArray<z.ZodString>>;
  client_name: z.ZodOptional<z.ZodString>;
  client_uri: z.ZodOptional<z.ZodURL>;
  logo_uri: z.ZodUnion<[z.ZodOptional<z.ZodURL>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>;
  scope: z.ZodOptional<z.ZodString>;
  contacts: z.ZodOptional<z.ZodArray<z.ZodString>>;
  tos_uri: z.ZodUnion<[z.ZodOptional<z.ZodURL>, z.ZodPipe<z.ZodLiteral<"">, z.ZodTransform<undefined, "">>]>;
  policy_uri: z.ZodOptional<z.ZodString>;
  jwks_uri: z.ZodOptional<z.ZodURL>;
  jwks: z.ZodOptional<z.ZodAny>;
  software_id: z.ZodOptional<z.ZodString>;
  software_version: z.ZodOptional<z.ZodString>;
  software_statement: z.ZodOptional<z.ZodString>;
  client_id: z.ZodString;
  client_secret: z.ZodOptional<z.ZodString>;
  client_id_issued_at: z.ZodOptional<z.ZodNumber>;
  client_secret_expires_at: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * RFC 7591 OAuth 2.0 Dynamic Client Registration error response
 */
declare const OAuthClientRegistrationErrorSchema: z.ZodObject<{
  error: z.ZodString;
  error_description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * RFC 7009 OAuth 2.0 Token Revocation request
 */
declare const OAuthTokenRevocationRequestSchema: z.ZodObject<{
  token: z.ZodString;
  token_type_hint: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
type OAuthMetadata = z.infer<typeof OAuthMetadataSchema>;
type OpenIdProviderMetadata = z.infer<typeof OpenIdProviderMetadataSchema>;
type OpenIdProviderDiscoveryMetadata = z.infer<typeof OpenIdProviderDiscoveryMetadataSchema>;
type OAuthTokens = z.infer<typeof OAuthTokensSchema>;
type OAuthErrorResponse = z.infer<typeof OAuthErrorResponseSchema>;
type OAuthClientMetadata = z.infer<typeof OAuthClientMetadataSchema>;
type OAuthClientInformation = z.infer<typeof OAuthClientInformationSchema>;
type OAuthClientInformationFull = z.infer<typeof OAuthClientInformationFullSchema>;
type OAuthClientInformationMixed = OAuthClientInformation | OAuthClientInformationFull;
type OAuthClientRegistrationError = z.infer<typeof OAuthClientRegistrationErrorSchema>;
type OAuthTokenRevocationRequest = z.infer<typeof OAuthTokenRevocationRequestSchema>;
type OAuthProtectedResourceMetadata = z.infer<typeof OAuthProtectedResourceMetadataSchema>;
type AuthorizationServerMetadata = OAuthMetadata | OpenIdProviderDiscoveryMetadata;
//#endregion
//#region ../core/src/auth/errors.d.ts
/**
 * OAuth error codes as defined by {@link https://datatracker.ietf.org/doc/html/rfc6749#section-5.2 | RFC 6749}
 * and extensions.
 */
declare enum OAuthErrorCode {
  /**
   * The request is missing a required parameter, includes an invalid parameter value,
   * includes a parameter more than once, or is otherwise malformed.
   */
  InvalidRequest = "invalid_request",
  /**
   * Client authentication failed (e.g., unknown client, no client authentication included,
   * or unsupported authentication method).
   */
  InvalidClient = "invalid_client",
  /**
   * The provided authorization grant or refresh token is invalid, expired, revoked,
   * does not match the redirection URI used in the authorization request, or was issued to another client.
   */
  InvalidGrant = "invalid_grant",
  /**
   * The authenticated client is not authorized to use this authorization grant type.
   */
  UnauthorizedClient = "unauthorized_client",
  /**
   * The authorization grant type is not supported by the authorization server.
   */
  UnsupportedGrantType = "unsupported_grant_type",
  /**
   * The requested scope is invalid, unknown, malformed, or exceeds the scope granted by the resource owner.
   */
  InvalidScope = "invalid_scope",
  /**
   * The resource owner or authorization server denied the request.
   */
  AccessDenied = "access_denied",
  /**
   * The authorization server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  ServerError = "server_error",
  /**
   * The authorization server is currently unable to handle the request due to temporary overloading or maintenance.
   */
  TemporarilyUnavailable = "temporarily_unavailable",
  /**
   * The authorization server does not support obtaining an authorization code using this method.
   */
  UnsupportedResponseType = "unsupported_response_type",
  /**
   * The authorization server does not support the requested token type.
   */
  UnsupportedTokenType = "unsupported_token_type",
  /**
   * The access token provided is expired, revoked, malformed, or invalid for other reasons.
   */
  InvalidToken = "invalid_token",
  /**
   * The HTTP method used is not allowed for this endpoint. (Custom, non-standard error)
   */
  MethodNotAllowed = "method_not_allowed",
  /**
   * Rate limit exceeded. (Custom, non-standard error based on RFC 6585)
   */
  TooManyRequests = "too_many_requests",
  /**
   * The client metadata is invalid. (Custom error for dynamic client registration - RFC 7591)
   */
  InvalidClientMetadata = "invalid_client_metadata",
  /**
   * The request requires higher privileges than provided by the access token.
   */
  InsufficientScope = "insufficient_scope",
  /**
   * The requested resource is invalid, missing, unknown, or malformed. (Custom error for resource indicators - RFC 8707)
   */
  InvalidTarget = "invalid_target",
}
/**
 * OAuth error class for all OAuth-related errors.
 */
declare class OAuthError extends Error {
  readonly code: OAuthErrorCode | string;
  readonly errorUri?: string | undefined;
  constructor(code: OAuthErrorCode | string, message: string, errorUri?: string | undefined);
  /**
   * Converts the error to a standard OAuth error response object.
   */
  toResponseObject(): OAuthErrorResponse;
  /**
   * Creates an {@linkcode OAuthError} from an OAuth error response.
   */
  static fromResponse(response: OAuthErrorResponse): OAuthError;
}
//#endregion
//#region ../core/src/errors/sdkErrors.d.ts
/**
 * Error codes for SDK errors (local errors that never cross the wire).
 * Unlike {@linkcode ProtocolErrorCode} which uses numeric JSON-RPC codes, `SdkErrorCode` uses
 * descriptive string values for better developer experience.
 *
 * These errors are thrown locally by the SDK and are never serialized as
 * JSON-RPC error responses.
 */
declare enum SdkErrorCode {
  /** Transport is not connected */
  NotConnected = "NOT_CONNECTED",
  /** Transport is already connected */
  AlreadyConnected = "ALREADY_CONNECTED",
  /** Protocol is not initialized */
  NotInitialized = "NOT_INITIALIZED",
  /** Required capability is not supported by the remote side */
  CapabilityNotSupported = "CAPABILITY_NOT_SUPPORTED",
  /** Request timed out waiting for response */
  RequestTimeout = "REQUEST_TIMEOUT",
  /** Connection was closed */
  ConnectionClosed = "CONNECTION_CLOSED",
  /** Failed to send message */
  SendFailed = "SEND_FAILED",
  ClientHttpNotImplemented = "CLIENT_HTTP_NOT_IMPLEMENTED",
  ClientHttpAuthentication = "CLIENT_HTTP_AUTHENTICATION",
  ClientHttpForbidden = "CLIENT_HTTP_FORBIDDEN",
  ClientHttpUnexpectedContent = "CLIENT_HTTP_UNEXPECTED_CONTENT",
  ClientHttpFailedToOpenStream = "CLIENT_HTTP_FAILED_TO_OPEN_STREAM",
  ClientHttpFailedToTerminateSession = "CLIENT_HTTP_FAILED_TO_TERMINATE_SESSION",
}
/**
 * SDK errors are local errors that never cross the wire.
 * They are distinct from {@linkcode ProtocolError} which represents JSON-RPC protocol errors
 * that are serialized and sent as error responses.
 *
 * @example
 * ```ts source="./sdkErrors.examples.ts#SdkError_basicUsage"
 * try {
 *     // Throwing an SDK error
 *     throw new SdkError(SdkErrorCode.NotConnected, 'Transport is not connected');
 * } catch (error) {
 *     // Checking error type by code
 *     if (error instanceof SdkError && error.code === SdkErrorCode.RequestTimeout) {
 *         // Handle timeout
 *     }
 * }
 * ```
 */
declare class SdkError extends Error {
  readonly code: SdkErrorCode;
  readonly data?: unknown | undefined;
  constructor(code: SdkErrorCode, message: string, data?: unknown | undefined);
}
//#endregion
//#region ../core/src/shared/authUtils.d.ts
/**
 * Utilities for handling OAuth resource URIs.
 */
/**
 * Converts a server URL to a resource URL by removing the fragment.
 * {@link https://datatracker.ietf.org/doc/html/rfc8707#section-2 | RFC 8707 section 2}
 * states that resource URIs "MUST NOT include a fragment component".
 * Keeps everything else unchanged (scheme, domain, port, path, query).
 */
declare function resourceUrlFromServerUrl(url: URL | string): URL;
/**
 * Checks if a requested resource URL matches a configured resource URL.
 * A requested resource matches if it has the same scheme, domain, port,
 * and its path starts with the configured resource's path.
 *
 * @param options - The options object
 * @param options.requestedResource - The resource URL being requested
 * @param options.configuredResource - The resource URL that has been configured
 * @returns true if the requested resource matches the configured resource, false otherwise
 */
declare function checkResourceAllowed({
  requestedResource,
  configuredResource
}: {
  requestedResource: URL | string;
  configuredResource: URL | string;
}): boolean;
//#endregion
//#region ../core/src/types/types.d.ts
declare const LATEST_PROTOCOL_VERSION = "2025-11-25";
declare const DEFAULT_NEGOTIATED_PROTOCOL_VERSION = "2025-03-26";
declare const SUPPORTED_PROTOCOL_VERSIONS: string[];
declare const RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task";
type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
type JSONObject = {
  [key: string]: JSONValue;
};
type JSONArray = JSONValue[];
declare const JSONValueSchema: z.ZodType<JSONValue>;
declare const JSONObjectSchema: z.ZodType<JSONObject>;
declare const JSONArraySchema: z.ZodType<JSONArray>;
declare const JSONRPC_VERSION = "2.0";
/**
 * Information about a validated access token, provided to request handlers.
 */
interface AuthInfo {
  /**
   * The access token.
   */
  token: string;
  /**
   * The client ID associated with this token.
   */
  clientId: string;
  /**
   * Scopes associated with this token.
   */
  scopes: string[];
  /**
   * When the token expires (in seconds since epoch).
   */
  expiresAt?: number;
  /**
   * The RFC 8707 resource server identifier for which this token is valid.
   * If set, this MUST match the MCP server's resource identifier (minus hash fragment).
   */
  resource?: URL;
  /**
   * Additional data associated with the token.
   * This field should be used for any additional data that needs to be attached to the auth info.
   */
  extra?: Record<string, unknown>;
}
/**
 * Utility types
 */
type ExpandRecursively<T$1> = T$1 extends object ? (T$1 extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never) : T$1;
/**
 * A progress token, used to associate progress notifications with the original request.
 */
declare const ProgressTokenSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
/**
 * An opaque token used to represent a cursor for pagination.
 */
declare const CursorSchema: z.ZodString;
/**
 * Task creation parameters, used to ask that the server create a task to represent a request.
 */
declare const TaskCreationParamsSchema: z.ZodObject<{
  /**
   * Time in milliseconds to keep task results available after completion.
   * If `null`, the task has unlimited lifetime until manually cleaned up.
   */
  ttl: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>>;
  /**
   * Time in milliseconds to wait between task status requests.
   */
  pollInterval: z.ZodOptional<z.ZodNumber>;
}, z.core.$loose>;
declare const TaskMetadataSchema: z.ZodObject<{
  ttl: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Metadata for associating messages with a task.
 * Include this in the `_meta` field under the key `io.modelcontextprotocol/related-task`.
 */
declare const RelatedTaskMetadataSchema: z.ZodObject<{
  taskId: z.ZodString;
}, z.core.$strip>;
declare const RequestMetaSchema: z.ZodObject<{
  /**
   * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
   */
  progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
  /**
   * If specified, this request is related to the provided task.
   */
  "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
    taskId: z.ZodString;
  }, z.core.$strip>>;
}, z.core.$loose>;
/**
 * Common params for any request.
 */
declare const BaseRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
}, z.core.$strip>;
/**
 * Common params for any task-augmented request.
 */
declare const TaskAugmentedRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodOptional<z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Checks if a value is a valid {@linkcode TaskAugmentedRequestParams}.
 * @param value - The value to check.
 *
 * @returns True if the value is a valid {@linkcode TaskAugmentedRequestParams}, false otherwise.
 */
declare const isTaskAugmentedRequestParams: (value: unknown) => value is TaskAugmentedRequestParams;
declare const RequestSchema: z.ZodObject<{
  method: z.ZodString;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
}, z.core.$strip>;
declare const NotificationsParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
}, z.core.$strip>;
declare const NotificationSchema: z.ZodObject<{
  method: z.ZodString;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
}, z.core.$strip>;
declare const ResultSchema: z.ZodObject<{
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on `_meta` usage.
   */
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * A uniquely identifying ID for a request in JSON-RPC.
 */
declare const RequestIdSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
/**
 * A request that expects a response.
 */
declare const JSONRPCRequestSchema: z.ZodObject<{
  method: z.ZodString;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
  jsonrpc: z.ZodLiteral<"2.0">;
  id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
}, z.core.$strict>;
declare const isJSONRPCRequest: (value: unknown) => value is JSONRPCRequest;
/**
 * A notification which does not expect a response.
 */
declare const JSONRPCNotificationSchema: z.ZodObject<{
  method: z.ZodString;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
  jsonrpc: z.ZodLiteral<"2.0">;
}, z.core.$strict>;
declare const isJSONRPCNotification: (value: unknown) => value is JSONRPCNotification;
/**
 * A successful (non-error) response to a request.
 */
declare const JSONRPCResultResponseSchema: z.ZodObject<{
  jsonrpc: z.ZodLiteral<"2.0">;
  id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
  result: z.ZodObject<{
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on `_meta` usage.
     */
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>;
}, z.core.$strict>;
/**
 * Checks if a value is a valid {@linkcode JSONRPCResultResponse}.
 * @param value - The value to check.
 *
 * @returns True if the value is a valid {@linkcode JSONRPCResultResponse}, false otherwise.
 */
declare const isJSONRPCResultResponse: (value: unknown) => value is JSONRPCResultResponse;
/**
 * Error codes for protocol errors that cross the wire as JSON-RPC error responses.
 * These follow the JSON-RPC specification and MCP-specific extensions.
 */
declare enum ProtocolErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ResourceNotFound = -32002,
  UrlElicitationRequired = -32042,
}
declare const PARSE_ERROR = -32700;
declare const INVALID_REQUEST = -32600;
declare const METHOD_NOT_FOUND = -32601;
declare const INVALID_PARAMS = -32602;
declare const INTERNAL_ERROR = -32603;
type JSONRPCErrorObject = {
  code: number;
  message: string;
  data?: unknown;
};
interface ParseError extends JSONRPCErrorObject {
  code: typeof PARSE_ERROR;
}
interface InvalidRequestError extends JSONRPCErrorObject {
  code: typeof INVALID_REQUEST;
}
interface MethodNotFoundError extends JSONRPCErrorObject {
  code: typeof METHOD_NOT_FOUND;
}
interface InvalidParamsError extends JSONRPCErrorObject {
  code: typeof INVALID_PARAMS;
}
interface InternalError extends JSONRPCErrorObject {
  code: typeof INTERNAL_ERROR;
}
/**
 * A response to a request that indicates an error occurred.
 */
declare const JSONRPCErrorResponseSchema: z.ZodObject<{
  jsonrpc: z.ZodLiteral<"2.0">;
  id: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
  error: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodUnknown>;
  }, z.core.$strip>;
}, z.core.$strict>;
/**
 * Checks if a value is a valid {@linkcode JSONRPCErrorResponse}.
 * @param value - The value to check.
 *
 * @returns True if the value is a valid {@linkcode JSONRPCErrorResponse}, false otherwise.
 */
declare const isJSONRPCErrorResponse: (value: unknown) => value is JSONRPCErrorResponse;
declare const JSONRPCMessageSchema: z.ZodUnion<readonly [z.ZodObject<{
  method: z.ZodString;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
  jsonrpc: z.ZodLiteral<"2.0">;
  id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
}, z.core.$strict>, z.ZodObject<{
  method: z.ZodString;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
  jsonrpc: z.ZodLiteral<"2.0">;
}, z.core.$strict>, z.ZodObject<{
  jsonrpc: z.ZodLiteral<"2.0">;
  id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
  result: z.ZodObject<{
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on `_meta` usage.
     */
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>;
}, z.core.$strict>, z.ZodObject<{
  jsonrpc: z.ZodLiteral<"2.0">;
  id: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
  error: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodUnknown>;
  }, z.core.$strip>;
}, z.core.$strict>]>;
declare const JSONRPCResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
  jsonrpc: z.ZodLiteral<"2.0">;
  id: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
  result: z.ZodObject<{
    /**
     * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
     * for notes on `_meta` usage.
     */
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$loose>;
}, z.core.$strict>, z.ZodObject<{
  jsonrpc: z.ZodLiteral<"2.0">;
  id: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
  error: z.ZodObject<{
    code: z.ZodNumber;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodUnknown>;
  }, z.core.$strip>;
}, z.core.$strict>]>;
/**
 * A response that indicates success but carries no data.
 */
declare const EmptyResultSchema: z.ZodObject<{
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on `_meta` usage.
   */
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
}, z.core.$strict>;
declare const CancelledNotificationParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  requestId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
  reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * This notification can be sent by either side to indicate that it is cancelling a previously-issued request.
 *
 * The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.
 *
 * This notification indicates that the result will be unused, so any associated processing SHOULD cease.
 *
 * A client MUST NOT attempt to cancel its {@linkcode InitializeRequest | initialize} request.
 */
declare const CancelledNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/cancelled">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    requestId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    reason: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Icon schema for use in {@link Tool | tools}, {@link Prompt | prompts}, {@link Resource | resources}, and {@link Implementation | implementations}.
 */
declare const IconSchema: z.ZodObject<{
  src: z.ZodString;
  mimeType: z.ZodOptional<z.ZodString>;
  sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
  theme: z.ZodOptional<z.ZodEnum<{
    light: "light";
    dark: "dark";
  }>>;
}, z.core.$strip>;
/**
 * Base schema to add `icons` property.
 *
 */
declare const IconsSchema: z.ZodObject<{
  icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
    src: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    theme: z.ZodOptional<z.ZodEnum<{
      light: "light";
      dark: "dark";
    }>>;
  }, z.core.$strip>>>;
}, z.core.$strip>;
/**
 * Base metadata interface for common properties across {@link Resource | resources}, {@link Tool | tools}, {@link Prompt | prompts}, and {@link Implementation | implementations}.
 */
declare const BaseMetadataSchema: z.ZodObject<{
  name: z.ZodString;
  title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Describes the name and version of an MCP implementation.
 */
declare const ImplementationSchema: z.ZodObject<{
  version: z.ZodString;
  websiteUrl: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
    src: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    theme: z.ZodOptional<z.ZodEnum<{
      light: "light";
      dark: "dark";
    }>>;
  }, z.core.$strip>>>;
  name: z.ZodString;
  title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Task capabilities for clients, indicating which request types support task creation.
 */
declare const ClientTasksCapabilitySchema: z.ZodObject<{
  /**
   * Present if the client supports listing tasks.
   */
  list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  /**
   * Present if the client supports cancelling tasks.
   */
  cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  /**
   * Capabilities for task creation on specific request types.
   */
  requests: z.ZodOptional<z.ZodObject<{
    /**
     * Task support for sampling requests.
     */
    sampling: z.ZodOptional<z.ZodObject<{
      createMessage: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    }, z.core.$loose>>;
    /**
     * Task support for elicitation requests.
     */
    elicitation: z.ZodOptional<z.ZodObject<{
      create: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * Task capabilities for servers, indicating which request types support task creation.
 */
declare const ServerTasksCapabilitySchema: z.ZodObject<{
  /**
   * Present if the server supports listing tasks.
   */
  list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  /**
   * Present if the server supports cancelling tasks.
   */
  cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  /**
   * Capabilities for task creation on specific request types.
   */
  requests: z.ZodOptional<z.ZodObject<{
    /**
     * Task support for tool requests.
     */
    tools: z.ZodOptional<z.ZodObject<{
      call: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
 */
declare const ClientCapabilitiesSchema: z.ZodObject<{
  experimental: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
  sampling: z.ZodOptional<z.ZodObject<{
    context: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    tools: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  }, z.core.$strip>>;
  elicitation: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodIntersection<z.ZodObject<{
    form: z.ZodOptional<z.ZodIntersection<z.ZodObject<{
      applyDefaults: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
    url: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  }, z.core.$strip>, z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>>>;
  roots: z.ZodOptional<z.ZodObject<{
    listChanged: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strip>>;
  tasks: z.ZodOptional<z.ZodObject<{
    /**
     * Present if the client supports listing tasks.
     */
    list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    /**
     * Present if the client supports cancelling tasks.
     */
    cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    /**
     * Capabilities for task creation on specific request types.
     */
    requests: z.ZodOptional<z.ZodObject<{
      /**
       * Task support for sampling requests.
       */
      sampling: z.ZodOptional<z.ZodObject<{
        createMessage: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      }, z.core.$loose>>;
      /**
       * Task support for elicitation requests.
       */
      elicitation: z.ZodOptional<z.ZodObject<{
        create: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      }, z.core.$loose>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
}, z.core.$strip>;
declare const InitializeRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  protocolVersion: z.ZodString;
  capabilities: z.ZodObject<{
    experimental: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
    sampling: z.ZodOptional<z.ZodObject<{
      context: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      tools: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    }, z.core.$strip>>;
    elicitation: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodIntersection<z.ZodObject<{
      form: z.ZodOptional<z.ZodIntersection<z.ZodObject<{
        applyDefaults: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
      url: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    }, z.core.$strip>, z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>>>;
    roots: z.ZodOptional<z.ZodObject<{
      listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    tasks: z.ZodOptional<z.ZodObject<{
      /**
       * Present if the client supports listing tasks.
       */
      list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      /**
       * Present if the client supports cancelling tasks.
       */
      cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      /**
       * Capabilities for task creation on specific request types.
       */
      requests: z.ZodOptional<z.ZodObject<{
        /**
         * Task support for sampling requests.
         */
        sampling: z.ZodOptional<z.ZodObject<{
          createMessage: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        }, z.core.$loose>>;
        /**
         * Task support for elicitation requests.
         */
        elicitation: z.ZodOptional<z.ZodObject<{
          create: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        }, z.core.$loose>>;
      }, z.core.$loose>>;
    }, z.core.$loose>>;
  }, z.core.$strip>;
  clientInfo: z.ZodObject<{
    version: z.ZodString;
    websiteUrl: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * This request is sent from the client to the server when it first connects, asking it to begin initialization.
 */
declare const InitializeRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"initialize">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<{
      experimental: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
      sampling: z.ZodOptional<z.ZodObject<{
        context: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        tools: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      }, z.core.$strip>>;
      elicitation: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodIntersection<z.ZodObject<{
        form: z.ZodOptional<z.ZodIntersection<z.ZodObject<{
          applyDefaults: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
        url: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      }, z.core.$strip>, z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>>>;
      roots: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>>;
      tasks: z.ZodOptional<z.ZodObject<{
        /**
         * Present if the client supports listing tasks.
         */
        list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        /**
         * Present if the client supports cancelling tasks.
         */
        cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        /**
         * Capabilities for task creation on specific request types.
         */
        requests: z.ZodOptional<z.ZodObject<{
          /**
           * Task support for sampling requests.
           */
          sampling: z.ZodOptional<z.ZodObject<{
            createMessage: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
          }, z.core.$loose>>;
          /**
           * Task support for elicitation requests.
           */
          elicitation: z.ZodOptional<z.ZodObject<{
            create: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
          }, z.core.$loose>>;
        }, z.core.$loose>>;
      }, z.core.$loose>>;
    }, z.core.$strip>;
    clientInfo: z.ZodObject<{
      version: z.ZodString;
      websiteUrl: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
  }, z.core.$strip>;
}, z.core.$strip>;
declare const isInitializeRequest: (value: unknown) => value is InitializeRequest;
/**
 * Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
 */
declare const ServerCapabilitiesSchema: z.ZodObject<{
  experimental: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
  logging: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  completions: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  prompts: z.ZodOptional<z.ZodObject<{
    listChanged: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strip>>;
  resources: z.ZodOptional<z.ZodObject<{
    subscribe: z.ZodOptional<z.ZodBoolean>;
    listChanged: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strip>>;
  tools: z.ZodOptional<z.ZodObject<{
    listChanged: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strip>>;
  tasks: z.ZodOptional<z.ZodObject<{
    /**
     * Present if the server supports listing tasks.
     */
    list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    /**
     * Present if the server supports cancelling tasks.
     */
    cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    /**
     * Capabilities for task creation on specific request types.
     */
    requests: z.ZodOptional<z.ZodObject<{
      /**
       * Task support for tool requests.
       */
      tools: z.ZodOptional<z.ZodObject<{
        call: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      }, z.core.$loose>>;
    }, z.core.$loose>>;
  }, z.core.$loose>>;
}, z.core.$strip>;
/**
 * After receiving an initialize request from the client, the server sends this response.
 */
declare const InitializeResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  protocolVersion: z.ZodString;
  capabilities: z.ZodObject<{
    experimental: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
    logging: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    completions: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    prompts: z.ZodOptional<z.ZodObject<{
      listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    resources: z.ZodOptional<z.ZodObject<{
      subscribe: z.ZodOptional<z.ZodBoolean>;
      listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    tools: z.ZodOptional<z.ZodObject<{
      listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    tasks: z.ZodOptional<z.ZodObject<{
      /**
       * Present if the server supports listing tasks.
       */
      list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      /**
       * Present if the server supports cancelling tasks.
       */
      cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      /**
       * Capabilities for task creation on specific request types.
       */
      requests: z.ZodOptional<z.ZodObject<{
        /**
         * Task support for tool requests.
         */
        tools: z.ZodOptional<z.ZodObject<{
          call: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        }, z.core.$loose>>;
      }, z.core.$loose>>;
    }, z.core.$loose>>;
  }, z.core.$strip>;
  serverInfo: z.ZodObject<{
    version: z.ZodString;
    websiteUrl: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
  instructions: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
/**
 * This notification is sent from the client to the server after initialization has finished.
 */
declare const InitializedNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/initialized">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const isInitializedNotification: (value: unknown) => value is InitializedNotification;
/**
 * A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.
 */
declare const PingRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"ping">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const ProgressSchema: z.ZodObject<{
  progress: z.ZodNumber;
  total: z.ZodOptional<z.ZodNumber>;
  message: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ProgressNotificationParamsSchema: z.ZodObject<{
  progressToken: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
  progress: z.ZodNumber;
  total: z.ZodOptional<z.ZodNumber>;
  message: z.ZodOptional<z.ZodString>;
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
}, z.core.$strip>;
/**
 * An out-of-band notification used to inform the receiver of a progress update for a long-running request.
 *
 * @category notifications/progress
 */
declare const ProgressNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/progress">;
  params: z.ZodObject<{
    progressToken: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    progress: z.ZodNumber;
    total: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>;
}, z.core.$strip>;
declare const PaginatedRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  cursor: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const PaginatedRequestSchema: z.ZodObject<{
  method: z.ZodString;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const PaginatedResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
/**
 * The status of a task.
 * */
declare const TaskStatusSchema: z.ZodEnum<{
  working: "working";
  input_required: "input_required";
  completed: "completed";
  failed: "failed";
  cancelled: "cancelled";
}>;
/**
 * A pollable state object associated with a request.
 */
declare const TaskSchema: z.ZodObject<{
  taskId: z.ZodString;
  status: z.ZodEnum<{
    working: "working";
    input_required: "input_required";
    completed: "completed";
    failed: "failed";
    cancelled: "cancelled";
  }>;
  ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
  createdAt: z.ZodString;
  lastUpdatedAt: z.ZodString;
  pollInterval: z.ZodOptional<z.ZodNumber>;
  statusMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Result returned when a task is created, containing the task data wrapped in a `task` field.
 */
declare const CreateTaskResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$loose>;
/**
 * Parameters for task status notification.
 */
declare const TaskStatusNotificationParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  taskId: z.ZodString;
  status: z.ZodEnum<{
    working: "working";
    input_required: "input_required";
    completed: "completed";
    failed: "failed";
    cancelled: "cancelled";
  }>;
  ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
  createdAt: z.ZodString;
  lastUpdatedAt: z.ZodString;
  pollInterval: z.ZodOptional<z.ZodNumber>;
  statusMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * A notification sent when a task's status changes.
 */
declare const TaskStatusNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/tasks/status">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * A request to get the state of a specific task.
 */
declare const GetTaskRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"tasks/get">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * The response to a {@linkcode GetTaskRequest | tasks/get} request.
 */
declare const GetTaskResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  taskId: z.ZodString;
  status: z.ZodEnum<{
    working: "working";
    input_required: "input_required";
    completed: "completed";
    failed: "failed";
    cancelled: "cancelled";
  }>;
  ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
  createdAt: z.ZodString;
  lastUpdatedAt: z.ZodString;
  pollInterval: z.ZodOptional<z.ZodNumber>;
  statusMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * A request to get the result of a specific task.
 */
declare const GetTaskPayloadRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"tasks/result">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * The response to a {@linkcode GetTaskPayloadRequest | tasks/result} request.
 * The structure matches the result type of the original request.
 * For example, a {@linkcode CallToolRequest | tools/call} task would return the {@linkcode CallToolResult} structure.
 *
 */
declare const GetTaskPayloadResultSchema: z.ZodObject<{
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on `_meta` usage.
   */
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
}, z.core.$loose>;
/**
 * A request to list tasks.
 */
declare const ListTasksRequestSchema: z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"tasks/list">;
}, z.core.$strip>;
/**
 * The response to a {@linkcode ListTasksRequest | tasks/list} request.
 */
declare const ListTasksResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  tasks: z.ZodArray<z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>;
/**
 * A request to cancel a specific task.
 */
declare const CancelTaskRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"tasks/cancel">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * The response to a {@linkcode CancelTaskRequest | tasks/cancel} request.
 */
declare const CancelTaskResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  taskId: z.ZodString;
  status: z.ZodEnum<{
    working: "working";
    input_required: "input_required";
    completed: "completed";
    failed: "failed";
    cancelled: "cancelled";
  }>;
  ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
  createdAt: z.ZodString;
  lastUpdatedAt: z.ZodString;
  pollInterval: z.ZodOptional<z.ZodNumber>;
  statusMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * The contents of a specific resource or sub-resource.
 */
declare const ResourceContentsSchema: z.ZodObject<{
  uri: z.ZodString;
  mimeType: z.ZodOptional<z.ZodString>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
declare const TextResourceContentsSchema: z.ZodObject<{
  uri: z.ZodString;
  mimeType: z.ZodOptional<z.ZodString>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  text: z.ZodString;
}, z.core.$strip>;
declare const BlobResourceContentsSchema: z.ZodObject<{
  uri: z.ZodString;
  mimeType: z.ZodOptional<z.ZodString>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  blob: z.ZodString;
}, z.core.$strip>;
/**
 * The sender or recipient of messages and data in a conversation.
 */
declare const RoleSchema: z.ZodEnum<{
  user: "user";
  assistant: "assistant";
}>;
/**
 * Optional annotations providing clients additional context about a resource.
 */
declare const AnnotationsSchema: z.ZodObject<{
  audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
    user: "user";
    assistant: "assistant";
  }>>>;
  priority: z.ZodOptional<z.ZodNumber>;
  lastModified: z.ZodOptional<z.ZodISODateTime>;
}, z.core.$strip>;
/**
 * A known resource that the server is capable of reading.
 */
declare const ResourceSchema: z.ZodObject<{
  uri: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  mimeType: z.ZodOptional<z.ZodString>;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
  icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
    src: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    theme: z.ZodOptional<z.ZodEnum<{
      light: "light";
      dark: "dark";
    }>>;
  }, z.core.$strip>>>;
  name: z.ZodString;
  title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * A template description for resources available on the server.
 */
declare const ResourceTemplateSchema: z.ZodObject<{
  uriTemplate: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  mimeType: z.ZodOptional<z.ZodString>;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
  icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
    src: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    theme: z.ZodOptional<z.ZodEnum<{
      light: "light";
      dark: "dark";
    }>>;
  }, z.core.$strip>>>;
  name: z.ZodString;
  title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Sent from the client to request a list of resources the server has.
 */
declare const ListResourcesRequestSchema: z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"resources/list">;
}, z.core.$strip>;
/**
 * The server's response to a {@linkcode ListResourcesRequest | resources/list} request from the client.
 */
declare const ListResourcesResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  resources: z.ZodArray<z.ZodObject<{
    uri: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>;
/**
 * Sent from the client to request a list of resource templates the server has.
 */
declare const ListResourceTemplatesRequestSchema: z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"resources/templates/list">;
}, z.core.$strip>;
/**
 * The server's response to a {@linkcode ListResourceTemplatesRequest | resources/templates/list} request from the client.
 */
declare const ListResourceTemplatesResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  resourceTemplates: z.ZodArray<z.ZodObject<{
    uriTemplate: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>;
declare const ResourceRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  uri: z.ZodString;
}, z.core.$strip>;
/**
 * Parameters for a {@linkcode ReadResourceRequest | resources/read} request.
 */
declare const ReadResourceRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  uri: z.ZodString;
}, z.core.$strip>;
/**
 * Sent from the client to the server, to read a specific resource URI.
 */
declare const ReadResourceRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"resources/read">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    uri: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * The server's response to a {@linkcode ReadResourceRequest | resources/read} request from the client.
 */
declare const ReadResourceResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  contents: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    text: z.ZodString;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    blob: z.ZodString;
  }, z.core.$strip>]>>;
}, z.core.$loose>;
/**
 * An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.
 */
declare const ResourceListChangedNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/resources/list_changed">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const SubscribeRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  uri: z.ZodString;
}, z.core.$strip>;
/**
 * Sent from the client to request `resources/updated` notifications from the server whenever a particular resource changes.
 */
declare const SubscribeRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"resources/subscribe">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    uri: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
declare const UnsubscribeRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  uri: z.ZodString;
}, z.core.$strip>;
/**
 * Sent from the client to request cancellation of {@linkcode ResourceUpdatedNotification | resources/updated} notifications from the server. This should follow a previous {@linkcode SubscribeRequest | resources/subscribe} request.
 */
declare const UnsubscribeRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"resources/unsubscribe">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    uri: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Parameters for a {@linkcode ResourceUpdatedNotification | notifications/resources/updated} notification.
 */
declare const ResourceUpdatedNotificationParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  uri: z.ZodString;
}, z.core.$strip>;
/**
 * A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a {@linkcode SubscribeRequest | resources/subscribe} request.
 */
declare const ResourceUpdatedNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/resources/updated">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    uri: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Describes an argument that a prompt can accept.
 */
declare const PromptArgumentSchema: z.ZodObject<{
  name: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  required: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * A prompt or prompt template that the server offers.
 */
declare const PromptSchema: z.ZodObject<{
  description: z.ZodOptional<z.ZodString>;
  arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    required: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strip>>>;
  _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
  icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
    src: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    theme: z.ZodOptional<z.ZodEnum<{
      light: "light";
      dark: "dark";
    }>>;
  }, z.core.$strip>>>;
  name: z.ZodString;
  title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Sent from the client to request a list of prompts and prompt templates the server has.
 */
declare const ListPromptsRequestSchema: z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"prompts/list">;
}, z.core.$strip>;
/**
 * The server's response to a {@linkcode ListPromptsRequest | prompts/list} request from the client.
 */
declare const ListPromptsResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  prompts: z.ZodArray<z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      required: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>;
/**
 * Parameters for a {@linkcode GetPromptRequest | prompts/get} request.
 */
declare const GetPromptRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  name: z.ZodString;
  arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
/**
 * Used by the client to get a prompt provided by the server.
 */
declare const GetPromptRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"prompts/get">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    name: z.ZodString;
    arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Text provided to or from an LLM.
 */
declare const TextContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"text">;
  text: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * An image provided to or from an LLM.
 */
declare const ImageContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"image">;
  data: z.ZodString;
  mimeType: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Audio content provided to or from an LLM.
 */
declare const AudioContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"audio">;
  data: z.ZodString;
  mimeType: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * A tool call request from an assistant (LLM).
 * Represents the assistant's request to use a tool.
 */
declare const ToolUseContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"tool_use">;
  name: z.ZodString;
  id: z.ZodString;
  input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * The contents of a resource, embedded into a prompt or tool call result.
 */
declare const EmbeddedResourceSchema: z.ZodObject<{
  type: z.ZodLiteral<"resource">;
  resource: z.ZodUnion<readonly [z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    text: z.ZodString;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    blob: z.ZodString;
  }, z.core.$strip>]>;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * A resource that the server is capable of reading, included in a prompt or tool call result.
 *
 * Note: resource links returned by tools are not guaranteed to appear in the results of {@linkcode ListResourcesRequest | resources/list} requests.
 */
declare const ResourceLinkSchema: z.ZodObject<{
  uri: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  mimeType: z.ZodOptional<z.ZodString>;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
  icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
    src: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    theme: z.ZodOptional<z.ZodEnum<{
      light: "light";
      dark: "dark";
    }>>;
  }, z.core.$strip>>>;
  name: z.ZodString;
  title: z.ZodOptional<z.ZodString>;
  type: z.ZodLiteral<"resource_link">;
}, z.core.$strip>;
/**
 * A content block that can be used in prompts and tool results.
 */
declare const ContentBlockSchema: z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"text">;
  text: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"image">;
  data: z.ZodString;
  mimeType: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"audio">;
  data: z.ZodString;
  mimeType: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  uri: z.ZodString;
  description: z.ZodOptional<z.ZodString>;
  mimeType: z.ZodOptional<z.ZodString>;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
  icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
    src: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    theme: z.ZodOptional<z.ZodEnum<{
      light: "light";
      dark: "dark";
    }>>;
  }, z.core.$strip>>>;
  name: z.ZodString;
  title: z.ZodOptional<z.ZodString>;
  type: z.ZodLiteral<"resource_link">;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"resource">;
  resource: z.ZodUnion<readonly [z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    text: z.ZodString;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    blob: z.ZodString;
  }, z.core.$strip>]>;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>]>;
/**
 * Describes a message returned as part of a prompt.
 */
declare const PromptMessageSchema: z.ZodObject<{
  role: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
  }>;
  content: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"resource_link">;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<readonly [z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      blob: z.ZodString;
    }, z.core.$strip>]>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>]>;
}, z.core.$strip>;
/**
 * The server's response to a {@linkcode GetPromptRequest | prompts/get} request from the client.
 */
declare const GetPromptResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  description: z.ZodOptional<z.ZodString>;
  messages: z.ZodArray<z.ZodObject<{
    role: z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>;
    content: z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      mimeType: z.ZodOptional<z.ZodString>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"resource">;
      resource: z.ZodUnion<readonly [z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        text: z.ZodString;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        blob: z.ZodString;
      }, z.core.$strip>]>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>]>;
  }, z.core.$strip>>;
}, z.core.$loose>;
/**
 * An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.
 */
declare const PromptListChangedNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/prompts/list_changed">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Additional properties describing a {@linkcode Tool} to clients.
 *
 * NOTE: all properties in {@linkcode ToolAnnotations} are **hints**.
 * They are not guaranteed to provide a faithful description of
 * tool behavior (including descriptive properties like `title`).
 *
 * Clients should never make tool use decisions based on {@linkcode ToolAnnotations}
 * received from untrusted servers.
 */
declare const ToolAnnotationsSchema: z.ZodObject<{
  title: z.ZodOptional<z.ZodString>;
  readOnlyHint: z.ZodOptional<z.ZodBoolean>;
  destructiveHint: z.ZodOptional<z.ZodBoolean>;
  idempotentHint: z.ZodOptional<z.ZodBoolean>;
  openWorldHint: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Execution-related properties for a tool.
 */
declare const ToolExecutionSchema: z.ZodObject<{
  taskSupport: z.ZodOptional<z.ZodEnum<{
    optional: "optional";
    required: "required";
    forbidden: "forbidden";
  }>>;
}, z.core.$strip>;
/**
 * Definition for a tool the client can call.
 */
declare const ToolSchema: z.ZodObject<{
  description: z.ZodOptional<z.ZodString>;
  inputSchema: z.ZodObject<{
    type: z.ZodLiteral<"object">;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
    required: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$catchall<z.ZodUnknown>>;
  outputSchema: z.ZodOptional<z.ZodObject<{
    type: z.ZodLiteral<"object">;
    properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
    required: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$catchall<z.ZodUnknown>>>;
  annotations: z.ZodOptional<z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    readOnlyHint: z.ZodOptional<z.ZodBoolean>;
    destructiveHint: z.ZodOptional<z.ZodBoolean>;
    idempotentHint: z.ZodOptional<z.ZodBoolean>;
    openWorldHint: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strip>>;
  execution: z.ZodOptional<z.ZodObject<{
    taskSupport: z.ZodOptional<z.ZodEnum<{
      optional: "optional";
      required: "required";
      forbidden: "forbidden";
    }>>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
    src: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
    theme: z.ZodOptional<z.ZodEnum<{
      light: "light";
      dark: "dark";
    }>>;
  }, z.core.$strip>>>;
  name: z.ZodString;
  title: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Sent from the client to request a list of tools the server has.
 */
declare const ListToolsRequestSchema: z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"tools/list">;
}, z.core.$strip>;
/**
 * The server's response to a {@linkcode ListToolsRequest | tools/list} request from the client.
 */
declare const ListToolsResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  tools: z.ZodArray<z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
      required: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$catchall<z.ZodUnknown>>;
    outputSchema: z.ZodOptional<z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
      required: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$catchall<z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodObject<{
      title: z.ZodOptional<z.ZodString>;
      readOnlyHint: z.ZodOptional<z.ZodBoolean>;
      destructiveHint: z.ZodOptional<z.ZodBoolean>;
      idempotentHint: z.ZodOptional<z.ZodBoolean>;
      openWorldHint: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    execution: z.ZodOptional<z.ZodObject<{
      taskSupport: z.ZodOptional<z.ZodEnum<{
        optional: "optional";
        required: "required";
        forbidden: "forbidden";
      }>>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>;
/**
 * The server's response to a tool call.
 */
declare const CallToolResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"resource_link">;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<readonly [z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      blob: z.ZodString;
    }, z.core.$strip>]>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>]>>>;
  structuredContent: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  isError: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>;
/**
 * {@linkcode CallToolResultSchema} extended with backwards compatibility to protocol version 2024-10-07.
 */
declare const CompatibilityCallToolResultSchema: z.ZodUnion<[z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"resource_link">;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<readonly [z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      blob: z.ZodString;
    }, z.core.$strip>]>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>]>>>;
  structuredContent: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  isError: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  toolResult: z.ZodUnknown;
}, z.core.$loose>]>;
/**
 * Parameters for a `tools/call` request.
 */
declare const CallToolRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodOptional<z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
  name: z.ZodString;
  arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Used by the client to invoke a tool provided by the server.
 */
declare const CallToolRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"tools/call">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    task: z.ZodOptional<z.ZodObject<{
      ttl: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    name: z.ZodString;
    arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.
 */
declare const ToolListChangedNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/tools/list_changed">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Callback type for list changed notifications.
 */
type ListChangedCallback<T$1> = (error: Error | null, items: T$1[] | null) => void;
/**
 * Base schema for list changed subscription options (without callback).
 * Used internally for Zod validation of `autoRefresh` and `debounceMs`.
 */
declare const ListChangedOptionsBaseSchema: z.ZodObject<{
  autoRefresh: z.ZodDefault<z.ZodBoolean>;
  debounceMs: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Options for subscribing to list changed notifications.
 *
 * @typeParam T - The type of items in the list ({@linkcode Tool}, {@linkcode Prompt}, or {@linkcode Resource})
 */
type ListChangedOptions<T$1> = {
  /**
   * If `true`, the list will be refreshed automatically when a list changed notification is received.
   * @default true
   */
  autoRefresh?: boolean;
  /**
   * Debounce time in milliseconds. Set to `0` to disable.
   * @default 300
   */
  debounceMs?: number;
  /**
   * Callback invoked when the list changes.
   *
   * If `autoRefresh` is `true`, `items` contains the updated list.
   * If `autoRefresh` is `false`, `items` is `null` (caller should refresh manually).
   */
  onChanged: ListChangedCallback<T$1>;
};
/**
 * Configuration for list changed notification handlers.
 *
 * Use this to configure handlers for tools, prompts, and resources list changes
 * when creating a client.
 *
 * Note: Handlers are only activated if the server advertises the corresponding
 * `listChanged` capability (e.g., `tools.listChanged: true`). If the server
 * doesn't advertise this capability, the handler will not be set up.
 */
type ListChangedHandlers = {
  /**
   * Handler for tool list changes.
   */
  tools?: ListChangedOptions<Tool>;
  /**
   * Handler for prompt list changes.
   */
  prompts?: ListChangedOptions<Prompt>;
  /**
   * Handler for resource list changes.
   */
  resources?: ListChangedOptions<Resource>;
};
/**
 * The severity of a log message.
 */
declare const LoggingLevelSchema: z.ZodEnum<{
  error: "error";
  debug: "debug";
  info: "info";
  notice: "notice";
  warning: "warning";
  critical: "critical";
  alert: "alert";
  emergency: "emergency";
}>;
/**
 * Parameters for a `logging/setLevel` request.
 */
declare const SetLevelRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  level: z.ZodEnum<{
    error: "error";
    debug: "debug";
    info: "info";
    notice: "notice";
    warning: "warning";
    critical: "critical";
    alert: "alert";
    emergency: "emergency";
  }>;
}, z.core.$strip>;
/**
 * A request from the client to the server, to enable or adjust logging.
 */
declare const SetLevelRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"logging/setLevel">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    level: z.ZodEnum<{
      error: "error";
      debug: "debug";
      info: "info";
      notice: "notice";
      warning: "warning";
      critical: "critical";
      alert: "alert";
      emergency: "emergency";
    }>;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Parameters for a `notifications/message` notification.
 */
declare const LoggingMessageNotificationParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  level: z.ZodEnum<{
    error: "error";
    debug: "debug";
    info: "info";
    notice: "notice";
    warning: "warning";
    critical: "critical";
    alert: "alert";
    emergency: "emergency";
  }>;
  logger: z.ZodOptional<z.ZodString>;
  data: z.ZodUnknown;
}, z.core.$strip>;
/**
 * Notification of a log message passed from server to client. If no `logging/setLevel` request has been sent from the client, the server MAY decide which messages to send automatically.
 */
declare const LoggingMessageNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/message">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    level: z.ZodEnum<{
      error: "error";
      debug: "debug";
      info: "info";
      notice: "notice";
      warning: "warning";
      critical: "critical";
      alert: "alert";
      emergency: "emergency";
    }>;
    logger: z.ZodOptional<z.ZodString>;
    data: z.ZodUnknown;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Hints to use for model selection.
 */
declare const ModelHintSchema: z.ZodObject<{
  name: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * The server's preferences for model selection, requested of the client during sampling.
 */
declare const ModelPreferencesSchema: z.ZodObject<{
  hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>>;
  costPriority: z.ZodOptional<z.ZodNumber>;
  speedPriority: z.ZodOptional<z.ZodNumber>;
  intelligencePriority: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Controls tool usage behavior in sampling requests.
 */
declare const ToolChoiceSchema: z.ZodObject<{
  mode: z.ZodOptional<z.ZodEnum<{
    required: "required";
    auto: "auto";
    none: "none";
  }>>;
}, z.core.$strip>;
/**
 * The result of a tool execution, provided by the user (server).
 * Represents the outcome of invoking a tool requested via {@linkcode ToolUseContent}.
 */
declare const ToolResultContentSchema: z.ZodObject<{
  type: z.ZodLiteral<"tool_result">;
  toolUseId: z.ZodString;
  content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"resource_link">;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<readonly [z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      blob: z.ZodString;
    }, z.core.$strip>]>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>]>>>;
  structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
  isError: z.ZodOptional<z.ZodBoolean>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Basic content types for sampling responses (without tool use).
 * Used for backwards-compatible {@linkcode CreateMessageResult} when tools are not used.
 */
declare const SamplingContentSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<"text">;
  text: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"image">;
  data: z.ZodString;
  mimeType: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"audio">;
  data: z.ZodString;
  mimeType: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>], "type">;
/**
 * Content block types allowed in sampling messages.
 * This includes text, image, audio, tool use requests, and tool results.
 */
declare const SamplingMessageContentBlockSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
  type: z.ZodLiteral<"text">;
  text: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"image">;
  data: z.ZodString;
  mimeType: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"audio">;
  data: z.ZodString;
  mimeType: z.ZodString;
  annotations: z.ZodOptional<z.ZodObject<{
    audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>>>;
    priority: z.ZodOptional<z.ZodNumber>;
    lastModified: z.ZodOptional<z.ZodISODateTime>;
  }, z.core.$strip>>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"tool_use">;
  name: z.ZodString;
  id: z.ZodString;
  input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"tool_result">;
  toolUseId: z.ZodString;
  content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"resource_link">;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<readonly [z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      blob: z.ZodString;
    }, z.core.$strip>]>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>]>>>;
  structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
  isError: z.ZodOptional<z.ZodBoolean>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>], "type">;
/**
 * Describes a message issued to or received from an LLM API.
 */
declare const SamplingMessageSchema: z.ZodObject<{
  role: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
  }>;
  content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_use">;
    name: z.ZodString;
    id: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_result">;
    toolUseId: z.ZodString;
    content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      mimeType: z.ZodOptional<z.ZodString>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"resource">;
      resource: z.ZodUnion<readonly [z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        text: z.ZodString;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        blob: z.ZodString;
      }, z.core.$strip>]>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>]>>>;
    structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    isError: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_use">;
    name: z.ZodString;
    id: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_result">;
    toolUseId: z.ZodString;
    content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      mimeType: z.ZodOptional<z.ZodString>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"resource">;
      resource: z.ZodUnion<readonly [z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        text: z.ZodString;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        blob: z.ZodString;
      }, z.core.$strip>]>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>]>>>;
    structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    isError: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>], "type">>]>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Parameters for a `sampling/createMessage` request.
 */
declare const CreateMessageRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodOptional<z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
  messages: z.ZodArray<z.ZodObject<{
    role: z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>;
    content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"tool_use">;
      name: z.ZodString;
      id: z.ZodString;
      input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"tool_result">;
      toolUseId: z.ZodString;
      content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
          src: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
          sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          theme: z.ZodOptional<z.ZodEnum<{
            light: "light";
            dark: "dark";
          }>>;
        }, z.core.$strip>>>;
        name: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodLiteral<"resource_link">;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<readonly [z.ZodObject<{
          uri: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
          text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
          uri: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
          blob: z.ZodString;
        }, z.core.$strip>]>;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>]>>>;
      structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      isError: z.ZodOptional<z.ZodBoolean>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"tool_use">;
      name: z.ZodString;
      id: z.ZodString;
      input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"tool_result">;
      toolUseId: z.ZodString;
      content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        mimeType: z.ZodOptional<z.ZodString>;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
          src: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
          sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
          theme: z.ZodOptional<z.ZodEnum<{
            light: "light";
            dark: "dark";
          }>>;
        }, z.core.$strip>>>;
        name: z.ZodString;
        title: z.ZodOptional<z.ZodString>;
        type: z.ZodLiteral<"resource_link">;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"resource">;
        resource: z.ZodUnion<readonly [z.ZodObject<{
          uri: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
          text: z.ZodString;
        }, z.core.$strip>, z.ZodObject<{
          uri: z.ZodString;
          mimeType: z.ZodOptional<z.ZodString>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
          blob: z.ZodString;
        }, z.core.$strip>]>;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>]>>>;
      structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      isError: z.ZodOptional<z.ZodBoolean>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>], "type">>]>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>>;
  modelPreferences: z.ZodOptional<z.ZodObject<{
    hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
      name: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    costPriority: z.ZodOptional<z.ZodNumber>;
    speedPriority: z.ZodOptional<z.ZodNumber>;
    intelligencePriority: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
  systemPrompt: z.ZodOptional<z.ZodString>;
  includeContext: z.ZodOptional<z.ZodEnum<{
    none: "none";
    thisServer: "thisServer";
    allServers: "allServers";
  }>>;
  temperature: z.ZodOptional<z.ZodNumber>;
  maxTokens: z.ZodNumber;
  stopSequences: z.ZodOptional<z.ZodArray<z.ZodString>>;
  metadata: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
  tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
      required: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$catchall<z.ZodUnknown>>;
    outputSchema: z.ZodOptional<z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
      required: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$catchall<z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodObject<{
      title: z.ZodOptional<z.ZodString>;
      readOnlyHint: z.ZodOptional<z.ZodBoolean>;
      destructiveHint: z.ZodOptional<z.ZodBoolean>;
      idempotentHint: z.ZodOptional<z.ZodBoolean>;
      openWorldHint: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    execution: z.ZodOptional<z.ZodObject<{
      taskSupport: z.ZodOptional<z.ZodEnum<{
        optional: "optional";
        required: "required";
        forbidden: "forbidden";
      }>>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>>;
  toolChoice: z.ZodOptional<z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<{
      required: "required";
      auto: "auto";
      none: "none";
    }>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.
 */
declare const CreateMessageRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"sampling/createMessage">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    task: z.ZodOptional<z.ZodObject<{
      ttl: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    messages: z.ZodArray<z.ZodObject<{
      role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>;
      content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool_use">;
        name: z.ZodString;
        id: z.ZodString;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool_result">;
        toolUseId: z.ZodString;
        content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
          type: z.ZodLiteral<"text">;
          text: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"image">;
          data: z.ZodString;
          mimeType: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"audio">;
          data: z.ZodString;
          mimeType: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          uri: z.ZodString;
          description: z.ZodOptional<z.ZodString>;
          mimeType: z.ZodOptional<z.ZodString>;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
          icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
            src: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            theme: z.ZodOptional<z.ZodEnum<{
              light: "light";
              dark: "dark";
            }>>;
          }, z.core.$strip>>>;
          name: z.ZodString;
          title: z.ZodOptional<z.ZodString>;
          type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"resource">;
          resource: z.ZodUnion<readonly [z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            text: z.ZodString;
          }, z.core.$strip>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            blob: z.ZodString;
          }, z.core.$strip>]>;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>]>>>;
        structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        isError: z.ZodOptional<z.ZodBoolean>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool_use">;
        name: z.ZodString;
        id: z.ZodString;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool_result">;
        toolUseId: z.ZodString;
        content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
          type: z.ZodLiteral<"text">;
          text: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"image">;
          data: z.ZodString;
          mimeType: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"audio">;
          data: z.ZodString;
          mimeType: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          uri: z.ZodString;
          description: z.ZodOptional<z.ZodString>;
          mimeType: z.ZodOptional<z.ZodString>;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
          icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
            src: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            theme: z.ZodOptional<z.ZodEnum<{
              light: "light";
              dark: "dark";
            }>>;
          }, z.core.$strip>>>;
          name: z.ZodString;
          title: z.ZodOptional<z.ZodString>;
          type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"resource">;
          resource: z.ZodUnion<readonly [z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            text: z.ZodString;
          }, z.core.$strip>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            blob: z.ZodString;
          }, z.core.$strip>]>;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>]>>>;
        structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        isError: z.ZodOptional<z.ZodBoolean>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>], "type">>]>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    modelPreferences: z.ZodOptional<z.ZodObject<{
      hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>>>;
      costPriority: z.ZodOptional<z.ZodNumber>;
      speedPriority: z.ZodOptional<z.ZodNumber>;
      intelligencePriority: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    includeContext: z.ZodOptional<z.ZodEnum<{
      none: "none";
      thisServer: "thisServer";
      allServers: "allServers";
    }>>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodNumber;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
      description: z.ZodOptional<z.ZodString>;
      inputSchema: z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
        required: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$catchall<z.ZodUnknown>>;
      outputSchema: z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
        required: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$catchall<z.ZodUnknown>>>;
      annotations: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        readOnlyHint: z.ZodOptional<z.ZodBoolean>;
        destructiveHint: z.ZodOptional<z.ZodBoolean>;
        idempotentHint: z.ZodOptional<z.ZodBoolean>;
        openWorldHint: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>>;
      execution: z.ZodOptional<z.ZodObject<{
        taskSupport: z.ZodOptional<z.ZodEnum<{
          optional: "optional";
          required: "required";
          forbidden: "forbidden";
        }>>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    toolChoice: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        required: "required";
        auto: "auto";
        none: "none";
      }>>;
    }, z.core.$strip>>;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * The client's response to a `sampling/create_message` request from the server.
 * This is the backwards-compatible version that returns single content (no arrays).
 * Used when the request does not include tools.
 */
declare const CreateMessageResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  model: z.ZodString;
  stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<{
    maxTokens: "maxTokens";
    endTurn: "endTurn";
    stopSequence: "stopSequence";
  }>, z.ZodString]>>;
  role: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
  }>;
  content: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>], "type">;
}, z.core.$loose>;
/**
 * The client's response to a `sampling/create_message` request when tools were provided.
 * This version supports array content for tool use flows.
 */
declare const CreateMessageResultWithToolsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  model: z.ZodString;
  stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<{
    maxTokens: "maxTokens";
    endTurn: "endTurn";
    stopSequence: "stopSequence";
    toolUse: "toolUse";
  }>, z.ZodString]>>;
  role: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
  }>;
  content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_use">;
    name: z.ZodString;
    id: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_result">;
    toolUseId: z.ZodString;
    content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      mimeType: z.ZodOptional<z.ZodString>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"resource">;
      resource: z.ZodUnion<readonly [z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        text: z.ZodString;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        blob: z.ZodString;
      }, z.core.$strip>]>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>]>>>;
    structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    isError: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_use">;
    name: z.ZodString;
    id: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_result">;
    toolUseId: z.ZodString;
    content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      mimeType: z.ZodOptional<z.ZodString>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"resource">;
      resource: z.ZodUnion<readonly [z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        text: z.ZodString;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        blob: z.ZodString;
      }, z.core.$strip>]>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>]>>>;
    structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    isError: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>], "type">>]>;
}, z.core.$loose>;
/**
 * Primitive schema definition for boolean fields.
 */
declare const BooleanSchemaSchema: z.ZodObject<{
  type: z.ZodLiteral<"boolean">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  default: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Primitive schema definition for string fields.
 */
declare const StringSchemaSchema: z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minLength: z.ZodOptional<z.ZodNumber>;
  maxLength: z.ZodOptional<z.ZodNumber>;
  format: z.ZodOptional<z.ZodEnum<{
    email: "email";
    date: "date";
    uri: "uri";
    "date-time": "date-time";
  }>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Primitive schema definition for number fields.
 */
declare const NumberSchemaSchema: z.ZodObject<{
  type: z.ZodEnum<{
    number: "number";
    integer: "integer";
  }>;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minimum: z.ZodOptional<z.ZodNumber>;
  maximum: z.ZodOptional<z.ZodNumber>;
  default: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Schema for single-selection enumeration without display titles for options.
 */
declare const UntitledSingleSelectEnumSchemaSchema: z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  enum: z.ZodArray<z.ZodString>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Schema for single-selection enumeration with display titles for each option.
 */
declare const TitledSingleSelectEnumSchemaSchema: z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  oneOf: z.ZodArray<z.ZodObject<{
    const: z.ZodString;
    title: z.ZodString;
  }, z.core.$strip>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Use {@linkcode TitledSingleSelectEnumSchema} instead.
 * This interface will be removed in a future version.
 */
declare const LegacyTitledEnumSchemaSchema: z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  enum: z.ZodArray<z.ZodString>;
  enumNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const SingleSelectEnumSchemaSchema: z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  enum: z.ZodArray<z.ZodString>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  oneOf: z.ZodArray<z.ZodObject<{
    const: z.ZodString;
    title: z.ZodString;
  }, z.core.$strip>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>]>;
/**
 * Schema for multiple-selection enumeration without display titles for options.
 */
declare const UntitledMultiSelectEnumSchemaSchema: z.ZodObject<{
  type: z.ZodLiteral<"array">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minItems: z.ZodOptional<z.ZodNumber>;
  maxItems: z.ZodOptional<z.ZodNumber>;
  items: z.ZodObject<{
    type: z.ZodLiteral<"string">;
    enum: z.ZodArray<z.ZodString>;
  }, z.core.$strip>;
  default: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Schema for multiple-selection enumeration with display titles for each option.
 */
declare const TitledMultiSelectEnumSchemaSchema: z.ZodObject<{
  type: z.ZodLiteral<"array">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minItems: z.ZodOptional<z.ZodNumber>;
  maxItems: z.ZodOptional<z.ZodNumber>;
  items: z.ZodObject<{
    anyOf: z.ZodArray<z.ZodObject<{
      const: z.ZodString;
      title: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$strip>;
  default: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Combined schema for multiple-selection enumeration
 */
declare const MultiSelectEnumSchemaSchema: z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"array">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minItems: z.ZodOptional<z.ZodNumber>;
  maxItems: z.ZodOptional<z.ZodNumber>;
  items: z.ZodObject<{
    type: z.ZodLiteral<"string">;
    enum: z.ZodArray<z.ZodString>;
  }, z.core.$strip>;
  default: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"array">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minItems: z.ZodOptional<z.ZodNumber>;
  maxItems: z.ZodOptional<z.ZodNumber>;
  items: z.ZodObject<{
    anyOf: z.ZodArray<z.ZodObject<{
      const: z.ZodString;
      title: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$strip>;
  default: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>]>;
/**
 * Primitive schema definition for enum fields.
 */
declare const EnumSchemaSchema: z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  enum: z.ZodArray<z.ZodString>;
  enumNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  enum: z.ZodArray<z.ZodString>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  oneOf: z.ZodArray<z.ZodObject<{
    const: z.ZodString;
    title: z.ZodString;
  }, z.core.$strip>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>]>, z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"array">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minItems: z.ZodOptional<z.ZodNumber>;
  maxItems: z.ZodOptional<z.ZodNumber>;
  items: z.ZodObject<{
    type: z.ZodLiteral<"string">;
    enum: z.ZodArray<z.ZodString>;
  }, z.core.$strip>;
  default: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"array">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minItems: z.ZodOptional<z.ZodNumber>;
  maxItems: z.ZodOptional<z.ZodNumber>;
  items: z.ZodObject<{
    anyOf: z.ZodArray<z.ZodObject<{
      const: z.ZodString;
      title: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$strip>;
  default: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>]>]>;
/**
 * Union of all primitive schema definitions.
 */
declare const PrimitiveSchemaDefinitionSchema: z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  enum: z.ZodArray<z.ZodString>;
  enumNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  enum: z.ZodArray<z.ZodString>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  oneOf: z.ZodArray<z.ZodObject<{
    const: z.ZodString;
    title: z.ZodString;
  }, z.core.$strip>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>]>, z.ZodUnion<readonly [z.ZodObject<{
  type: z.ZodLiteral<"array">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minItems: z.ZodOptional<z.ZodNumber>;
  maxItems: z.ZodOptional<z.ZodNumber>;
  items: z.ZodObject<{
    type: z.ZodLiteral<"string">;
    enum: z.ZodArray<z.ZodString>;
  }, z.core.$strip>;
  default: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"array">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minItems: z.ZodOptional<z.ZodNumber>;
  maxItems: z.ZodOptional<z.ZodNumber>;
  items: z.ZodObject<{
    anyOf: z.ZodArray<z.ZodObject<{
      const: z.ZodString;
      title: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$strip>;
  default: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>]>]>, z.ZodObject<{
  type: z.ZodLiteral<"boolean">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  default: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodLiteral<"string">;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minLength: z.ZodOptional<z.ZodNumber>;
  maxLength: z.ZodOptional<z.ZodNumber>;
  format: z.ZodOptional<z.ZodEnum<{
    email: "email";
    date: "date";
    uri: "uri";
    "date-time": "date-time";
  }>>;
  default: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
  type: z.ZodEnum<{
    number: "number";
    integer: "integer";
  }>;
  title: z.ZodOptional<z.ZodString>;
  description: z.ZodOptional<z.ZodString>;
  minimum: z.ZodOptional<z.ZodNumber>;
  maximum: z.ZodOptional<z.ZodNumber>;
  default: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>]>;
/**
 * Parameters for an `elicitation/create` request for form-based elicitation.
 */
declare const ElicitRequestFormParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodOptional<z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
  mode: z.ZodOptional<z.ZodLiteral<"form">>;
  message: z.ZodString;
  requestedSchema: z.ZodObject<{
    type: z.ZodLiteral<"object">;
    properties: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"string">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      enum: z.ZodArray<z.ZodString>;
      enumNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
      default: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"string">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      enum: z.ZodArray<z.ZodString>;
      default: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"string">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      oneOf: z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
      }, z.core.$strip>>;
      default: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>, z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"array">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      minItems: z.ZodOptional<z.ZodNumber>;
      maxItems: z.ZodOptional<z.ZodNumber>;
      items: z.ZodObject<{
        type: z.ZodLiteral<"string">;
        enum: z.ZodArray<z.ZodString>;
      }, z.core.$strip>;
      default: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"array">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      minItems: z.ZodOptional<z.ZodNumber>;
      maxItems: z.ZodOptional<z.ZodNumber>;
      items: z.ZodObject<{
        anyOf: z.ZodArray<z.ZodObject<{
          const: z.ZodString;
          title: z.ZodString;
        }, z.core.$strip>>;
      }, z.core.$strip>;
      default: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>]>]>, z.ZodObject<{
      type: z.ZodLiteral<"boolean">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      default: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"string">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      minLength: z.ZodOptional<z.ZodNumber>;
      maxLength: z.ZodOptional<z.ZodNumber>;
      format: z.ZodOptional<z.ZodEnum<{
        email: "email";
        date: "date";
        uri: "uri";
        "date-time": "date-time";
      }>>;
      default: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodEnum<{
        number: "number";
        integer: "integer";
      }>;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      minimum: z.ZodOptional<z.ZodNumber>;
      maximum: z.ZodOptional<z.ZodNumber>;
      default: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>]>>;
    required: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Parameters for an {@linkcode ElicitRequest | elicitation/create} request for URL-based elicitation.
 */
declare const ElicitRequestURLParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodOptional<z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
  mode: z.ZodLiteral<"url">;
  message: z.ZodString;
  elicitationId: z.ZodString;
  url: z.ZodString;
}, z.core.$strip>;
/**
 * The parameters for a request to elicit additional information from the user via the client.
 */
declare const ElicitRequestParamsSchema: z.ZodUnion<readonly [z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodOptional<z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
  mode: z.ZodOptional<z.ZodLiteral<"form">>;
  message: z.ZodString;
  requestedSchema: z.ZodObject<{
    type: z.ZodLiteral<"object">;
    properties: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"string">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      enum: z.ZodArray<z.ZodString>;
      enumNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
      default: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"string">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      enum: z.ZodArray<z.ZodString>;
      default: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"string">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      oneOf: z.ZodArray<z.ZodObject<{
        const: z.ZodString;
        title: z.ZodString;
      }, z.core.$strip>>;
      default: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>]>, z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"array">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      minItems: z.ZodOptional<z.ZodNumber>;
      maxItems: z.ZodOptional<z.ZodNumber>;
      items: z.ZodObject<{
        type: z.ZodLiteral<"string">;
        enum: z.ZodArray<z.ZodString>;
      }, z.core.$strip>;
      default: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"array">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      minItems: z.ZodOptional<z.ZodNumber>;
      maxItems: z.ZodOptional<z.ZodNumber>;
      items: z.ZodObject<{
        anyOf: z.ZodArray<z.ZodObject<{
          const: z.ZodString;
          title: z.ZodString;
        }, z.core.$strip>>;
      }, z.core.$strip>;
      default: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>]>]>, z.ZodObject<{
      type: z.ZodLiteral<"boolean">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      default: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"string">;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      minLength: z.ZodOptional<z.ZodNumber>;
      maxLength: z.ZodOptional<z.ZodNumber>;
      format: z.ZodOptional<z.ZodEnum<{
        email: "email";
        date: "date";
        uri: "uri";
        "date-time": "date-time";
      }>>;
      default: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodEnum<{
        number: "number";
        integer: "integer";
      }>;
      title: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      minimum: z.ZodOptional<z.ZodNumber>;
      maximum: z.ZodOptional<z.ZodNumber>;
      default: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>]>>;
    required: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodOptional<z.ZodObject<{
    ttl: z.ZodOptional<z.ZodNumber>;
  }, z.core.$strip>>;
  mode: z.ZodLiteral<"url">;
  message: z.ZodString;
  elicitationId: z.ZodString;
  url: z.ZodString;
}, z.core.$strip>]>;
/**
 * A request from the server to elicit user input via the client.
 * The client should present the message and form fields to the user (form mode)
 * or navigate to a URL (URL mode).
 */
declare const ElicitRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"elicitation/create">;
  params: z.ZodUnion<readonly [z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    task: z.ZodOptional<z.ZodObject<{
      ttl: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    mode: z.ZodOptional<z.ZodLiteral<"form">>;
    message: z.ZodString;
    requestedSchema: z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"string">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        enum: z.ZodArray<z.ZodString>;
        enumNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        default: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"string">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        enum: z.ZodArray<z.ZodString>;
        default: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"string">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        oneOf: z.ZodArray<z.ZodObject<{
          const: z.ZodString;
          title: z.ZodString;
        }, z.core.$strip>>;
        default: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>]>, z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"array">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minItems: z.ZodOptional<z.ZodNumber>;
        maxItems: z.ZodOptional<z.ZodNumber>;
        items: z.ZodObject<{
          type: z.ZodLiteral<"string">;
          enum: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
        default: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"array">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minItems: z.ZodOptional<z.ZodNumber>;
        maxItems: z.ZodOptional<z.ZodNumber>;
        items: z.ZodObject<{
          anyOf: z.ZodArray<z.ZodObject<{
            const: z.ZodString;
            title: z.ZodString;
          }, z.core.$strip>>;
        }, z.core.$strip>;
        default: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strip>]>]>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        default: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"string">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minLength: z.ZodOptional<z.ZodNumber>;
        maxLength: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodEnum<{
          email: "email";
          date: "date";
          uri: "uri";
          "date-time": "date-time";
        }>>;
        default: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodEnum<{
          number: "number";
          integer: "integer";
        }>;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minimum: z.ZodOptional<z.ZodNumber>;
        maximum: z.ZodOptional<z.ZodNumber>;
        default: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strip>]>>;
      required: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
  }, z.core.$strip>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    task: z.ZodOptional<z.ZodObject<{
      ttl: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    mode: z.ZodLiteral<"url">;
    message: z.ZodString;
    elicitationId: z.ZodString;
    url: z.ZodString;
  }, z.core.$strip>]>;
}, z.core.$strip>;
/**
 * Parameters for a {@linkcode ElicitationCompleteNotification | notifications/elicitation/complete} notification.
 *
 * @category notifications/elicitation/complete
 */
declare const ElicitationCompleteNotificationParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  elicitationId: z.ZodString;
}, z.core.$strip>;
/**
 * A notification from the server to the client, informing it of a completion of an out-of-band elicitation request.
 *
 * @category notifications/elicitation/complete
 */
declare const ElicitationCompleteNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/elicitation/complete">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    elicitationId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>;
/**
 * The client's response to an {@linkcode ElicitRequest | elicitation/create} request from the server.
 */
declare const ElicitResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  action: z.ZodEnum<{
    cancel: "cancel";
    accept: "accept";
    decline: "decline";
  }>;
  content: z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
}, z.core.$loose>;
/**
 * A reference to a resource or resource template definition.
 */
declare const ResourceTemplateReferenceSchema: z.ZodObject<{
  type: z.ZodLiteral<"ref/resource">;
  uri: z.ZodString;
}, z.core.$strip>;
/**
 * Identifies a prompt.
 */
declare const PromptReferenceSchema: z.ZodObject<{
  type: z.ZodLiteral<"ref/prompt">;
  name: z.ZodString;
}, z.core.$strip>;
/**
 * Parameters for a {@linkcode CompleteRequest | completion/complete} request.
 */
declare const CompleteRequestParamsSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  ref: z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"ref/prompt">;
    name: z.ZodString;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"ref/resource">;
    uri: z.ZodString;
  }, z.core.$strip>]>;
  argument: z.ZodObject<{
    name: z.ZodString;
    value: z.ZodString;
  }, z.core.$strip>;
  context: z.ZodOptional<z.ZodObject<{
    arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * A request from the client to the server, to ask for completion options.
 */
declare const CompleteRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"completion/complete">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    ref: z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"ref/prompt">;
      name: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"ref/resource">;
      uri: z.ZodString;
    }, z.core.$strip>]>;
    argument: z.ZodObject<{
      name: z.ZodString;
      value: z.ZodString;
    }, z.core.$strip>;
    context: z.ZodOptional<z.ZodObject<{
      arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strip>>;
  }, z.core.$strip>;
}, z.core.$strip>;
declare function assertCompleteRequestPrompt(request: CompleteRequest): asserts request is CompleteRequestPrompt;
declare function assertCompleteRequestResourceTemplate(request: CompleteRequest): asserts request is CompleteRequestResourceTemplate;
/**
 * The server's response to a {@linkcode CompleteRequest | completion/complete} request
 */
declare const CompleteResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  completion: z.ZodObject<{
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: z.ZodArray<z.ZodString>;
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: z.ZodOptional<z.ZodNumber>;
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$loose>;
}, z.core.$loose>;
/**
 * Represents a root directory or file that the server can operate on.
 */
declare const RootSchema: z.ZodObject<{
  uri: z.ZodString;
  name: z.ZodOptional<z.ZodString>;
  _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Sent from the server to request a list of root URIs from the client.
 */
declare const ListRootsRequestSchema: z.ZodObject<{
  method: z.ZodLiteral<"roots/list">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * The client's response to a `roots/list` request from the server.
 */
declare const ListRootsResultSchema: z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  roots: z.ZodArray<z.ZodObject<{
    uri: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>>;
}, z.core.$loose>;
/**
 * A notification from the client to the server, informing it that the list of roots has changed.
 */
declare const RootsListChangedNotificationSchema: z.ZodObject<{
  method: z.ZodLiteral<"notifications/roots/list_changed">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>;
declare const ClientRequestSchema: z.ZodUnion<readonly [z.ZodObject<{
  method: z.ZodLiteral<"ping">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"initialize">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    protocolVersion: z.ZodString;
    capabilities: z.ZodObject<{
      experimental: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
      sampling: z.ZodOptional<z.ZodObject<{
        context: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        tools: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      }, z.core.$strip>>;
      elicitation: z.ZodOptional<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodIntersection<z.ZodObject<{
        form: z.ZodOptional<z.ZodIntersection<z.ZodObject<{
          applyDefaults: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strip>, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
        url: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      }, z.core.$strip>, z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>>>;
      roots: z.ZodOptional<z.ZodObject<{
        listChanged: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>>;
      tasks: z.ZodOptional<z.ZodObject<{
        /**
         * Present if the client supports listing tasks.
         */
        list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        /**
         * Present if the client supports cancelling tasks.
         */
        cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        /**
         * Capabilities for task creation on specific request types.
         */
        requests: z.ZodOptional<z.ZodObject<{
          /**
           * Task support for sampling requests.
           */
          sampling: z.ZodOptional<z.ZodObject<{
            createMessage: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
          }, z.core.$loose>>;
          /**
           * Task support for elicitation requests.
           */
          elicitation: z.ZodOptional<z.ZodObject<{
            create: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
          }, z.core.$loose>>;
        }, z.core.$loose>>;
      }, z.core.$loose>>;
    }, z.core.$strip>;
    clientInfo: z.ZodObject<{
      version: z.ZodString;
      websiteUrl: z.ZodOptional<z.ZodString>;
      description: z.ZodOptional<z.ZodString>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"completion/complete">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    ref: z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"ref/prompt">;
      name: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"ref/resource">;
      uri: z.ZodString;
    }, z.core.$strip>]>;
    argument: z.ZodObject<{
      name: z.ZodString;
      value: z.ZodString;
    }, z.core.$strip>;
    context: z.ZodOptional<z.ZodObject<{
      arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, z.core.$strip>>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"logging/setLevel">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    level: z.ZodEnum<{
      error: "error";
      debug: "debug";
      info: "info";
      notice: "notice";
      warning: "warning";
      critical: "critical";
      alert: "alert";
      emergency: "emergency";
    }>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"prompts/get">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    name: z.ZodString;
    arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"prompts/list">;
}, z.core.$strip>, z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"resources/list">;
}, z.core.$strip>, z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"resources/templates/list">;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"resources/read">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    uri: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"resources/subscribe">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    uri: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"resources/unsubscribe">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    uri: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"tools/call">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    task: z.ZodOptional<z.ZodObject<{
      ttl: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    name: z.ZodString;
    arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"tools/list">;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"tasks/get">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"tasks/result">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"tasks/list">;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"tasks/cancel">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>]>;
declare const ClientNotificationSchema: z.ZodUnion<readonly [z.ZodObject<{
  method: z.ZodLiteral<"notifications/cancelled">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    requestId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    reason: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/progress">;
  params: z.ZodObject<{
    progressToken: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    progress: z.ZodNumber;
    total: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/initialized">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/roots/list_changed">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/tasks/status">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$strip>]>;
declare const ClientResultSchema: z.ZodUnion<readonly [z.ZodObject<{
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on `_meta` usage.
   */
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
}, z.core.$strict>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  model: z.ZodString;
  stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<{
    maxTokens: "maxTokens";
    endTurn: "endTurn";
    stopSequence: "stopSequence";
  }>, z.ZodString]>>;
  role: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
  }>;
  content: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>], "type">;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  model: z.ZodString;
  stopReason: z.ZodOptional<z.ZodUnion<[z.ZodEnum<{
    maxTokens: "maxTokens";
    endTurn: "endTurn";
    stopSequence: "stopSequence";
    toolUse: "toolUse";
  }>, z.ZodString]>>;
  role: z.ZodEnum<{
    user: "user";
    assistant: "assistant";
  }>;
  content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_use">;
    name: z.ZodString;
    id: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_result">;
    toolUseId: z.ZodString;
    content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      mimeType: z.ZodOptional<z.ZodString>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"resource">;
      resource: z.ZodUnion<readonly [z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        text: z.ZodString;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        blob: z.ZodString;
      }, z.core.$strip>]>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>]>>>;
    structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    isError: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_use">;
    name: z.ZodString;
    id: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool_result">;
    toolUseId: z.ZodString;
    content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      mimeType: z.ZodOptional<z.ZodString>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"resource">;
      resource: z.ZodUnion<readonly [z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        text: z.ZodString;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        blob: z.ZodString;
      }, z.core.$strip>]>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>]>>>;
    structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    isError: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>], "type">>]>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  action: z.ZodEnum<{
    cancel: "cancel";
    accept: "accept";
    decline: "decline";
  }>;
  content: z.ZodPipe<z.ZodTransform<{} | undefined, unknown>, z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString>]>>>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  roots: z.ZodArray<z.ZodObject<{
    uri: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  taskId: z.ZodString;
  status: z.ZodEnum<{
    working: "working";
    input_required: "input_required";
    completed: "completed";
    failed: "failed";
    cancelled: "cancelled";
  }>;
  ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
  createdAt: z.ZodString;
  lastUpdatedAt: z.ZodString;
  pollInterval: z.ZodOptional<z.ZodNumber>;
  statusMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  tasks: z.ZodArray<z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$loose>]>;
declare const ServerRequestSchema: z.ZodUnion<readonly [z.ZodObject<{
  method: z.ZodLiteral<"ping">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"sampling/createMessage">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    task: z.ZodOptional<z.ZodObject<{
      ttl: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    messages: z.ZodArray<z.ZodObject<{
      role: z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>;
      content: z.ZodUnion<readonly [z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool_use">;
        name: z.ZodString;
        id: z.ZodString;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool_result">;
        toolUseId: z.ZodString;
        content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
          type: z.ZodLiteral<"text">;
          text: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"image">;
          data: z.ZodString;
          mimeType: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"audio">;
          data: z.ZodString;
          mimeType: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          uri: z.ZodString;
          description: z.ZodOptional<z.ZodString>;
          mimeType: z.ZodOptional<z.ZodString>;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
          icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
            src: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            theme: z.ZodOptional<z.ZodEnum<{
              light: "light";
              dark: "dark";
            }>>;
          }, z.core.$strip>>>;
          name: z.ZodString;
          title: z.ZodOptional<z.ZodString>;
          type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"resource">;
          resource: z.ZodUnion<readonly [z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            text: z.ZodString;
          }, z.core.$strip>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            blob: z.ZodString;
          }, z.core.$strip>]>;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>]>>>;
        structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        isError: z.ZodOptional<z.ZodBoolean>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>], "type">, z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"text">;
        text: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"image">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"audio">;
        data: z.ZodString;
        mimeType: z.ZodString;
        annotations: z.ZodOptional<z.ZodObject<{
          audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
            user: "user";
            assistant: "assistant";
          }>>>;
          priority: z.ZodOptional<z.ZodNumber>;
          lastModified: z.ZodOptional<z.ZodISODateTime>;
        }, z.core.$strip>>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool_use">;
        name: z.ZodString;
        id: z.ZodString;
        input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool_result">;
        toolUseId: z.ZodString;
        content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
          type: z.ZodLiteral<"text">;
          text: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"image">;
          data: z.ZodString;
          mimeType: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"audio">;
          data: z.ZodString;
          mimeType: z.ZodString;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>, z.ZodObject<{
          uri: z.ZodString;
          description: z.ZodOptional<z.ZodString>;
          mimeType: z.ZodOptional<z.ZodString>;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
          icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
            src: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
            theme: z.ZodOptional<z.ZodEnum<{
              light: "light";
              dark: "dark";
            }>>;
          }, z.core.$strip>>>;
          name: z.ZodString;
          title: z.ZodOptional<z.ZodString>;
          type: z.ZodLiteral<"resource_link">;
        }, z.core.$strip>, z.ZodObject<{
          type: z.ZodLiteral<"resource">;
          resource: z.ZodUnion<readonly [z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            text: z.ZodString;
          }, z.core.$strip>, z.ZodObject<{
            uri: z.ZodString;
            mimeType: z.ZodOptional<z.ZodString>;
            _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
            blob: z.ZodString;
          }, z.core.$strip>]>;
          annotations: z.ZodOptional<z.ZodObject<{
            audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
              user: "user";
              assistant: "assistant";
            }>>>;
            priority: z.ZodOptional<z.ZodNumber>;
            lastModified: z.ZodOptional<z.ZodISODateTime>;
          }, z.core.$strip>>;
          _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        }, z.core.$strip>]>>>;
        structuredContent: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
        isError: z.ZodOptional<z.ZodBoolean>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      }, z.core.$strip>], "type">>]>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    modelPreferences: z.ZodOptional<z.ZodObject<{
      hints: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>>>;
      costPriority: z.ZodOptional<z.ZodNumber>;
      speedPriority: z.ZodOptional<z.ZodNumber>;
      intelligencePriority: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    systemPrompt: z.ZodOptional<z.ZodString>;
    includeContext: z.ZodOptional<z.ZodEnum<{
      none: "none";
      thisServer: "thisServer";
      allServers: "allServers";
    }>>;
    temperature: z.ZodOptional<z.ZodNumber>;
    maxTokens: z.ZodNumber;
    stopSequences: z.ZodOptional<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    tools: z.ZodOptional<z.ZodArray<z.ZodObject<{
      description: z.ZodOptional<z.ZodString>;
      inputSchema: z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
        required: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$catchall<z.ZodUnknown>>;
      outputSchema: z.ZodOptional<z.ZodObject<{
        type: z.ZodLiteral<"object">;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
        required: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$catchall<z.ZodUnknown>>>;
      annotations: z.ZodOptional<z.ZodObject<{
        title: z.ZodOptional<z.ZodString>;
        readOnlyHint: z.ZodOptional<z.ZodBoolean>;
        destructiveHint: z.ZodOptional<z.ZodBoolean>;
        idempotentHint: z.ZodOptional<z.ZodBoolean>;
        openWorldHint: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>>;
      execution: z.ZodOptional<z.ZodObject<{
        taskSupport: z.ZodOptional<z.ZodEnum<{
          optional: "optional";
          required: "required";
          forbidden: "forbidden";
        }>>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    toolChoice: z.ZodOptional<z.ZodObject<{
      mode: z.ZodOptional<z.ZodEnum<{
        required: "required";
        auto: "auto";
        none: "none";
      }>>;
    }, z.core.$strip>>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"elicitation/create">;
  params: z.ZodUnion<readonly [z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    task: z.ZodOptional<z.ZodObject<{
      ttl: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    mode: z.ZodOptional<z.ZodLiteral<"form">>;
    message: z.ZodString;
    requestedSchema: z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"string">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        enum: z.ZodArray<z.ZodString>;
        enumNames: z.ZodOptional<z.ZodArray<z.ZodString>>;
        default: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>, z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"string">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        enum: z.ZodArray<z.ZodString>;
        default: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"string">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        oneOf: z.ZodArray<z.ZodObject<{
          const: z.ZodString;
          title: z.ZodString;
        }, z.core.$strip>>;
        default: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>]>, z.ZodUnion<readonly [z.ZodObject<{
        type: z.ZodLiteral<"array">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minItems: z.ZodOptional<z.ZodNumber>;
        maxItems: z.ZodOptional<z.ZodNumber>;
        items: z.ZodObject<{
          type: z.ZodLiteral<"string">;
          enum: z.ZodArray<z.ZodString>;
        }, z.core.$strip>;
        default: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"array">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minItems: z.ZodOptional<z.ZodNumber>;
        maxItems: z.ZodOptional<z.ZodNumber>;
        items: z.ZodObject<{
          anyOf: z.ZodArray<z.ZodObject<{
            const: z.ZodString;
            title: z.ZodString;
          }, z.core.$strip>>;
        }, z.core.$strip>;
        default: z.ZodOptional<z.ZodArray<z.ZodString>>;
      }, z.core.$strip>]>]>, z.ZodObject<{
        type: z.ZodLiteral<"boolean">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        default: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"string">;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minLength: z.ZodOptional<z.ZodNumber>;
        maxLength: z.ZodOptional<z.ZodNumber>;
        format: z.ZodOptional<z.ZodEnum<{
          email: "email";
          date: "date";
          uri: "uri";
          "date-time": "date-time";
        }>>;
        default: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>, z.ZodObject<{
        type: z.ZodEnum<{
          number: "number";
          integer: "integer";
        }>;
        title: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        minimum: z.ZodOptional<z.ZodNumber>;
        maximum: z.ZodOptional<z.ZodNumber>;
        default: z.ZodOptional<z.ZodNumber>;
      }, z.core.$strip>]>>;
      required: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
  }, z.core.$strip>, z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    task: z.ZodOptional<z.ZodObject<{
      ttl: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    mode: z.ZodLiteral<"url">;
    message: z.ZodString;
    elicitationId: z.ZodString;
    url: z.ZodString;
  }, z.core.$strip>]>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"roots/list">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"tasks/get">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"tasks/result">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    cursor: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  method: z.ZodLiteral<"tasks/list">;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"tasks/cancel">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>]>;
declare const ServerNotificationSchema: z.ZodUnion<readonly [z.ZodObject<{
  method: z.ZodLiteral<"notifications/cancelled">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    requestId: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    reason: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/progress">;
  params: z.ZodObject<{
    progressToken: z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>;
    progress: z.ZodNumber;
    total: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/message">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    level: z.ZodEnum<{
      error: "error";
      debug: "debug";
      info: "info";
      notice: "notice";
      warning: "warning";
      critical: "critical";
      alert: "alert";
      emergency: "emergency";
    }>;
    logger: z.ZodOptional<z.ZodString>;
    data: z.ZodUnknown;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/resources/updated">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    uri: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/resources/list_changed">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/tools/list_changed">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/prompts/list_changed">;
  params: z.ZodOptional<z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
  }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/tasks/status">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
  method: z.ZodLiteral<"notifications/elicitation/complete">;
  params: z.ZodObject<{
    _meta: z.ZodOptional<z.ZodObject<{
      /**
       * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
       */
      progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
      /**
       * If specified, this request is related to the provided task.
       */
      "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
        taskId: z.ZodString;
      }, z.core.$strip>>;
    }, z.core.$loose>>;
    elicitationId: z.ZodString;
  }, z.core.$strip>;
}, z.core.$strip>]>;
declare const ServerResultSchema: z.ZodUnion<readonly [z.ZodObject<{
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on `_meta` usage.
   */
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
}, z.core.$strict>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  protocolVersion: z.ZodString;
  capabilities: z.ZodObject<{
    experimental: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>>;
    logging: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    completions: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
    prompts: z.ZodOptional<z.ZodObject<{
      listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    resources: z.ZodOptional<z.ZodObject<{
      subscribe: z.ZodOptional<z.ZodBoolean>;
      listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    tools: z.ZodOptional<z.ZodObject<{
      listChanged: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    tasks: z.ZodOptional<z.ZodObject<{
      /**
       * Present if the server supports listing tasks.
       */
      list: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      /**
       * Present if the server supports cancelling tasks.
       */
      cancel: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
      /**
       * Capabilities for task creation on specific request types.
       */
      requests: z.ZodOptional<z.ZodObject<{
        /**
         * Task support for tool requests.
         */
        tools: z.ZodOptional<z.ZodObject<{
          call: z.ZodOptional<z.ZodType<JSONObject, unknown, z.core.$ZodTypeInternals<JSONObject, unknown>>>;
        }, z.core.$loose>>;
      }, z.core.$loose>>;
    }, z.core.$loose>>;
  }, z.core.$strip>;
  serverInfo: z.ZodObject<{
    version: z.ZodString;
    websiteUrl: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
  instructions: z.ZodOptional<z.ZodString>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  completion: z.ZodObject<{
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: z.ZodArray<z.ZodString>;
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: z.ZodOptional<z.ZodNumber>;
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$loose>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  description: z.ZodOptional<z.ZodString>;
  messages: z.ZodArray<z.ZodObject<{
    role: z.ZodEnum<{
      user: "user";
      assistant: "assistant";
    }>;
    content: z.ZodUnion<readonly [z.ZodObject<{
      type: z.ZodLiteral<"text">;
      text: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"image">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"audio">;
      data: z.ZodString;
      mimeType: z.ZodString;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      mimeType: z.ZodOptional<z.ZodString>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
      icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
        src: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
        theme: z.ZodOptional<z.ZodEnum<{
          light: "light";
          dark: "dark";
        }>>;
      }, z.core.$strip>>>;
      name: z.ZodString;
      title: z.ZodOptional<z.ZodString>;
      type: z.ZodLiteral<"resource_link">;
    }, z.core.$strip>, z.ZodObject<{
      type: z.ZodLiteral<"resource">;
      resource: z.ZodUnion<readonly [z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        text: z.ZodString;
      }, z.core.$strip>, z.ZodObject<{
        uri: z.ZodString;
        mimeType: z.ZodOptional<z.ZodString>;
        _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        blob: z.ZodString;
      }, z.core.$strip>]>;
      annotations: z.ZodOptional<z.ZodObject<{
        audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
          user: "user";
          assistant: "assistant";
        }>>>;
        priority: z.ZodOptional<z.ZodNumber>;
        lastModified: z.ZodOptional<z.ZodISODateTime>;
      }, z.core.$strip>>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>]>;
  }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  prompts: z.ZodArray<z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    arguments: z.ZodOptional<z.ZodArray<z.ZodObject<{
      name: z.ZodString;
      description: z.ZodOptional<z.ZodString>;
      required: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  resources: z.ZodArray<z.ZodObject<{
    uri: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  resourceTemplates: z.ZodArray<z.ZodObject<{
    uriTemplate: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  contents: z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    text: z.ZodString;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    blob: z.ZodString;
  }, z.core.$strip>]>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  content: z.ZodDefault<z.ZodArray<z.ZodUnion<readonly [z.ZodObject<{
    type: z.ZodLiteral<"text">;
    text: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"image">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"audio">;
    data: z.ZodString;
    mimeType: z.ZodString;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>, z.ZodObject<{
    uri: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    mimeType: z.ZodOptional<z.ZodString>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodObject<{}, z.core.$loose>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
    type: z.ZodLiteral<"resource_link">;
  }, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"resource">;
    resource: z.ZodUnion<readonly [z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      text: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
      uri: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
      blob: z.ZodString;
    }, z.core.$strip>]>;
    annotations: z.ZodOptional<z.ZodObject<{
      audience: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        user: "user";
        assistant: "assistant";
      }>>>;
      priority: z.ZodOptional<z.ZodNumber>;
      lastModified: z.ZodOptional<z.ZodISODateTime>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  }, z.core.$strip>]>>>;
  structuredContent: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
  isError: z.ZodOptional<z.ZodBoolean>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  tools: z.ZodArray<z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    inputSchema: z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
      required: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$catchall<z.ZodUnknown>>;
    outputSchema: z.ZodOptional<z.ZodObject<{
      type: z.ZodLiteral<"object">;
      properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<JSONValue, unknown, z.core.$ZodTypeInternals<JSONValue, unknown>>>>;
      required: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$catchall<z.ZodUnknown>>>;
    annotations: z.ZodOptional<z.ZodObject<{
      title: z.ZodOptional<z.ZodString>;
      readOnlyHint: z.ZodOptional<z.ZodBoolean>;
      destructiveHint: z.ZodOptional<z.ZodBoolean>;
      idempotentHint: z.ZodOptional<z.ZodBoolean>;
      openWorldHint: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    execution: z.ZodOptional<z.ZodObject<{
      taskSupport: z.ZodOptional<z.ZodEnum<{
        optional: "optional";
        required: "required";
        forbidden: "forbidden";
      }>>;
    }, z.core.$strip>>;
    _meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    icons: z.ZodOptional<z.ZodArray<z.ZodObject<{
      src: z.ZodString;
      mimeType: z.ZodOptional<z.ZodString>;
      sizes: z.ZodOptional<z.ZodArray<z.ZodString>>;
      theme: z.ZodOptional<z.ZodEnum<{
        light: "light";
        dark: "dark";
      }>>;
    }, z.core.$strip>>>;
    name: z.ZodString;
    title: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  taskId: z.ZodString;
  status: z.ZodEnum<{
    working: "working";
    input_required: "input_required";
    completed: "completed";
    failed: "failed";
    cancelled: "cancelled";
  }>;
  ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
  createdAt: z.ZodString;
  lastUpdatedAt: z.ZodString;
  pollInterval: z.ZodOptional<z.ZodNumber>;
  statusMessage: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  nextCursor: z.ZodOptional<z.ZodString>;
  tasks: z.ZodArray<z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
}, z.core.$loose>, z.ZodObject<{
  _meta: z.ZodOptional<z.ZodObject<{
    /**
     * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
     */
    progressToken: z.ZodOptional<z.ZodUnion<readonly [z.ZodString, z.ZodNumber]>>;
    /**
     * If specified, this request is related to the provided task.
     */
    "io.modelcontextprotocol/related-task": z.ZodOptional<z.ZodObject<{
      taskId: z.ZodString;
    }, z.core.$strip>>;
  }, z.core.$loose>>;
  task: z.ZodObject<{
    taskId: z.ZodString;
    status: z.ZodEnum<{
      working: "working";
      input_required: "input_required";
      completed: "completed";
      failed: "failed";
      cancelled: "cancelled";
    }>;
    ttl: z.ZodUnion<readonly [z.ZodNumber, z.ZodNull]>;
    createdAt: z.ZodString;
    lastUpdatedAt: z.ZodString;
    pollInterval: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
}, z.core.$loose>]>;
/**
 * Protocol errors are JSON-RPC errors that cross the wire as error responses.
 * They use numeric error codes from the {@linkcode ProtocolErrorCode} enum.
 */
declare class ProtocolError extends Error {
  readonly code: number;
  readonly data?: unknown | undefined;
  constructor(code: number, message: string, data?: unknown | undefined);
  /**
   * Factory method to create the appropriate error type based on the error code and data
   */
  static fromError(code: number, message: string, data?: unknown): ProtocolError;
}
/**
 * Specialized error type when a tool requires a URL mode elicitation.
 * This makes it nicer for the client to handle since there is specific data to work with instead of just a code to check against.
 */
declare class UrlElicitationRequiredError extends ProtocolError {
  constructor(elicitations: ElicitRequestURLParams[], message?: string);
  get elicitations(): ElicitRequestURLParams[];
}
type Primitive = string | number | boolean | bigint | null | undefined;
type Flatten<T$1> = T$1 extends Primitive ? T$1 : T$1 extends Array<infer U> ? Array<Flatten<U>> : T$1 extends Set<infer U> ? Set<Flatten<U>> : T$1 extends Map<infer K, infer V> ? Map<Flatten<K>, Flatten<V>> : T$1 extends object ? { [K in keyof T$1]: Flatten<T$1[K]> } : T$1;
type Infer<Schema extends z.ZodTypeAny> = Flatten<z.infer<Schema>>;
/**
 * Information about the incoming request.
 */
interface RequestInfo {
  /**
   * The headers of the request.
   */
  headers: Headers;
}
/**
 * Extra information about a message.
 */
interface MessageExtraInfo {
  /**
   * The request information.
   */
  requestInfo?: RequestInfo;
  /**
   * The authentication information.
   */
  authInfo?: AuthInfo;
  /**
   * Callback to close the SSE stream for this request, triggering client reconnection.
   * Only available when using {@linkcode @modelcontextprotocol/node!streamableHttp.NodeStreamableHTTPServerTransport | NodeStreamableHTTPServerTransport} with eventStore configured.
   */
  closeSSEStream?: () => void;
  /**
   * Callback to close the standalone GET SSE stream, triggering client reconnection.
   * Only available when using {@linkcode @modelcontextprotocol/node!streamableHttp.NodeStreamableHTTPServerTransport | NodeStreamableHTTPServerTransport} with eventStore configured.
   */
  closeStandaloneSSEStream?: () => void;
}
type ProgressToken = Infer<typeof ProgressTokenSchema>;
type Cursor = Infer<typeof CursorSchema>;
type Request = Infer<typeof RequestSchema>;
type TaskAugmentedRequestParams = Infer<typeof TaskAugmentedRequestParamsSchema>;
type RequestMeta = Infer<typeof RequestMetaSchema>;
type MetaObject = Record<string, unknown>;
type RequestMetaObject = RequestMeta;
type Notification = Infer<typeof NotificationSchema>;
type Result = Infer<typeof ResultSchema>;
type RequestId = Infer<typeof RequestIdSchema>;
type JSONRPCRequest = Infer<typeof JSONRPCRequestSchema>;
type JSONRPCNotification = Infer<typeof JSONRPCNotificationSchema>;
type JSONRPCResponse = Infer<typeof JSONRPCResponseSchema>;
type JSONRPCErrorResponse = Infer<typeof JSONRPCErrorResponseSchema>;
type JSONRPCResultResponse = Infer<typeof JSONRPCResultResponseSchema>;
type JSONRPCMessage = Infer<typeof JSONRPCMessageSchema>;
type RequestParams = Infer<typeof BaseRequestParamsSchema>;
type NotificationParams = Infer<typeof NotificationsParamsSchema>;
type EmptyResult = Infer<typeof EmptyResultSchema>;
type CancelledNotificationParams = Infer<typeof CancelledNotificationParamsSchema>;
type CancelledNotification = Infer<typeof CancelledNotificationSchema>;
type Icon = Infer<typeof IconSchema>;
type Icons = Infer<typeof IconsSchema>;
type BaseMetadata = Infer<typeof BaseMetadataSchema>;
type Annotations = Infer<typeof AnnotationsSchema>;
type Role = Infer<typeof RoleSchema>;
type Implementation = Infer<typeof ImplementationSchema>;
type ClientCapabilities = Infer<typeof ClientCapabilitiesSchema>;
type InitializeRequestParams = Infer<typeof InitializeRequestParamsSchema>;
type InitializeRequest = Infer<typeof InitializeRequestSchema>;
type ServerCapabilities = Infer<typeof ServerCapabilitiesSchema>;
type InitializeResult = Infer<typeof InitializeResultSchema>;
type InitializedNotification = Infer<typeof InitializedNotificationSchema>;
type PingRequest = Infer<typeof PingRequestSchema>;
type Progress = Infer<typeof ProgressSchema>;
type ProgressNotificationParams = Infer<typeof ProgressNotificationParamsSchema>;
type ProgressNotification = Infer<typeof ProgressNotificationSchema>;
type Task = Infer<typeof TaskSchema>;
type TaskStatus = Infer<typeof TaskStatusSchema>;
type TaskCreationParams = Infer<typeof TaskCreationParamsSchema>;
type TaskMetadata = Infer<typeof TaskMetadataSchema>;
type RelatedTaskMetadata = Infer<typeof RelatedTaskMetadataSchema>;
type CreateTaskResult = Infer<typeof CreateTaskResultSchema>;
type TaskStatusNotificationParams = Infer<typeof TaskStatusNotificationParamsSchema>;
type TaskStatusNotification = Infer<typeof TaskStatusNotificationSchema>;
type GetTaskRequest = Infer<typeof GetTaskRequestSchema>;
type GetTaskResult = Infer<typeof GetTaskResultSchema>;
type GetTaskPayloadRequest = Infer<typeof GetTaskPayloadRequestSchema>;
type ListTasksRequest = Infer<typeof ListTasksRequestSchema>;
type ListTasksResult = Infer<typeof ListTasksResultSchema>;
type CancelTaskRequest = Infer<typeof CancelTaskRequestSchema>;
type CancelTaskResult = Infer<typeof CancelTaskResultSchema>;
type GetTaskPayloadResult = Infer<typeof GetTaskPayloadResultSchema>;
type PaginatedRequestParams = Infer<typeof PaginatedRequestParamsSchema>;
type PaginatedRequest = Infer<typeof PaginatedRequestSchema>;
type PaginatedResult = Infer<typeof PaginatedResultSchema>;
type ResourceContents = Infer<typeof ResourceContentsSchema>;
type TextResourceContents = Infer<typeof TextResourceContentsSchema>;
type BlobResourceContents = Infer<typeof BlobResourceContentsSchema>;
type Resource = Infer<typeof ResourceSchema>;
type ResourceTemplateType = Infer<typeof ResourceTemplateSchema>;
type ListResourcesRequest = Infer<typeof ListResourcesRequestSchema>;
type ListResourcesResult = Infer<typeof ListResourcesResultSchema>;
type ListResourceTemplatesRequest = Infer<typeof ListResourceTemplatesRequestSchema>;
type ListResourceTemplatesResult = Infer<typeof ListResourceTemplatesResultSchema>;
type ResourceRequestParams = Infer<typeof ResourceRequestParamsSchema>;
type ReadResourceRequestParams = Infer<typeof ReadResourceRequestParamsSchema>;
type ReadResourceRequest = Infer<typeof ReadResourceRequestSchema>;
type ReadResourceResult = Infer<typeof ReadResourceResultSchema>;
type ResourceListChangedNotification = Infer<typeof ResourceListChangedNotificationSchema>;
type SubscribeRequestParams = Infer<typeof SubscribeRequestParamsSchema>;
type SubscribeRequest = Infer<typeof SubscribeRequestSchema>;
type UnsubscribeRequestParams = Infer<typeof UnsubscribeRequestParamsSchema>;
type UnsubscribeRequest = Infer<typeof UnsubscribeRequestSchema>;
type ResourceUpdatedNotificationParams = Infer<typeof ResourceUpdatedNotificationParamsSchema>;
type ResourceUpdatedNotification = Infer<typeof ResourceUpdatedNotificationSchema>;
type PromptArgument = Infer<typeof PromptArgumentSchema>;
type Prompt = Infer<typeof PromptSchema>;
type ListPromptsRequest = Infer<typeof ListPromptsRequestSchema>;
type ListPromptsResult = Infer<typeof ListPromptsResultSchema>;
type GetPromptRequestParams = Infer<typeof GetPromptRequestParamsSchema>;
type GetPromptRequest = Infer<typeof GetPromptRequestSchema>;
type TextContent = Infer<typeof TextContentSchema>;
type ImageContent = Infer<typeof ImageContentSchema>;
type AudioContent = Infer<typeof AudioContentSchema>;
type ToolUseContent = Infer<typeof ToolUseContentSchema>;
type ToolResultContent = Infer<typeof ToolResultContentSchema>;
type EmbeddedResource = Infer<typeof EmbeddedResourceSchema>;
type ResourceLink = Infer<typeof ResourceLinkSchema>;
type ContentBlock = Infer<typeof ContentBlockSchema>;
type PromptMessage = Infer<typeof PromptMessageSchema>;
type GetPromptResult = Infer<typeof GetPromptResultSchema>;
type PromptListChangedNotification = Infer<typeof PromptListChangedNotificationSchema>;
type ToolAnnotations = Infer<typeof ToolAnnotationsSchema>;
type ToolExecution = Infer<typeof ToolExecutionSchema>;
type Tool = Infer<typeof ToolSchema>;
type ListToolsRequest = Infer<typeof ListToolsRequestSchema>;
type ListToolsResult = Infer<typeof ListToolsResultSchema>;
type CallToolRequestParams = Infer<typeof CallToolRequestParamsSchema>;
type CallToolResult = Infer<typeof CallToolResultSchema>;
type CompatibilityCallToolResult = Infer<typeof CompatibilityCallToolResultSchema>;
type CallToolRequest = Infer<typeof CallToolRequestSchema>;
type ToolListChangedNotification = Infer<typeof ToolListChangedNotificationSchema>;
type LoggingLevel = Infer<typeof LoggingLevelSchema>;
type SetLevelRequestParams = Infer<typeof SetLevelRequestParamsSchema>;
type SetLevelRequest = Infer<typeof SetLevelRequestSchema>;
type LoggingMessageNotificationParams = Infer<typeof LoggingMessageNotificationParamsSchema>;
type LoggingMessageNotification = Infer<typeof LoggingMessageNotificationSchema>;
type ToolChoice = Infer<typeof ToolChoiceSchema>;
type ModelHint = Infer<typeof ModelHintSchema>;
type ModelPreferences = Infer<typeof ModelPreferencesSchema>;
type SamplingContent = Infer<typeof SamplingContentSchema>;
type SamplingMessageContentBlock = Infer<typeof SamplingMessageContentBlockSchema>;
type SamplingMessage = Infer<typeof SamplingMessageSchema>;
type CreateMessageRequestParams = Infer<typeof CreateMessageRequestParamsSchema>;
type CreateMessageRequest = Infer<typeof CreateMessageRequestSchema>;
type CreateMessageResult = Infer<typeof CreateMessageResultSchema>;
type CreateMessageResultWithTools = Infer<typeof CreateMessageResultWithToolsSchema>;
/**
 * {@linkcode CreateMessageRequestParams} without tools - for backwards-compatible overload.
 * Excludes tools/toolChoice to indicate they should not be provided.
 */
type CreateMessageRequestParamsBase = Omit<CreateMessageRequestParams, 'tools' | 'toolChoice'>;
/**
 * {@linkcode CreateMessageRequestParams} with required tools - for tool-enabled overload.
 */
interface CreateMessageRequestParamsWithTools extends CreateMessageRequestParams {
  tools: Tool[];
}
type BooleanSchema = Infer<typeof BooleanSchemaSchema>;
type StringSchema = Infer<typeof StringSchemaSchema>;
type NumberSchema = Infer<typeof NumberSchemaSchema>;
type EnumSchema = Infer<typeof EnumSchemaSchema>;
type UntitledSingleSelectEnumSchema = Infer<typeof UntitledSingleSelectEnumSchemaSchema>;
type TitledSingleSelectEnumSchema = Infer<typeof TitledSingleSelectEnumSchemaSchema>;
type LegacyTitledEnumSchema = Infer<typeof LegacyTitledEnumSchemaSchema>;
type UntitledMultiSelectEnumSchema = Infer<typeof UntitledMultiSelectEnumSchemaSchema>;
type TitledMultiSelectEnumSchema = Infer<typeof TitledMultiSelectEnumSchemaSchema>;
type SingleSelectEnumSchema = Infer<typeof SingleSelectEnumSchemaSchema>;
type MultiSelectEnumSchema = Infer<typeof MultiSelectEnumSchemaSchema>;
type PrimitiveSchemaDefinition = Infer<typeof PrimitiveSchemaDefinitionSchema>;
type ElicitRequestParams = Infer<typeof ElicitRequestParamsSchema>;
type ElicitRequestFormParams = Infer<typeof ElicitRequestFormParamsSchema>;
type ElicitRequestURLParams = Infer<typeof ElicitRequestURLParamsSchema>;
type ElicitRequest = Infer<typeof ElicitRequestSchema>;
type ElicitationCompleteNotificationParams = Infer<typeof ElicitationCompleteNotificationParamsSchema>;
type ElicitationCompleteNotification = Infer<typeof ElicitationCompleteNotificationSchema>;
type ElicitResult = Infer<typeof ElicitResultSchema>;
type ResourceTemplateReference = Infer<typeof ResourceTemplateReferenceSchema>;
type PromptReference = Infer<typeof PromptReferenceSchema>;
type CompleteRequestParams = Infer<typeof CompleteRequestParamsSchema>;
type CompleteRequest = Infer<typeof CompleteRequestSchema>;
type CompleteRequestResourceTemplate = ExpandRecursively<CompleteRequest & {
  params: CompleteRequestParams & {
    ref: ResourceTemplateReference;
  };
}>;
type CompleteRequestPrompt = ExpandRecursively<CompleteRequest & {
  params: CompleteRequestParams & {
    ref: PromptReference;
  };
}>;
type CompleteResult = Infer<typeof CompleteResultSchema>;
type Root = Infer<typeof RootSchema>;
type ListRootsRequest = Infer<typeof ListRootsRequestSchema>;
type ListRootsResult = Infer<typeof ListRootsResultSchema>;
type RootsListChangedNotification = Infer<typeof RootsListChangedNotificationSchema>;
type ClientRequest = Infer<typeof ClientRequestSchema>;
type ClientNotification = Infer<typeof ClientNotificationSchema>;
type ClientResult = Infer<typeof ClientResultSchema>;
type ServerRequest = Infer<typeof ServerRequestSchema>;
type ServerNotification = Infer<typeof ServerNotificationSchema>;
type ServerResult = Infer<typeof ServerResultSchema>;
type MethodToTypeMap<U$1> = { [T in U$1 as T extends {
  method: infer M extends string;
} ? M : never]: T };
type RequestMethod = ClientRequest['method'] | ServerRequest['method'];
type NotificationMethod = ClientNotification['method'] | ServerNotification['method'];
type RequestTypeMap = MethodToTypeMap<ClientRequest | ServerRequest>;
type NotificationTypeMap = MethodToTypeMap<ClientNotification | ServerNotification>;
type ResultTypeMap = {
  ping: EmptyResult;
  initialize: InitializeResult;
  'completion/complete': CompleteResult;
  'logging/setLevel': EmptyResult;
  'prompts/get': GetPromptResult;
  'prompts/list': ListPromptsResult;
  'resources/list': ListResourcesResult;
  'resources/templates/list': ListResourceTemplatesResult;
  'resources/read': ReadResourceResult;
  'resources/subscribe': EmptyResult;
  'resources/unsubscribe': EmptyResult;
  'tools/call': CallToolResult | CreateTaskResult;
  'tools/list': ListToolsResult;
  'sampling/createMessage': CreateMessageResult | CreateMessageResultWithTools | CreateTaskResult;
  'elicitation/create': ElicitResult | CreateTaskResult;
  'roots/list': ListRootsResult;
  'tasks/get': GetTaskResult;
  'tasks/result': Result;
  'tasks/list': ListTasksResult;
  'tasks/cancel': CancelTaskResult;
};
/**
 * Gets the Zod schema for validating results of a given request method.
 * @see getRequestSchema for explanation of the internal type assertion.
 */
declare function getResultSchema<M extends RequestMethod>(method: M): z.ZodType<ResultTypeMap[M]>;
/**
 * Gets the Zod schema for a given request method.
 * The return type is a ZodType that parses to RequestTypeMap[M], allowing callers
 * to use schema.parse() without needing additional type assertions.
 *
 * Note: The internal cast is necessary because TypeScript can't correlate the
 * Record-based schema lookup with the MethodToTypeMap-based RequestTypeMap
 * when M is a generic type parameter. Both compute to the same type at
 * instantiation, but TypeScript can't prove this statically.
 */
declare function getRequestSchema<M extends RequestMethod>(method: M): z.ZodType<RequestTypeMap[M]>;
/**
 * Gets the Zod schema for a given notification method.
 * @see getRequestSchema for explanation of the internal type assertion.
 */
declare function getNotificationSchema<M extends NotificationMethod>(method: M): z.ZodType<NotificationTypeMap[M]>;
//#endregion
//#region ../core/src/shared/metadataUtils.d.ts
/**
 * Utilities for working with {@linkcode BaseMetadata} objects.
 */
/**
 * Gets the display name for an object with {@linkcode BaseMetadata}.
 * For tools, the precedence is: `title` → {@linkcode index.ToolAnnotations | annotations}.`title` → `name`
 * For other objects: `title` → `name`
 * This implements the spec requirement: "if no title is provided, name should be used for display purposes"
 */
declare function getDisplayName(metadata: BaseMetadata | (BaseMetadata & {
  annotations?: {
    title?: string;
  };
})): string;
//#endregion
//#region ../core/src/experimental/tasks/interfaces.d.ts
/**
 * Server context with guaranteed task store for task creation.
 * @experimental
 */
type CreateTaskServerContext = ServerContext & {
  task: {
    store: RequestTaskStore;
    requestedTtl?: number | null;
  };
};
/**
 * Server context with guaranteed task ID and store for task operations.
 * @experimental
 */
type TaskServerContext = ServerContext & {
  task: {
    id: string;
    store: RequestTaskStore;
    requestedTtl?: number | null;
  };
};
/**
 * Task-specific execution configuration.
 * `taskSupport` cannot be `'forbidden'` for task-based tools.
 * @experimental
 */
type TaskToolExecution<TaskSupport = ToolExecution['taskSupport']> = Omit<ToolExecution, 'taskSupport'> & {
  taskSupport: TaskSupport extends 'forbidden' | undefined ? never : TaskSupport;
};
/**
 * Represents a message queued for side-channel delivery via tasks/result.
 *
 * This is a serializable data structure that can be stored in external systems.
 * All fields are JSON-serializable.
 */
type QueuedMessage = QueuedRequest | QueuedNotification | QueuedResponse | QueuedError;
interface BaseQueuedMessage {
  /** Type of message */
  type: string;
  /** When the message was queued (milliseconds since epoch) */
  timestamp: number;
}
interface QueuedRequest extends BaseQueuedMessage {
  type: 'request';
  /** The actual JSONRPC request */
  message: JSONRPCRequest;
}
interface QueuedNotification extends BaseQueuedMessage {
  type: 'notification';
  /** The actual JSONRPC notification */
  message: JSONRPCNotification;
}
interface QueuedResponse extends BaseQueuedMessage {
  type: 'response';
  /** The actual JSONRPC response */
  message: JSONRPCResultResponse;
}
interface QueuedError extends BaseQueuedMessage {
  type: 'error';
  /** The actual JSONRPC error */
  message: JSONRPCErrorResponse;
}
/**
 * Interface for managing per-task FIFO message queues.
 *
 * Similar to {@linkcode TaskStore}, this allows pluggable queue implementations
 * (in-memory, Redis, other distributed queues, etc.).
 *
 * Each method accepts taskId and optional sessionId parameters to enable
 * a single queue instance to manage messages for multiple tasks, with
 * isolation based on task ID and session ID.
 *
 * All methods are async to support external storage implementations.
 * All data in {@linkcode QueuedMessage} must be JSON-serializable.
 *
 * @see {@linkcode InMemoryTaskMessageQueue} for a reference implementation
 * @experimental
 */
interface TaskMessageQueue {
  /**
   * Adds a message to the end of the queue for a specific task.
   * Atomically checks queue size and throws if maxSize would be exceeded.
   * @param taskId The task identifier
   * @param message The message to enqueue
   * @param sessionId Optional session ID for binding the operation to a specific session
   * @param maxSize Optional maximum queue size - if specified and queue is full, throws an error
   * @throws Error if maxSize is specified and would be exceeded
   */
  enqueue(taskId: string, message: QueuedMessage, sessionId?: string, maxSize?: number): Promise<void>;
  /**
   * Removes and returns the first message from the queue for a specific task.
   * @param taskId The task identifier
   * @param sessionId Optional session ID for binding the query to a specific session
   * @returns The first message, or `undefined` if the queue is empty
   */
  dequeue(taskId: string, sessionId?: string): Promise<QueuedMessage | undefined>;
  /**
   * Removes and returns all messages from the queue for a specific task.
   * Used when tasks are cancelled or failed to clean up pending messages.
   * @param taskId The task identifier
   * @param sessionId Optional session ID for binding the query to a specific session
   * @returns Array of all messages that were in the queue
   */
  dequeueAll(taskId: string, sessionId?: string): Promise<QueuedMessage[]>;
}
/**
 * Task creation options.
 * @experimental
 */
interface CreateTaskOptions {
  /**
   * Time in milliseconds to keep task results available after completion.
   * If `null`, the task has unlimited lifetime until manually cleaned up.
   */
  ttl?: number | null;
  /**
   * Time in milliseconds to wait between task status requests.
   */
  pollInterval?: number;
  /**
   * Additional context to pass to the task store.
   */
  context?: Record<string, unknown>;
}
/**
 * Interface for storing and retrieving task state and results.
 *
 * Similar to {@linkcode Transport}, this allows pluggable task storage implementations
 * (in-memory, database, distributed cache, etc.).
 *
 * @see {@linkcode InMemoryTaskStore} for a reference implementation
 * @experimental
 */
interface TaskStore {
  /**
   * Creates a new task with the given creation parameters and original request.
   * The implementation must generate a unique taskId and createdAt timestamp.
   *
   * TTL Management:
   * - The implementation receives the TTL suggested by the requestor via `taskParams.ttl`
   * - The implementation MAY override the requested TTL (e.g., to enforce limits)
   * - The actual TTL used MUST be returned in the {@linkcode Task} object
   * - `null` TTL indicates unlimited task lifetime (no automatic cleanup)
   * - Cleanup SHOULD occur automatically after TTL expires, regardless of task status
   *
   * @param taskParams - The task creation parameters from the request (ttl, pollInterval)
   * @param requestId - The JSON-RPC request ID
   * @param request - The original request that triggered task creation
   * @param sessionId - Optional session ID for binding the task to a specific session
   * @returns The created {@linkcode Task} object
   */
  createTask(taskParams: CreateTaskOptions, requestId: RequestId, request: Request, sessionId?: string): Promise<Task>;
  /**
   * Gets the current status of a task.
   *
   * @param taskId - The task identifier
   * @param sessionId - Optional session ID for binding the query to a specific session
   * @returns The {@linkcode Task} object, or `null` if it does not exist
   */
  getTask(taskId: string, sessionId?: string): Promise<Task | null>;
  /**
   * Stores the result of a task and sets its final status.
   *
   * @param taskId - The task identifier
   * @param status - The final status: `'completed'` for success, `'failed'` for errors
   * @param result - The result to store
   * @param sessionId - Optional session ID for binding the operation to a specific session
   */
  storeTaskResult(taskId: string, status: 'completed' | 'failed', result: Result, sessionId?: string): Promise<void>;
  /**
   * Retrieves the stored result of a task.
   *
   * @param taskId - The task identifier
   * @param sessionId - Optional session ID for binding the query to a specific session
   * @returns The stored result
   */
  getTaskResult(taskId: string, sessionId?: string): Promise<Result>;
  /**
   * Updates a task's status (e.g., to `'cancelled'`, `'failed'`, `'completed'`).
   *
   * @param taskId - The task identifier
   * @param status - The new status
   * @param statusMessage - Optional diagnostic message for failed tasks or other status information
   * @param sessionId - Optional session ID for binding the operation to a specific session
   */
  updateTaskStatus(taskId: string, status: Task['status'], statusMessage?: string, sessionId?: string): Promise<void>;
  /**
   * Lists tasks, optionally starting from a pagination cursor.
   *
   * @param cursor - Optional cursor for pagination
   * @param sessionId - Optional session ID for binding the query to a specific session
   * @returns An object containing the tasks array and an optional nextCursor
   */
  listTasks(cursor?: string, sessionId?: string): Promise<{
    tasks: Task[];
    nextCursor?: string;
  }>;
}
/**
 * Checks if a task status represents a terminal state.
 * Terminal states are those where the task has finished and will not change.
 *
 * @param status - The task status to check
 * @returns `true` if the status is terminal (`completed`, `failed`, or `cancelled`)
 * @experimental
 */
declare function isTerminal(status: Task['status']): boolean;
//#endregion
//#region ../core/src/util/schema.d.ts
/**
 * Base type for any Zod schema.
 * This is the canonical type to use when accepting user-provided schemas.
 */
type AnySchema = z.core.$ZodType;
/**
 * A Zod schema for objects specifically (not unions).
 * Use this when you need to constrain to ZodObject schemas.
 */
type AnyObjectSchema = z.core.$ZodObject;
/**
 * Extracts the input type from a Zod schema.
 */
type SchemaInput<T$1 extends AnySchema> = z.input<T$1>;
/**
 * Extracts the output type from a Zod schema.
 */
type SchemaOutput<T$1 extends AnySchema> = z.output<T$1>;
/**
 * Converts a Zod schema to JSON Schema.
 */
declare function schemaToJson(schema: AnySchema, options?: {
  io?: 'input' | 'output';
}): Record<string, unknown>;
/**
 * Parses data against a Zod schema (synchronous).
 * Returns a discriminated union with success/error.
 */
declare function parseSchema<T$1 extends AnySchema>(schema: T$1, data: unknown): {
  success: true;
  data: z.output<T$1>;
} | {
  success: false;
  error: z.core.$ZodError;
};
/**
 * Parses data against a Zod schema (asynchronous).
 * Returns a discriminated union with success/error.
 */
declare function parseSchemaAsync<T$1 extends AnySchema>(schema: T$1, data: unknown): Promise<{
  success: true;
  data: z.output<T$1>;
} | {
  success: false;
  error: z.core.$ZodError;
}>;
/**
 * Gets the shape of an object schema.
 * Returns undefined if the schema is not an object schema.
 */
declare function getSchemaShape(schema: AnySchema): Record<string, AnySchema> | undefined;
/**
 * Gets the description from a schema if it has one.
 */
declare function getSchemaDescription(schema: AnySchema): string | undefined;
/**
 * Checks if a schema is optional (accepts undefined).
 * Uses the public .type property which works in both zod/v4 and zod/v4/mini.
 */
declare function isOptionalSchema(schema: AnySchema): boolean;
/**
 * Unwraps an optional schema to get the inner schema.
 * If the schema is not optional, returns it unchanged.
 * Uses the public .def.innerType property which works in both zod/v4 and zod/v4/mini.
 */
declare function unwrapOptionalSchema(schema: AnySchema): AnySchema;
//#endregion
//#region ../core/src/shared/responseMessage.d.ts
/**
 * Base message type for the response stream.
 */
interface BaseResponseMessage {
  type: string;
}
/**
 * Task status update message.
 *
 * Yielded on each poll iteration while the task is active (e.g. while
 * `working`). May be emitted multiple times with the same status.
 */
interface TaskStatusMessage extends BaseResponseMessage {
  type: 'taskStatus';
  task: Task;
}
/**
 * Task created message.
 *
 * Yielded once when the server creates a new task for a long-running operation.
 * This is always the first message for task-augmented requests.
 */
interface TaskCreatedMessage extends BaseResponseMessage {
  type: 'taskCreated';
  task: Task;
}
/**
 * Final result message.
 *
 * Yielded once when the operation completes successfully. Terminal — no further
 * messages will follow.
 */
interface ResultMessage<T$1 extends Result> extends BaseResponseMessage {
  type: 'result';
  result: T$1;
}
/**
 * Error message.
 *
 * Yielded once if the operation fails. Terminal — no further messages will follow.
 */
interface ErrorMessage extends BaseResponseMessage {
  type: 'error';
  error: Error;
}
/**
 * Union of all message types yielded by task-aware streaming APIs such as
 * {@linkcode @modelcontextprotocol/client!experimental/tasks/client.ExperimentalClientTasks#callToolStream | callToolStream()},
 * {@linkcode @modelcontextprotocol/client!experimental/tasks/client.ExperimentalClientTasks#requestStream | ExperimentalClientTasks.requestStream()}, and
 * {@linkcode @modelcontextprotocol/server!experimental/tasks/server.ExperimentalServerTasks#requestStream | ExperimentalServerTasks.requestStream()}.
 *
 * A typical sequence is:
 * 1. `taskCreated` — task is registered (once)
 * 2. `taskStatus`  — zero or more progress updates
 * 3. `result` **or** `error` — terminal message (once)
 *
 * Progress notifications are handled through the existing {@linkcode index.RequestOptions | onprogress} callback.
 * Side-channeled messages (server requests/notifications) are handled through registered handlers.
 */
type ResponseMessage<T$1 extends Result> = TaskStatusMessage | TaskCreatedMessage | ResultMessage<T$1> | ErrorMessage;
type AsyncGeneratorValue<T$1> = T$1 extends AsyncGenerator<infer U> ? U : never;
/**
 * Collects all values from an async generator into an array.
 */
declare function toArrayAsync<T$1 extends AsyncGenerator<unknown>>(it: T$1): Promise<AsyncGeneratorValue<T$1>[]>;
/**
 * Consumes a {@linkcode ResponseMessage} stream and returns the final result,
 * discarding intermediate `taskCreated` and `taskStatus` messages. Throws
 * if an `error` message is received or the stream ends without a result.
 */
declare function takeResult<T$1 extends Result, U$1 extends AsyncGenerator<ResponseMessage<T$1>>>(it: U$1): Promise<T$1>;
//#endregion
//#region ../core/src/shared/transport.d.ts
type FetchLike = (url: string | URL, init?: RequestInit) => Promise<Response>;
/**
 * Normalizes `HeadersInit` to a plain `Record<string, string>` for manipulation.
 * Handles `Headers` objects, arrays of tuples, and plain objects.
 */
declare function normalizeHeaders(headers: RequestInit['headers'] | undefined): Record<string, string>;
/**
 * Creates a fetch function that includes base `RequestInit` options.
 * This ensures requests inherit settings like credentials, mode, headers, etc. from the base init.
 *
 * @param baseFetch - The base fetch function to wrap (defaults to global `fetch`)
 * @param baseInit - The base `RequestInit` to merge with each request
 * @returns A wrapped fetch function that merges base options with call-specific options
 */
declare function createFetchWithInit(baseFetch?: FetchLike, baseInit?: RequestInit): FetchLike;
/**
 * Options for sending a JSON-RPC message.
 */
type TransportSendOptions = {
  /**
   * If present, `relatedRequestId` is used to indicate to the transport which incoming request to associate this outgoing message with.
   */
  relatedRequestId?: RequestId;
  /**
   * The resumption token used to continue long-running requests that were interrupted.
   *
   * This allows clients to reconnect and continue from where they left off, if supported by the transport.
   */
  resumptionToken?: string;
  /**
   * A callback that is invoked when the resumption token changes, if supported by the transport.
   *
   * This allows clients to persist the latest token for potential reconnection.
   */
  onresumptiontoken?: (token: string) => void;
};
/**
 * Describes the minimal contract for an MCP transport that a client or server can communicate over.
 */
interface Transport {
  /**
   * Starts processing messages on the transport, including any connection steps that might need to be taken.
   *
   * This method should only be called after callbacks are installed, or else messages may be lost.
   *
   * NOTE: This method should not be called explicitly when using {@linkcode @modelcontextprotocol/client!client/client.Client | Client}, {@linkcode @modelcontextprotocol/server!server/server.Server | Server}, or {@linkcode @modelcontextprotocol/server!index.Protocol | Protocol} classes, as they will implicitly call {@linkcode Transport.start | start()}.
   */
  start(): Promise<void>;
  /**
   * Sends a JSON-RPC message (request or response).
   *
   * If present, `relatedRequestId` is used to indicate to the transport which incoming request to associate this outgoing message with.
   */
  send(message: JSONRPCMessage, options?: TransportSendOptions): Promise<void>;
  /**
   * Closes the connection.
   */
  close(): Promise<void>;
  /**
   * Callback for when the connection is closed for any reason.
   *
   * This should be invoked when {@linkcode Transport.close | close()} is called as well.
   */
  onclose?: () => void;
  /**
   * Callback for when an error occurs.
   *
   * Note that errors are not necessarily fatal; they are used for reporting any kind of exceptional condition out of band.
   */
  onerror?: (error: Error) => void;
  /**
   * Callback for when a message (request or response) is received over the connection.
   *
   * Includes the {@linkcode MessageExtraInfo.requestInfo | requestInfo} and {@linkcode MessageExtraInfo.authInfo | authInfo} if the transport is authenticated.
   *
   * The {@linkcode MessageExtraInfo.requestInfo | requestInfo} can be used to get the original request information (headers, etc.)
   */
  onmessage?: <T$1 extends JSONRPCMessage>(message: T$1, extra?: MessageExtraInfo) => void;
  /**
   * The session ID generated for this connection.
   */
  sessionId?: string;
  /**
   * Sets the protocol version used for the connection (called when the initialize response is received).
   */
  setProtocolVersion?: (version: string) => void;
  /**
   * Sets the supported protocol versions for header validation (called during connect).
   * This allows the server to pass its supported versions to the transport.
   */
  setSupportedProtocolVersions?: (versions: string[]) => void;
}
//#endregion
//#region ../core/src/shared/protocol.d.ts
/**
 * Callback for progress notifications.
 */
type ProgressCallback = (progress: Progress) => void;
/**
 * Additional initialization options.
 */
type ProtocolOptions = {
  /**
   * Protocol versions supported. First version is preferred (sent by client,
   * used as fallback by server). Passed to transport during {@linkcode Protocol.connect | connect()}.
   *
   * @default {@linkcode SUPPORTED_PROTOCOL_VERSIONS}
   */
  supportedProtocolVersions?: string[];
  /**
   * Whether to restrict emitted requests to only those that the remote side has indicated that they can handle, through their advertised capabilities.
   *
   * Note that this DOES NOT affect checking of _local_ side capabilities, as it is considered a logic error to mis-specify those.
   *
   * Currently this defaults to `false`, for backwards compatibility with SDK versions that did not advertise capabilities correctly. In future, this will default to `true`.
   */
  enforceStrictCapabilities?: boolean;
  /**
   * An array of notification method names that should be automatically debounced.
   * Any notifications with a method in this list will be coalesced if they
   * occur in the same tick of the event loop.
   * e.g., `['notifications/tools/list_changed']`
   */
  debouncedNotificationMethods?: string[];
  /**
   * Optional task storage implementation. If provided, enables task-related request handlers
   * and provides task storage capabilities to request handlers.
   */
  taskStore?: TaskStore;
  /**
   * Optional task message queue implementation for managing server-initiated messages
   * that will be delivered through the tasks/result response stream.
   */
  taskMessageQueue?: TaskMessageQueue;
  /**
   * Default polling interval (in milliseconds) for task status checks when no `pollInterval`
   * is provided by the server. Defaults to 5000ms if not specified.
   */
  defaultTaskPollInterval?: number;
  /**
   * Maximum number of messages that can be queued per task for side-channel delivery.
   * If undefined, the queue size is unbounded.
   * When the limit is exceeded, the {@linkcode TaskMessageQueue} implementation's {@linkcode TaskMessageQueue.enqueue | enqueue()} method
   * will throw an error. It's the implementation's responsibility to handle overflow
   * appropriately (e.g., by failing the task, dropping messages, etc.).
   */
  maxTaskQueueSize?: number;
};
/**
 * The default request timeout, in milliseconds.
 */
declare const DEFAULT_REQUEST_TIMEOUT_MSEC = 60000;
/**
 * Options that can be given per request.
 */
type RequestOptions = {
  /**
   * If set, requests progress notifications from the remote end (if supported). When progress notifications are received, this callback will be invoked.
   *
   * For task-augmented requests: progress notifications continue after {@linkcode CreateTaskResult} is returned and stop automatically when the task reaches a terminal status.
   */
  onprogress?: ProgressCallback;
  /**
   * Can be used to cancel an in-flight request. This will cause an `AbortError` to be raised from {@linkcode Protocol.request | request()}.
   */
  signal?: AbortSignal;
  /**
   * A timeout (in milliseconds) for this request. If exceeded, an {@linkcode SdkError} with code {@linkcode SdkErrorCode.RequestTimeout} will be raised from {@linkcode Protocol.request | request()}.
   *
   * If not specified, {@linkcode DEFAULT_REQUEST_TIMEOUT_MSEC} will be used as the timeout.
   */
  timeout?: number;
  /**
   * If `true`, receiving a progress notification will reset the request timeout.
   * This is useful for long-running operations that send periodic progress updates.
   * Default: `false`
   */
  resetTimeoutOnProgress?: boolean;
  /**
   * Maximum total time (in milliseconds) to wait for a response.
   * If exceeded, an {@linkcode SdkError} with code {@linkcode SdkErrorCode.RequestTimeout} will be raised, regardless of progress notifications.
   * If not specified, there is no maximum total timeout.
   */
  maxTotalTimeout?: number;
  /**
   * If provided, augments the request with task creation parameters to enable call-now, fetch-later execution patterns.
   */
  task?: TaskCreationParams;
  /**
   * If provided, associates this request with a related task.
   */
  relatedTask?: RelatedTaskMetadata;
} & TransportSendOptions;
/**
 * Options that can be given per notification.
 */
type NotificationOptions = {
  /**
   * May be used to indicate to the transport which incoming request to associate this outgoing notification with.
   */
  relatedRequestId?: RequestId;
  /**
   * If provided, associates this notification with a related task.
   */
  relatedTask?: RelatedTaskMetadata;
};
/**
 * Options that can be given per request.
 */
type TaskRequestOptions = Omit<RequestOptions, 'relatedTask'>;
/**
 * Request-scoped {@linkcode TaskStore} interface.
 */
interface RequestTaskStore {
  /**
   * Creates a new task with the given creation parameters.
   * The implementation generates a unique `taskId` and `createdAt` timestamp.
   *
   * @param taskParams - The task creation parameters from the request
   * @returns The created {@linkcode Task} object
   */
  createTask(taskParams: CreateTaskOptions): Promise<Task>;
  /**
   * Gets the current status of a task.
   *
   * @param taskId - The task identifier
   * @returns The {@linkcode Task} object
   * @throws If the task does not exist
   */
  getTask(taskId: string): Promise<Task>;
  /**
   * Stores the result of a task and sets its final status.
   *
   * @param taskId - The task identifier
   * @param status - The final status: `'completed'` for success, `'failed'` for errors
   * @param result - The result to store
   */
  storeTaskResult(taskId: string, status: 'completed' | 'failed', result: Result): Promise<void>;
  /**
   * Retrieves the stored result of a task.
   *
   * @param taskId - The task identifier
   * @returns The stored result
   */
  getTaskResult(taskId: string): Promise<Result>;
  /**
   * Updates a task's status (e.g., to `'cancelled'`, `'failed'`, `'completed'`).
   *
   * @param taskId - The task identifier
   * @param status - The new status
   * @param statusMessage - Optional diagnostic message for failed tasks or other status information
   */
  updateTaskStatus(taskId: string, status: Task['status'], statusMessage?: string): Promise<void>;
  /**
   * Lists tasks, optionally starting from a pagination cursor.
   *
   * @param cursor - Optional cursor for pagination
   * @returns An object containing the `tasks` array and an optional `nextCursor`
   */
  listTasks(cursor?: string): Promise<{
    tasks: Task[];
    nextCursor?: string;
  }>;
}
/**
 * Task context provided to request handlers when task storage is configured.
 */
type TaskContext = {
  id?: string;
  store: RequestTaskStore;
  requestedTtl?: number | null;
};
/**
 * Base context provided to all request handlers.
 */
type BaseContext = {
  /**
   * The session ID from the transport, if available.
   */
  sessionId?: string;
  /**
   * Information about the MCP request being handled.
   */
  mcpReq: {
    /**
     * The JSON-RPC ID of the request being handled.
     */
    id: RequestId;
    /**
     * The method name of the request (e.g., 'tools/call', 'ping').
     */
    method: string;
    /**
     * Metadata from the original request.
     */
    _meta?: RequestMeta;
    /**
     * An abort signal used to communicate if the request was cancelled from the sender's side.
     */
    signal: AbortSignal;
    /**
     * Sends a request that relates to the current request being handled.
     *
     * This is used by certain transports to correctly associate related messages.
     */
    send: <M extends RequestMethod>(request: {
      method: M;
      params?: Record<string, unknown>;
    }, options?: TaskRequestOptions) => Promise<ResultTypeMap[M]>;
    /**
     * Sends a notification that relates to the current request being handled.
     *
     * This is used by certain transports to correctly associate related messages.
     */
    notify: (notification: Notification) => Promise<void>;
  };
  /**
   * HTTP transport information, only available when using an HTTP-based transport.
   */
  http?: {
    /**
     * Information about a validated access token, provided to request handlers.
     */
    authInfo?: AuthInfo;
  };
  /**
   * Task context, available when task storage is configured.
   */
  task?: TaskContext;
};
/**
 * Context provided to server-side request handlers, extending {@linkcode BaseContext} with server-specific fields.
 */
type ServerContext = BaseContext & {
  mcpReq: {
    /**
     * Send a log message notification to the client.
     * Respects the client's log level filter set via logging/setLevel.
     */
    log: (level: LoggingLevel, data: unknown, logger?: string) => Promise<void>;
    /**
     * Send an elicitation request to the client, requesting user input.
     */
    elicitInput: (params: ElicitRequestFormParams | ElicitRequestURLParams, options?: RequestOptions) => Promise<ElicitResult>;
    /**
     * Request LLM sampling from the client.
     */
    requestSampling: (params: CreateMessageRequest['params'], options?: RequestOptions) => Promise<CreateMessageResult | CreateMessageResultWithTools>;
  };
  http?: {
    /**
     * The original HTTP request information.
     */
    req?: RequestInfo;
    /**
     * Closes the SSE stream for this request, triggering client reconnection.
     * Only available when using a StreamableHTTPServerTransport with eventStore configured.
     */
    closeSSE?: () => void;
    /**
     * Closes the standalone GET SSE stream, triggering client reconnection.
     * Only available when using a StreamableHTTPServerTransport with eventStore configured.
     */
    closeStandaloneSSE?: () => void;
  };
};
/**
 * Context provided to client-side request handlers.
 */
type ClientContext = BaseContext;
/**
 * Implements MCP protocol framing on top of a pluggable transport, including
 * features like request/response linking, notifications, and progress.
 */
declare abstract class Protocol<ContextT extends BaseContext> {
  private _options?;
  private _transport?;
  private _requestMessageId;
  private _requestHandlers;
  private _requestHandlerAbortControllers;
  private _notificationHandlers;
  private _responseHandlers;
  private _progressHandlers;
  private _timeoutInfo;
  private _pendingDebouncedNotifications;
  private _taskProgressTokens;
  private _taskStore?;
  private _taskMessageQueue?;
  private _requestResolvers;
  protected _supportedProtocolVersions: string[];
  /**
   * Callback for when the connection is closed for any reason.
   *
   * This is invoked when {@linkcode Protocol.close | close()} is called as well.
   */
  onclose?: () => void;
  /**
   * Callback for when an error occurs.
   *
   * Note that errors are not necessarily fatal; they are used for reporting any kind of exceptional condition out of band.
   */
  onerror?: (error: Error) => void;
  /**
   * A handler to invoke for any request types that do not have their own handler installed.
   */
  fallbackRequestHandler?: (request: JSONRPCRequest, ctx: ContextT) => Promise<Result>;
  /**
   * A handler to invoke for any notification types that do not have their own handler installed.
   */
  fallbackNotificationHandler?: (notification: Notification) => Promise<void>;
  constructor(_options?: ProtocolOptions | undefined);
  /**
   * Builds the context object for request handlers. Subclasses must override
   * to return the appropriate context type (e.g., ServerContext adds requestInfo).
   */
  protected abstract buildContext(ctx: BaseContext, transportInfo?: MessageExtraInfo): ContextT;
  private _oncancel;
  private _setupTimeout;
  private _resetTimeout;
  private _cleanupTimeout;
  /**
   * Attaches to the given transport, starts it, and starts listening for messages.
   *
   * The {@linkcode Protocol} object assumes ownership of the {@linkcode Transport}, replacing any callbacks that have already been set, and expects that it is the only user of the {@linkcode Transport} instance going forward.
   */
  connect(transport: Transport): Promise<void>;
  private _onclose;
  private _onerror;
  private _onnotification;
  private _onrequest;
  private _onprogress;
  private _onresponse;
  get transport(): Transport | undefined;
  /**
   * Closes the connection.
   */
  close(): Promise<void>;
  /**
   * A method to check if a capability is supported by the remote side, for the given method to be called.
   *
   * This should be implemented by subclasses.
   */
  protected abstract assertCapabilityForMethod(method: RequestMethod): void;
  /**
   * A method to check if a notification is supported by the local side, for the given method to be sent.
   *
   * This should be implemented by subclasses.
   */
  protected abstract assertNotificationCapability(method: NotificationMethod): void;
  /**
   * A method to check if a request handler is supported by the local side, for the given method to be handled.
   *
   * This should be implemented by subclasses.
   */
  protected abstract assertRequestHandlerCapability(method: string): void;
  /**
   * A method to check if task creation is supported for the given request method.
   *
   * This should be implemented by subclasses.
   */
  protected abstract assertTaskCapability(method: string): void;
  /**
   * A method to check if a task handler is supported by the local side, for the given method to be handled.
   *
   * This should be implemented by subclasses.
   */
  protected abstract assertTaskHandlerCapability(method: string): void;
  /**
   * Sends a request and returns an AsyncGenerator that yields response messages,
   * resolving the result schema automatically from the method name.
   * The generator is guaranteed to end with either a `'result'` or `'error'` message.
   *
   * @experimental Use `client.experimental.tasks.requestStream()` to access this method.
   */
  protected requestStream<M extends RequestMethod>(request: {
    method: M;
    params?: Record<string, unknown>;
  }, options?: RequestOptions): AsyncGenerator<ResponseMessage<ResultTypeMap[M]>, void, void>;
  /**
   * Sends a request and returns an AsyncGenerator that yields response messages,
   * using the provided schema for validation.
   *
   * This is the internal implementation used by SDK methods that need to specify
   * a particular result schema.
   */
  protected _requestStreamWithSchema<T$1 extends AnyObjectSchema>(request: Request, resultSchema: T$1, options?: RequestOptions): AsyncGenerator<ResponseMessage<SchemaOutput<T$1>>, void, void>;
  /**
   * Sends a request and waits for a response, resolving the result schema
   * automatically from the method name.
   *
   * Do not use this method to emit notifications! Use {@linkcode Protocol.notification | notification()} instead.
   */
  request<M extends RequestMethod>(request: {
    method: M;
    params?: Record<string, unknown>;
  }, options?: RequestOptions): Promise<ResultTypeMap[M]>;
  /**
   * Sends a request and waits for a response, using the provided schema for validation.
   *
   * This is the internal implementation used by SDK methods that need to specify
   * a particular result schema (e.g., for compatibility or task-specific schemas).
   */
  protected _requestWithSchema<T$1 extends AnySchema>(request: Request, resultSchema: T$1, options?: RequestOptions): Promise<SchemaOutput<T$1>>;
  /**
   * Gets the current status of a task.
   *
   * @experimental Use `client.experimental.tasks.getTask()` to access this method.
   */
  protected getTask(params: GetTaskRequest['params'], options?: RequestOptions): Promise<GetTaskResult>;
  /**
   * Retrieves the result of a completed task.
   *
   * @experimental Use `client.experimental.tasks.getTaskResult()` to access this method.
   */
  protected getTaskResult<T$1 extends AnySchema>(params: GetTaskPayloadRequest['params'], resultSchema: T$1, options?: RequestOptions): Promise<SchemaOutput<T$1>>;
  /**
   * Lists tasks, optionally starting from a pagination cursor.
   *
   * @experimental Use `client.experimental.tasks.listTasks()` to access this method.
   */
  protected listTasks(params?: {
    cursor?: string;
  }, options?: RequestOptions): Promise<SchemaOutput<typeof ListTasksResultSchema>>;
  /**
   * Cancels a specific task.
   *
   * @experimental Use `client.experimental.tasks.cancelTask()` to access this method.
   */
  protected cancelTask(params: {
    taskId: string;
  }, options?: RequestOptions): Promise<SchemaOutput<typeof CancelTaskResultSchema>>;
  /**
   * Emits a notification, which is a one-way message that does not expect a response.
   */
  notification(notification: Notification, options?: NotificationOptions): Promise<void>;
  /**
   * Registers a handler to invoke when this protocol object receives a request with the given method.
   *
   * Note that this will replace any previous request handler for the same method.
   */
  setRequestHandler<M extends RequestMethod>(method: M, handler: (request: RequestTypeMap[M], ctx: ContextT) => Result | Promise<Result>): void;
  /**
   * Removes the request handler for the given method.
   */
  removeRequestHandler(method: RequestMethod): void;
  /**
   * Asserts that a request handler has not already been set for the given method, in preparation for a new one being automatically installed.
   */
  assertCanSetRequestHandler(method: RequestMethod): void;
  /**
   * Registers a handler to invoke when this protocol object receives a notification with the given method.
   *
   * Note that this will replace any previous notification handler for the same method.
   */
  setNotificationHandler<M extends NotificationMethod>(method: M, handler: (notification: NotificationTypeMap[M]) => void | Promise<void>): void;
  /**
   * Removes the notification handler for the given method.
   */
  removeNotificationHandler(method: NotificationMethod): void;
  /**
   * Cleans up the progress handler associated with a task.
   * This should be called when a task reaches a terminal status.
   */
  private _cleanupTaskProgressHandler;
  /**
   * Enqueues a task-related message for side-channel delivery via `tasks/result`.
   * @param taskId The task ID to associate the message with
   * @param message The message to enqueue
   * @param sessionId Optional session ID for binding the operation to a specific session
   * @throws Error if `taskStore` is not configured or if enqueue fails (e.g., queue overflow)
   *
   * Note: If enqueue fails, it's the {@linkcode TaskMessageQueue} implementation's responsibility to handle
   * the error appropriately (e.g., by failing the task, logging, etc.). The Protocol layer
   * simply propagates the error.
   */
  private _enqueueTaskMessage;
  /**
   * Clears the message queue for a task and rejects any pending request resolvers.
   * @param taskId The task ID whose queue should be cleared
   * @param sessionId Optional session ID for binding the operation to a specific session
   */
  private _clearTaskQueue;
  /**
   * Waits for a task update (new messages or status change) with abort signal support.
   * Uses polling to check for updates at the task's configured poll interval.
   * @param taskId The task ID to wait for
   * @param signal Abort signal to cancel the wait
   * @returns Promise that resolves when an update occurs or rejects if aborted
   */
  private _waitForTaskUpdate;
  private requestTaskStore;
}
declare function mergeCapabilities(base: ServerCapabilities, additional: Partial<ServerCapabilities>): ServerCapabilities;
declare function mergeCapabilities(base: ClientCapabilities, additional: Partial<ClientCapabilities>): ClientCapabilities;
//#endregion
//#region ../core/src/shared/stdio.d.ts
/**
 * Buffers a continuous stdio stream into discrete JSON-RPC messages.
 */
declare class ReadBuffer {
  private _buffer?;
  append(chunk: Buffer): void;
  readMessage(): JSONRPCMessage | null;
  clear(): void;
}
declare function deserializeMessage(line: string): JSONRPCMessage;
declare function serializeMessage(message: JSONRPCMessage): string;
//#endregion
//#region ../core/src/shared/toolNameValidation.d.ts
/**
 * Tool name validation utilities according to SEP: Specify Format for Tool Names
 *
 * Tool names SHOULD be between 1 and 128 characters in length (inclusive).
 * Tool names are case-sensitive.
 * Allowed characters: uppercase and lowercase ASCII letters (`A-Z`, `a-z`), digits
 * (`0-9`), underscore (`_`), dash (`-`), and dot (`.`).
 * Tool names SHOULD NOT contain spaces, commas, or other special characters.
 *
 * @see {@link https://github.com/modelcontextprotocol/modelcontextprotocol/issues/986 | SEP-986: Specify Format for Tool Names}
 */
/**
 * Validates a tool name according to the SEP specification
 * @param name - The tool name to validate
 * @returns An object containing validation result and any warnings
 */
declare function validateToolName(name: string): {
  isValid: boolean;
  warnings: string[];
};
/**
 * Issues warnings for non-conforming tool names
 * @param name - The tool name that triggered the warnings
 * @param warnings - Array of warning messages
 */
declare function issueToolNameWarning(name: string, warnings: string[]): void;
/**
 * Validates a tool name and issues warnings for non-conforming names
 * @param name - The tool name to validate
 * @returns `true` if the name is valid, `false` otherwise
 */
declare function validateAndWarnToolName(name: string): boolean;
//#endregion
//#region ../core/src/shared/uriTemplate.d.ts
type Variables = Record<string, string | string[]>;
declare class UriTemplate {
  /**
   * Returns true if the given string contains any URI template expressions.
   * A template expression is a sequence of characters enclosed in curly braces,
   * like `{foo}` or `{?bar}`.
   */
  static isTemplate(str: string): boolean;
  private static validateLength;
  private readonly template;
  private readonly parts;
  get variableNames(): string[];
  constructor(template: string);
  toString(): string;
  private parse;
  private getOperator;
  private getNames;
  private encodeValue;
  private expandPart;
  expand(variables: Variables): string;
  private escapeRegExp;
  private partToRegExp;
  match(uri: string): Variables | null;
}
//#endregion
//#region ../core/src/util/inMemory.d.ts
/**
 * In-memory transport for creating clients and servers that talk to each other within the same process.
 */
declare class InMemoryTransport implements Transport {
  private _otherTransport?;
  private _messageQueue;
  onclose?: () => void;
  onerror?: (error: Error) => void;
  onmessage?: (message: JSONRPCMessage, extra?: {
    authInfo?: AuthInfo;
  }) => void;
  sessionId?: string;
  /**
   * Creates a pair of linked in-memory transports that can communicate with each other. One should be passed to a {@linkcode @modelcontextprotocol/client!client/client.Client | Client} and one to a {@linkcode @modelcontextprotocol/server!server/server.Server | Server}.
   */
  static createLinkedPair(): [InMemoryTransport, InMemoryTransport];
  start(): Promise<void>;
  close(): Promise<void>;
  /**
   * Sends a message with optional auth info.
   * This is useful for testing authentication scenarios.
   */
  send(message: JSONRPCMessage, options?: {
    relatedRequestId?: RequestId;
    authInfo?: AuthInfo;
  }): Promise<void>;
}
//#endregion
//#region ../core/src/experimental/tasks/helpers.d.ts
/**
 * Experimental task capability assertion helpers.
 * WARNING: These APIs are experimental and may change without notice.
 *
 * @experimental
 */
/**
 * Type representing the task requests capability structure.
 * This is derived from `ClientTasksCapability.requests` and `ServerTasksCapability.requests`.
 */
interface TaskRequestsCapability {
  tools?: {
    call?: object;
  };
  sampling?: {
    createMessage?: object;
  };
  elicitation?: {
    create?: object;
  };
}
/**
 * Asserts that task creation is supported for `tools/call`.
 * Used by {@linkcode @modelcontextprotocol/client!client/client.Client.assertTaskCapability | Client.assertTaskCapability} and {@linkcode @modelcontextprotocol/server!server/server.Server.assertTaskHandlerCapability | Server.assertTaskHandlerCapability}.
 *
 * @param requests - The task requests capability object
 * @param method - The method being checked
 * @param entityName - `'Server'` or `'Client'` for error messages
 * @throws Error if the capability is not supported
 *
 * @experimental
 */
declare function assertToolsCallTaskCapability(requests: TaskRequestsCapability | undefined, method: string, entityName: 'Server' | 'Client'): void;
/**
 * Asserts that task creation is supported for `sampling/createMessage` or `elicitation/create`.
 * Used by {@linkcode @modelcontextprotocol/server!server/server.Server.assertTaskCapability | Server.assertTaskCapability} and {@linkcode @modelcontextprotocol/client!client/client.Client.assertTaskHandlerCapability | Client.assertTaskHandlerCapability}.
 *
 * @param requests - The task requests capability object
 * @param method - The method being checked
 * @param entityName - `'Server'` or `'Client'` for error messages
 * @throws Error if the capability is not supported
 *
 * @experimental
 */
declare function assertClientRequestTaskCapability(requests: TaskRequestsCapability | undefined, method: string, entityName: 'Server' | 'Client'): void;
//#endregion
//#region ../core/src/experimental/tasks/stores/inMemory.d.ts
/**
 * In-memory {@linkcode TaskStore} implementation for development and testing.
 * For production, use a database or distributed cache.
 * @experimental
 */
declare class InMemoryTaskStore implements TaskStore {
  private tasks;
  private cleanupTimers;
  /**
   * Generates a unique task ID using Web Crypto API.
   */
  private generateTaskId;
  /** {@inheritDoc TaskStore.createTask} */
  createTask(taskParams: CreateTaskOptions, requestId: RequestId, request: Request, sessionId?: string): Promise<Task>;
  /**
   * Retrieves a stored task, enforcing session ownership when a sessionId is provided.
   * Returns undefined if the task does not exist or belongs to a different session.
   */
  private getStoredTask;
  getTask(taskId: string, sessionId?: string): Promise<Task | null>;
  /** {@inheritDoc TaskStore.storeTaskResult} */
  storeTaskResult(taskId: string, status: 'completed' | 'failed', result: Result, sessionId?: string): Promise<void>;
  /** {@inheritDoc TaskStore.getTaskResult} */
  getTaskResult(taskId: string, sessionId?: string): Promise<Result>;
  /** {@inheritDoc TaskStore.updateTaskStatus} */
  updateTaskStatus(taskId: string, status: Task['status'], statusMessage?: string, sessionId?: string): Promise<void>;
  /** {@inheritDoc TaskStore.listTasks} */
  listTasks(cursor?: string, sessionId?: string): Promise<{
    tasks: Task[];
    nextCursor?: string;
  }>;
  /**
   * Cleanup all timers (useful for testing or graceful shutdown)
   */
  cleanup(): void;
  /**
   * Get all tasks (useful for debugging)
   */
  getAllTasks(): Task[];
}
/**
 * In-memory {@linkcode TaskMessageQueue} implementation for development and testing.
 * For production, use Redis or another distributed queue.
 * @experimental
 */
declare class InMemoryTaskMessageQueue implements TaskMessageQueue {
  private queues;
  /**
   * Generates a queue key from taskId.
   * SessionId is intentionally ignored because taskIds are globally unique
   * and tasks need to be accessible across HTTP requests/sessions.
   */
  private getQueueKey;
  /**
   * Gets or creates a queue for the given task and session.
   */
  private getQueue;
  /**
   * Adds a message to the end of the queue for a specific task.
   * Atomically checks queue size and throws if maxSize would be exceeded.
   * @param taskId The task identifier
   * @param message The message to enqueue
   * @param sessionId Optional session ID for binding the operation to a specific session
   * @param maxSize Optional maximum queue size - if specified and queue is full, throws an error
   * @throws Error if maxSize is specified and would be exceeded
   */
  enqueue(taskId: string, message: QueuedMessage, sessionId?: string, maxSize?: number): Promise<void>;
  /**
   * Removes and returns the first message from the queue for a specific task.
   * @param taskId The task identifier
   * @param sessionId Optional session ID for binding the query to a specific session
   * @returns The first message, or `undefined` if the queue is empty
   */
  dequeue(taskId: string, sessionId?: string): Promise<QueuedMessage | undefined>;
  /**
   * Removes and returns all messages from the queue for a specific task.
   * @param taskId The task identifier
   * @param sessionId Optional session ID for binding the query to a specific session
   * @returns Array of all messages that were in the queue
   */
  dequeueAll(taskId: string, sessionId?: string): Promise<QueuedMessage[]>;
}
//#endregion
//#region ../core/src/validators/types.d.ts
/**
 * JSON Schema type definition (JSON Schema Draft 2020-12)
 *
 * This uses the object form of JSON Schema (excluding boolean schemas).
 * While `true` and `false` are valid JSON Schemas, this SDK uses the
 * object form for practical type safety.
 *
 * Re-exported from json-schema-typed for convenience.
 * @see https://json-schema.org/draft/2020-12/json-schema-core.html
 */
type JsonSchemaType = JSONSchema.Interface;
/**
 * Result of a JSON Schema validation operation
 */
type JsonSchemaValidatorResult<T$1> = {
  valid: true;
  data: T$1;
  errorMessage: undefined;
} | {
  valid: false;
  data: undefined;
  errorMessage: string;
};
/**
 * A validator function that validates data against a JSON Schema
 */
type JsonSchemaValidator<T$1> = (input: unknown) => JsonSchemaValidatorResult<T$1>;
/**
 * Provider interface for creating validators from JSON Schemas
 *
 * This is the main extension point for custom validator implementations.
 * Implementations should:
 * - Support JSON Schema Draft 2020-12 (or be compatible with it)
 * - Return validator functions that can be called multiple times
 * - Handle schema compilation/caching internally
 * - Provide clear error messages on validation failure
 *
 * @example
 * ```ts source="./types.examples.ts#jsonSchemaValidator_implementation"
 * class MyValidatorProvider implements jsonSchemaValidator {
 *     getValidator<T>(schema: JsonSchemaType): JsonSchemaValidator<T> {
 *         // Compile/cache validator from schema
 *         return (input: unknown) =>
 *             isValid(schema, input)
 *                 ? { valid: true, data: input as T, errorMessage: undefined }
 *                 : { valid: false, data: undefined, errorMessage: 'Error details' };
 *     }
 * }
 * ```
 */
interface jsonSchemaValidator {
  /**
   * Create a validator for the given JSON Schema
   *
   * @param schema - Standard JSON Schema object
   * @returns A validator function that can be called multiple times
   */
  getValidator<T$1>(schema: JsonSchemaType): JsonSchemaValidator<T$1>;
}
//#endregion
//#region ../core/src/validators/ajvProvider.d.ts
/**
 * @example Use with default AJV instance (recommended)
 * ```ts source="./ajvProvider.examples.ts#AjvJsonSchemaValidator_default"
 * const validator = new AjvJsonSchemaValidator();
 * ```
 *
 * @example Use with custom AJV instance
 * ```ts source="./ajvProvider.examples.ts#AjvJsonSchemaValidator_customInstance"
 * const ajv = new Ajv({ strict: true, allErrors: true });
 * const validator = new AjvJsonSchemaValidator(ajv);
 * ```
 *
 * @see {@linkcode CfWorkerJsonSchemaValidator} for an edge-runtime-compatible alternative
 */
declare class AjvJsonSchemaValidator implements jsonSchemaValidator {
  private _ajv;
  /**
   * Create an AJV validator
   *
   * @param ajv - Optional pre-configured AJV instance. If not provided, a default instance will be created.
   *
   * @example Use default configuration (recommended for most cases)
   * ```ts source="./ajvProvider.examples.ts#AjvJsonSchemaValidator_default"
   * const validator = new AjvJsonSchemaValidator();
   * ```
   *
   * @example Provide custom AJV instance for advanced configuration
   * ```ts source="./ajvProvider.examples.ts#AjvJsonSchemaValidator_constructor_withFormats"
   * const ajv = new Ajv({ validateFormats: true });
   * addFormats(ajv);
   * const validator = new AjvJsonSchemaValidator(ajv);
   * ```
   */
  constructor(ajv?: Ajv);
  /**
   * Create a validator for the given JSON Schema
   *
   * The validator is compiled once and can be reused multiple times.
   * If the schema has an `$id`, it will be cached by AJV automatically.
   *
   * @param schema - Standard JSON Schema object
   * @returns A validator function that validates input data
   */
  getValidator<T$1>(schema: JsonSchemaType): JsonSchemaValidator<T$1>;
}
//#endregion
//#region ../core/src/validators/cfWorkerProvider.d.ts
/**
 * JSON Schema draft version supported by @cfworker/json-schema
 */
type CfWorkerSchemaDraft = '4' | '7' | '2019-09' | '2020-12';
/**
 *
 * @example Use with default configuration (2020-12, shortcircuit)
 * ```ts source="./cfWorkerProvider.examples.ts#CfWorkerJsonSchemaValidator_default"
 * const validator = new CfWorkerJsonSchemaValidator();
 * ```
 *
 * @example Use with custom configuration
 * ```ts source="./cfWorkerProvider.examples.ts#CfWorkerJsonSchemaValidator_customConfig"
 * const validator = new CfWorkerJsonSchemaValidator({
 *     draft: '2020-12',
 *     shortcircuit: false // Report all errors
 * });
 * ```
 */
declare class CfWorkerJsonSchemaValidator implements jsonSchemaValidator {
  private shortcircuit;
  private draft;
  /**
   * Create a validator
   *
   * @param options - Configuration options
   * @param options.shortcircuit - If `true`, stop validation after first error (default: `true`)
   * @param options.draft - JSON Schema draft version to use (default: `'2020-12'`)
   */
  constructor(options?: {
    shortcircuit?: boolean;
    draft?: CfWorkerSchemaDraft;
  });
  /**
   * Create a validator for the given JSON Schema
   *
   * Unlike AJV, this validator is not cached internally
   *
   * @param schema - Standard JSON Schema object
   * @returns A validator function that validates input data
   */
  getValidator<T$1>(schema: JsonSchemaType): JsonSchemaValidator<T$1>;
}
//#endregion
export { getSchemaShape as $, ResourceSchema as $a, PaginatedResultSchema as $i, GetTaskPayloadRequestSchema as $n, TaskStatus as $o, ListChangedOptionsBaseSchema as $r, OAuthErrorCode as $s, CompatibilityCallToolResult as $t, ServerContext as A, ReadResourceResult as Aa, METHOD_NOT_FOUND as Ai, ElicitRequestParamsSchema as An, ServerResult as Ao, JSONObject as Ar, UnsubscribeRequestSchema as As, CallToolRequest as At, BaseResponseMessage as B, RequestMethod as Ba, Notification as Bi, EmbeddedResource as Bn, StringSchemaSchema as Bo, JSONRPCResponse as Br, getResultSchema as Bs, CancelledNotification as Bt, DEFAULT_REQUEST_TIMEOUT_MSEC as C, ProtocolError as Ca, OpenIdProviderDiscoveryMetadataSchema as Cc, ListToolsResultSchema as Ci, Cursor as Cn, SamplingMessageSchema as Co, InitializedNotification as Cr, ToolResultContentSchema as Cs, AuthInfo as Ct, ProtocolOptions as D, ReadResourceRequestParams as Da, SafeUrlSchema as Dc, LoggingMessageNotificationParams as Di, ElicitRequestFormParams as Dn, ServerNotificationSchema as Do, InvalidRequestError as Dr, UnsubscribeRequest as Ds, BlobResourceContentsSchema as Dt, Protocol as E, ReadResourceRequest as Ea, OptionalSafeUrlSchema as Ec, LoggingMessageNotification as Ei, ElicitRequest as En, ServerNotification as Eo, InvalidParamsError as Er, ToolUseContentSchema as Es, BlobResourceContents as Et, Transport as F, RequestId as Fa, ModelHintSchema as Fi, ElicitResultSchema as Fn, SetLevelRequestParamsSchema as Fo, JSONRPCMessageSchema as Fr, UrlElicitationRequiredError as Fs, CallToolResultSchema as Ft, TaskStatusMessage as G, ResourceContents as Ga, NumberSchema as Gi, EnumSchemaSchema as Gn, Task as Go, JSONValue as Gr, isJSONRPCRequest as Gs, ClientCapabilitiesSchema as Gt, ResponseMessage as H, RequestSchema as Ha, NotificationParams as Hi, EmptyResult as Hn, SubscribeRequestParams as Ho, JSONRPCResultResponse as Hr, isInitializedNotification as Hs, CancelledNotificationParamsSchema as Ht, TransportSendOptions as I, RequestIdSchema as Ia, ModelPreferences as Ii, ElicitationCompleteNotification as In, SetLevelRequestSchema as Io, JSONRPCNotification as Ir, assertCompleteRequestPrompt as Is, CancelTaskRequest as It, AnyObjectSchema as J, ResourceLinkSchema as Ja, PaginatedRequest as Ji, GetPromptRequestParamsSchema as Jn, TaskCreationParams as Jo, LegacyTitledEnumSchema as Jr, checkResourceAllowed as Js, ClientRequest as Jt, takeResult as K, ResourceContentsSchema as Ka, NumberSchemaSchema as Ki, GetPromptRequest as Kn, TaskAugmentedRequestParams as Ko, JSONValueSchema as Kr, isJSONRPCResultResponse as Ks, ClientNotification as Kt, createFetchWithInit as L, RequestInfo as La, ModelPreferencesSchema as Li, ElicitationCompleteNotificationParams as Ln, SingleSelectEnumSchema as Lo, JSONRPCNotificationSchema as Lr, assertCompleteRequestResourceTemplate as Ls, CancelTaskRequestSchema as Lt, TaskRequestOptions as M, RelatedTaskMetadata as Ma, MetaObject as Mi, ElicitRequestURLParams as Mn, ServerTasksCapabilitySchema as Mo, JSONRPCErrorResponse as Mr, UntitledMultiSelectEnumSchemaSchema as Ms, CallToolRequestParamsSchema as Mt, mergeCapabilities as N, RelatedTaskMetadataSchema as Na, MethodNotFoundError as Ni, ElicitRequestURLParamsSchema as Nn, SetLevelRequest as No, JSONRPCErrorResponseSchema as Nr, UntitledSingleSelectEnumSchema as Ns, CallToolRequestSchema as Nt, RequestOptions as O, ReadResourceRequestParamsSchema as Oa, LoggingMessageNotificationParamsSchema as Oi, ElicitRequestFormParamsSchema as On, ServerRequest as Oo, JSONArray as Or, UnsubscribeRequestParams as Os, BooleanSchema as Ot, FetchLike as P, Request as Pa, ModelHint as Pi, ElicitResult as Pn, SetLevelRequestParams as Po, JSONRPCMessage as Pr, UntitledSingleSelectEnumSchemaSchema as Ps, CallToolResult as Pt, getSchemaDescription as Q, ResourceRequestParamsSchema as Qa, PaginatedResult as Qi, GetTaskPayloadRequest as Qn, TaskSchema as Qo, ListChangedOptions as Qr, OAuthError as Qs, ClientTasksCapabilitySchema as Qt, normalizeHeaders as R, RequestMeta as Ra, MultiSelectEnumSchema as Ri, ElicitationCompleteNotificationParamsSchema as Rn, SingleSelectEnumSchemaSchema as Ro, JSONRPCRequest as Rr, getNotificationSchema as Rs, CancelTaskResult as Rt, ClientContext as S, PromptSchema as Sa, OpenIdProviderDiscoveryMetadata as Sc, ListToolsResult as Si, CreateTaskResultSchema as Sn, SamplingMessageContentBlockSchema as So, InitializeResultSchema as Sr, ToolResultContent as Ss, AudioContentSchema as St, ProgressCallback as T, RELATED_TASK_META_KEY as Ta, OpenIdProviderMetadataSchema as Tc, LoggingLevelSchema as Ti, DEFAULT_NEGOTIATED_PROTOCOL_VERSION as Tn, ServerCapabilitiesSchema as To, InternalError as Tr, ToolUseContent as Ts, BaseMetadataSchema as Tt, ResultMessage as U, RequestTypeMap as Ua, NotificationSchema as Ui, EmptyResultSchema as Un, SubscribeRequestParamsSchema as Uo, JSONRPCResultResponseSchema as Ur, isJSONRPCErrorResponse as Us, CancelledNotificationSchema as Ut, ErrorMessage as V, RequestParams as Va, NotificationMethod as Vi, EmbeddedResourceSchema as Vn, SubscribeRequest as Vo, JSONRPCResponseSchema as Vr, isInitializeRequest as Vs, CancelledNotificationParams as Vt, TaskCreatedMessage as W, Resource as Wa, NotificationTypeMap as Wi, EnumSchema as Wn, SubscribeRequestSchema as Wo, JSONRPC_VERSION as Wr, isJSONRPCNotification as Ws, ClientCapabilities as Wt, SchemaInput as X, ResourceListChangedNotificationSchema as Xa, PaginatedRequestParamsSchema as Xi, GetPromptResult as Xn, TaskMetadata as Xo, ListChangedCallback as Xr, SdkError as Xs, ClientResult as Xt, AnySchema as Y, ResourceListChangedNotification as Ya, PaginatedRequestParams as Yi, GetPromptRequestSchema as Yn, TaskCreationParamsSchema as Yo, LegacyTitledEnumSchemaSchema as Yr, resourceUrlFromServerUrl as Ys, ClientRequestSchema as Yt, SchemaOutput as Z, ResourceRequestParams as Za, PaginatedRequestSchema as Zi, GetPromptResultSchema as Zn, TaskMetadataSchema as Zo, ListChangedHandlers as Zr, SdkErrorCode as Zs, ClientResultSchema as Zt, validateToolName as _, PromptListChangedNotificationSchema as _a, OAuthProtectedResourceMetadataSchema as _c, ListTasksRequestSchema as _i, CreateMessageResult as _n, SUPPORTED_PROTOCOL_VERSIONS as _o, InitializeRequest as _r, ToolChoiceSchema as _s, isTerminal as _t, JsonSchemaValidator as a, Progress as aa, OAuthClientInformationFullSchema as ac, ListResourceTemplatesRequestSchema as ai, CompleteRequestResourceTemplate as an, ResourceUpdatedNotificationParams as ao, GetTaskResultSchema as ar, TextContent as as, BaseQueuedMessage as at, serializeMessage as b, PromptReference as ba, OAuthTokens as bc, ListToolsRequest as bi, CreateMessageResultWithToolsSchema as bn, SamplingMessage as bo, InitializeRequestSchema as br, ToolListChangedNotification as bs, AnnotationsSchema as bt, InMemoryTaskMessageQueue as c, ProgressNotificationParamsSchema as ca, OAuthClientMetadata as cc, ListResourcesRequest as ci, CompleteResultSchema as cn, Result as co, INVALID_REQUEST as cr, TextResourceContentsSchema as cs, QueuedError as ct, assertToolsCallTaskCapability as d, ProgressToken as da, OAuthClientRegistrationErrorSchema as dc, ListResourcesResultSchema as di, CreateMessageRequest as dn, Role as do, Icons as dr, TitledSingleSelectEnumSchema as ds, QueuedRequest as dt, ParseError as ea, AuthorizationServerMetadata as ec, ListPromptsRequest as ei, CompatibilityCallToolResultSchema as en, ResourceTemplateReference as eo, GetTaskPayloadResult as er, TaskStatusNotification as es, isOptionalSchema as et, InMemoryTransport as f, ProgressTokenSchema as fa, OAuthErrorResponse as fc, ListRootsRequest as fi, CreateMessageRequestParams as fn, RoleSchema as fo, IconsSchema as fr, TitledSingleSelectEnumSchemaSchema as fs, QueuedResponse as ft, validateAndWarnToolName as g, PromptListChangedNotification as ga, OAuthProtectedResourceMetadata as gc, ListTasksRequest as gi, CreateMessageRequestSchema as gn, RootsListChangedNotificationSchema as go, ImplementationSchema as gr, ToolChoice as gs, TaskToolExecution as gt, issueToolNameWarning as h, PromptArgumentSchema as ha, OAuthMetadataSchema as hc, ListRootsResultSchema as hi, CreateMessageRequestParamsWithTools as hn, RootsListChangedNotification as ho, Implementation as hr, ToolAnnotationsSchema as hs, TaskStore as ht, JsonSchemaType as i, PrimitiveSchemaDefinitionSchema as ia, OAuthClientInformationFull as ic, ListResourceTemplatesRequest as ii, CompleteRequestPrompt as in, ResourceUpdatedNotification as io, GetTaskResult as ir, TaskStatusSchema as is, unwrapOptionalSchema as it, TaskContext as j, ReadResourceResultSchema as ja, MessageExtraInfo as ji, ElicitRequestSchema as jn, ServerResultSchema as jo, JSONObjectSchema as jr, UntitledMultiSelectEnumSchema as js, CallToolRequestParams as jt, RequestTaskStore as k, ReadResourceRequestSchema as ka, LoggingMessageNotificationSchema as ki, ElicitRequestParams as kn, ServerRequestSchema as ko, JSONArraySchema as kr, UnsubscribeRequestParamsSchema as ks, BooleanSchemaSchema as kt, InMemoryTaskStore as l, ProgressNotificationSchema as la, OAuthClientMetadataSchema as lc, ListResourcesRequestSchema as li, ContentBlock as ln, ResultSchema as lo, Icon as lr, TitledMultiSelectEnumSchema as ls, QueuedMessage as lt, Variables as m, PromptArgument as ma, OAuthMetadata as mc, ListRootsResult as mi, CreateMessageRequestParamsSchema as mn, RootSchema as mo, ImageContentSchema as mr, ToolAnnotations as ms, TaskServerContext as mt, CfWorkerSchemaDraft as n, PingRequestSchema as na, IdJagTokenExchangeResponseSchema as nc, ListPromptsResult as ni, CompleteRequestParams as nn, ResourceTemplateSchema as no, GetTaskRequest as nr, TaskStatusNotificationParamsSchema as ns, parseSchemaAsync as nt, JsonSchemaValidatorResult as o, ProgressNotification as oa, OAuthClientInformationMixed as oc, ListResourceTemplatesResult as oi, CompleteRequestSchema as on, ResourceUpdatedNotificationParamsSchema as oo, INTERNAL_ERROR as or, TextContentSchema as os, CreateTaskOptions as ot, UriTemplate as p, Prompt as pa, OAuthErrorResponseSchema as pc, ListRootsRequestSchema as pi, CreateMessageRequestParamsBase as pn, Root as po, ImageContent as pr, Tool as ps, TaskMessageQueue as pt, toArrayAsync as q, ResourceLink as qa, PARSE_ERROR as qi, GetPromptRequestParams as qn, TaskAugmentedRequestParamsSchema as qo, LATEST_PROTOCOL_VERSION as qr, isTaskAugmentedRequestParams as qs, ClientNotificationSchema as qt, AjvJsonSchemaValidator as r, PrimitiveSchemaDefinition as ra, OAuthClientInformation as rc, ListPromptsResultSchema as ri, CompleteRequestParamsSchema as rn, ResourceTemplateType as ro, GetTaskRequestSchema as rr, TaskStatusNotificationSchema as rs, schemaToJson as rt, jsonSchemaValidator as s, ProgressNotificationParams as sa, OAuthClientInformationSchema as sc, ListResourceTemplatesResultSchema as si, CompleteResult as sn, ResourceUpdatedNotificationSchema as so, INVALID_PARAMS as sr, TextResourceContents as ss, CreateTaskServerContext as st, CfWorkerJsonSchemaValidator as t, PingRequest as ta, IdJagTokenExchangeResponse as tc, ListPromptsRequestSchema as ti, CompleteRequest as tn, ResourceTemplateReferenceSchema as to, GetTaskPayloadResultSchema as tr, TaskStatusNotificationParams as ts, parseSchema as tt, assertClientRequestTaskCapability as u, ProgressSchema as ua, OAuthClientRegistrationError as uc, ListResourcesResult as ui, ContentBlockSchema as un, ResultTypeMap as uo, IconSchema as ur, TitledMultiSelectEnumSchemaSchema as us, QueuedNotification as ut, ReadBuffer as v, PromptMessage as va, OAuthTokenRevocationRequest as vc, ListTasksResult as vi, CreateMessageResultSchema as vn, SamplingContent as vo, InitializeRequestParams as vr, ToolExecution as vs, getDisplayName as vt, NotificationOptions as w, ProtocolErrorCode as wa, OpenIdProviderMetadata as wc, LoggingLevel as wi, CursorSchema as wn, ServerCapabilities as wo, InitializedNotificationSchema as wr, ToolSchema as ws, BaseMetadata as wt, BaseContext as x, PromptReferenceSchema as xa, OAuthTokensSchema as xc, ListToolsRequestSchema as xi, CreateTaskResult as xn, SamplingMessageContentBlock as xo, InitializeResult as xr, ToolListChangedNotificationSchema as xs, AudioContent as xt, deserializeMessage as y, PromptMessageSchema as ya, OAuthTokenRevocationRequestSchema as yc, ListTasksResultSchema as yi, CreateMessageResultWithTools as yn, SamplingContentSchema as yo, InitializeRequestParamsSchema as yr, ToolExecutionSchema as ys, Annotations as yt, AsyncGeneratorValue as z, RequestMetaObject as za, MultiSelectEnumSchemaSchema as zi, ElicitationCompleteNotificationSchema as zn, StringSchema as zo, JSONRPCRequestSchema as zr, getRequestSchema as zs, CancelTaskResultSchema as zt };
//# sourceMappingURL=index-Bv4D0PH9.d.mts.map