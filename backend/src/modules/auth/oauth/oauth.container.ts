import { AuthRepository } from "../auth.repository.js";
import { AuthService } from "../auth.service.js";
import { GoogleOAuthService } from "./oauth.service.js";

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const googleOAuthService = new GoogleOAuthService(authRepository, authService);

export { googleOAuthService };
