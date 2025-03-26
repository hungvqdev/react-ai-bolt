import crypto from 'crypto';

export function generateSignature(
  amount: number,
  orderCode: number,
  description: string,
  cancelUrl: string,
  returnUrl: string,
  CHECKSUM_KEY: string
): string {
  const data = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
  return crypto.createHmac('sha256', CHECKSUM_KEY).update(data).digest('hex');
}
