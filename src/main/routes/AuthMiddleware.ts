export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const payload = JwtService.verify(token);
    req.crmContext = {
      provider: payload.crmProvider,
      companyId: payload.companyId,
    };
    next();
  } catch {
    res.status(401).json({ message: "Token inválido" });
  }
};

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

type JwtPayload = {
  sub: string;
  crmProvider: "clinica_experts" | "hubspot";
  companyId: string;
  role?: string;
};

export class JwtService {
  static sign(payload: JwtPayload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1h",
    });
  }

  static verify(token: string): JwtPayload {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }
}
