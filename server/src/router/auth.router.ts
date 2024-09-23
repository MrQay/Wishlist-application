import express, { NextFunction, Request, Response } from "express";
import { IAuthService } from '../service/iauth.service';
import { AuthService } from "../service/auth.service";
import JWT, { JwtPayload } from "jsonwebtoken";
export type JWTUser = { method: string; id: string };

// Extend Express Request to include user property
declare global {
  namespace Express {
    export interface Request {
      user: string | JwtPayload;
    }
  }
}

const authService: IAuthService = new AuthService();
export const authRouter = express.Router(); // Create a new router for auth-related routes

authRouter.use(express.json()); // Middleware to parse JSON bodies

// Login route
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    const token = await authService.login(req.body.email, req.body.password);
    if (token)
      res.header("Authorization", token).json({
        authToken: token,
      });
    else res.status(404).send("User doesn't exist with given credentials.");
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

// Registration route
authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await authService.register(req.body.email, req.body.password);
    res.status(200).send(user);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});

// Middleware to verify JWT token
authRouter.use((req: Request, res: Response, next: NextFunction) => {
  if (!process.env.JWT_SECRET) throw new Error("Login: Secret not found for login/");

  const token = req.headers.authorization as string;
  if (!token)
    throw new Error(
      "VerifyJWT: No tokens passed through in Authorization header"
    );

  req.user = JWT.verify(token, process.env.JWT_SECRET) as JWTUser;
  next();
});

// Route to edit user password
authRouter.post("/editPassword", async (req: Request, res: Response) => {
  try {
    if ((req.user as JwtPayload).id) {
      const id = (req.user as JwtPayload).id;
      await authService.editPassword(id, req.body.password);
    }

    res.json({
      message: `Successfully edited password.`,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(404).send(error.message);
    } else {
      res.status(500).send("An unknown error occurred");
    }
  }
});
