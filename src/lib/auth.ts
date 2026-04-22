import { jwtVerify, SignJWT } from 'jose';

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_PASSWORD || 'fallback-secret-change-me'
);

export async function createToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch {
    return null;
  }
}
