import { Request, Response, NextFunction } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization;

  try {
    // Descomentar depois
    /*
    const payload = JwtService.verify(token);
    req.crmContext = {
      provider: payload.crmProvider,
      companyId: payload.companyId,
    };
    */

    // Fake context para teste
    req.crmContext = {
      provider: "clinica_experts",
      companyId: "teste",
    };

    next(); // continua para o controller
  } catch (err) {
    res.status(401).json({ message: "Token inválido" });
  }
};
