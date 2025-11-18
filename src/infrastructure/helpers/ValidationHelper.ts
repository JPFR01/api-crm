export class ValidationHelper {
  static validateName(name: string): { valid: boolean; error?: string } {
    const trimmed = name.trim();
    if (trimmed.length < 3) {
      return {
        valid: false,
        error: "Nome muito curto. Informe seu nome completo.",
      };
    }
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
      return { valid: false, error: "Nome deve conter apenas letras." };
    }
    if (trimmed.split(" ").length < 2) {
      return { valid: false, error: "Por favor, informe nome e sobrenome." };
    }
    return { valid: true };
  }

  static validatePhone(phone: string): {
    valid: boolean;
    error?: string;
    normalized?: string;
  } {
    const numbers = phone.replace(/\D/g, "");

    if (numbers.length === 11 && /^[1-9]{2}9\d{8}$/.test(numbers)) {
      return {
        valid: true,
        normalized: `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`,
      };
    }

    if (numbers.length === 10 && /^[1-9]{2}\d{8}$/.test(numbers)) {
      return {
        valid: true,
        normalized: `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`,
      };
    }

    return {
      valid: false,
      error: "Telefone inválido. Use formato: (11) 98765-4321 ou 11987654321",
    };
  }

  static validateCPF(cpf: string): {
    valid: boolean;
    error?: string;
    normalized?: string;
  } {
    const numbers = cpf.replace(/\D/g, "");

    if (numbers.length !== 11) {
      return { valid: false, error: "CPF deve ter 11 dígitos." };
    }

    // Basic validation (check for repeated digits)
    if (/^(\d)\1{10}$/.test(numbers)) {
      return { valid: false, error: "CPF inválido." };
    }

    // Full CPF validation algorithm
    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (11 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) {
      return { valid: false, error: "CPF inválido." };
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(numbers.substring(i - 1, i)) * (12 - i);
    }

    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) {
      return { valid: false, error: "CPF inválido." };
    }

    return {
      valid: true,
      normalized: `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9)}`,
    };
  }

  static validateDateBirth(date: string): {
    valid: boolean;
    error?: string;
    normalized?: string;
  } {
    const match = date.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (!match) {
      return { valid: false, error: "Use o formato DD/MM/AAAA" };
    }

    const [, day, month, year] = match;
    const d = new Date(`${year}-${month}-${day}`);

    if (isNaN(d.getTime())) {
      return { valid: false, error: "Data inválida." };
    }

    const now = new Date();
    const age = now.getFullYear() - d.getFullYear();

    if (age < 0 || age > 150) {
      return { valid: false, error: "Data de nascimento inválida." };
    }

    if (d > now) {
      return {
        valid: false,
        error: "Data de nascimento não pode ser no futuro.",
      };
    }

    return { valid: true, normalized: date };
  }

  static validateEmail(email: string): { valid: boolean; error?: string } {
    if (email.toLowerCase() === "pular" || email.toLowerCase() === "skip") {
      return { valid: true };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        error: "Email inválido. Use formato: exemplo@email.com",
      };
    }

    return { valid: true };
  }
}
