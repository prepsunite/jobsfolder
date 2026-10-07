/**
 * Fast SHA-256 string hashing utility using the native Web Crypto API.
 */
export async function sha256Text(text: string): Promise<string> {
  const normalized = text.trim().toUpperCase();
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const enc = new TextEncoder().encode(normalized);
    const hashBuf = await window.crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback simple 32-bit hash representation if crypto.subtle is not accessible
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fallback_${Math.abs(hash).toString(16)}`;
}
