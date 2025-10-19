export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91${cleaned}`;
  }
  return phone;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const maskPhoneNumber = (phone: string): string => {
  if (phone.length >= 4) {
    return phone.slice(-4).padStart(phone.length, 'X');
  }
  return phone;
};