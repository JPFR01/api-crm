import jwt, { SignOptions, Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "super-secret";

export class JwtService {
  static sign(
    payload: object,
    expiresIn: SignOptions["expiresIn"] = "10y",
  ): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, JWT_SECRET, options);
  }

  static verify(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  }
}
