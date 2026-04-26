const EMAIL_MAX_LENGTH = 254;

export function isValidEmail(value: string): boolean {
  const email = value.trim();
  if (!email || email.length > EMAIL_MAX_LENGTH) return false;

  const parts = email.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (!localPart || !domain) return false;
  if (localPart.length > 64 || domain.length > 253) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false;
  if (domain.includes('..')) return false;

  const emailRegex = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/;
  return emailRegex.test(email);
}
