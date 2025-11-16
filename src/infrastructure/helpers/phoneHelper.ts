export const normalizePhone = (value: string): string => {
  if (!value) return value;

  // Remove everything except numbers
  const numeric = value.replace(/\D/g, "");

  // If already starts with 55, keep it
  if (numeric.startsWith("55")) return numeric;

  // If it's a Brazilian number without country code, add it
  return "55" + numeric;
};

export const formatPhoneReadable = (phone: string): string => {
  if (!phone) return phone;

  // Remove everything except digits
  const numeric = phone.replace(/\D/g, "");

  // Must have at least country + DDD + 9 digits
  if (numeric.length < 12) return phone;

  const country = numeric.slice(0, 2);
  const ddd = numeric.slice(2, 4);
  const prefix = numeric.slice(4, 9);
  const suffix = numeric.slice(9);

  return `+${country} (${ddd}) ${prefix}-${suffix}`;
};
