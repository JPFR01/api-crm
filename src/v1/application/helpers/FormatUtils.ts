export function extractNumbers(input: string): string {
    return input.replace(/\D+/g, '');
}

export function extractUsername(input: string): string {
    const parts: string[] = input.split('@');
    return parts.length === 2 ? parts[0] : input;
}
