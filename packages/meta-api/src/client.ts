import bizSdk from "facebook-nodejs-business-sdk";

const { FacebookAdsApi, AdAccount } = bizSdk;

let apiInstance: ReturnType<typeof FacebookAdsApi.init> | null = null;

/**
 * Initialize the Meta Marketing API client with an access token.
 */
export function initMetaApi(accessToken: string) {
  apiInstance = FacebookAdsApi.init(accessToken);
  apiInstance.setDebug(process.env.NODE_ENV === "development");
  return apiInstance;
}

/**
 * Get an AdAccount object by Meta account ID (e.g., "act_123456")
 */
export function getAdAccount(
  metaAccountId: string,
  accessToken: string
): InstanceType<typeof AdAccount> {
  initMetaApi(accessToken);
  return new AdAccount(metaAccountId);
}

/**
 * Decrypt an access token from the database.
 * In production, use proper encryption (AES-256-GCM).
 * For MVP, tokens are stored as-is with a TODO for encryption.
 */
export function decryptToken(encryptedToken: string): string {
  // TODO: Implement AES-256-GCM encryption/decryption
  // For now, return as-is during development
  return encryptedToken;
}

/**
 * Encrypt an access token before storing in database.
 */
export function encryptToken(token: string): string {
  // TODO: Implement AES-256-GCM encryption
  return token;
}
