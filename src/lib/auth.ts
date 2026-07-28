import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';

// Fetch the secret from Railway, with a secure fallback for local development
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_fallback_key_for_dev_only';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

/**
 * Hashes a plaintext password using bcrypt with a high salt round of 12.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plaintext password attempt against the database hash.
 */
export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Signs a new JWT token using Edge-compatible 'jose'.
 * Sets the session to expire in exactly 8 hours.
 */
export async function signJWT(payload: { id: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h') // 8-hour workday session
    .sign(encodedSecret);
}

/**
 * Verifies the JWT token cryptographically.
 * Returns the decoded payload if valid, or null if tampered/expired.
 */
export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedSecret);
    return payload;
  } catch (error) {
    // If the signature is invalid or token expired, this instantly catches
    return null;
  }
}
