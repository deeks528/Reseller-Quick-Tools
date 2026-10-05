/**
 * Standard postal address formatter
 * Formats structured address object into a clean postal address string.
 */
export const formatPostalAddress = (addr = {}) => {
  if (!addr) return '';
  if (typeof addr === 'string') return addr.trim();

  const parts = [];

  if (addr.name) {
    parts.push(`To,\n${addr.name}`);
  }

  const line1 = [addr.houseNo, addr.street].filter(Boolean).join(', ');
  if (line1) parts.push(line1);

  if (addr.landmark) {
    parts.push(`Near: ${addr.landmark}`);
  }

  if (addr.area) {
    parts.push(addr.area);
  }

  const cityStatePin = [
    addr.city,
    addr.state,
    addr.pin ? `PIN: ${addr.pin}` : ''
  ].filter(Boolean).join(',\n');

  if (cityStatePin) {
    parts.push(cityStatePin);
  }

  if (addr.phone) {
    parts.push(`Ph: ${addr.phone}`);
  }

  return parts.join('\n');
};
