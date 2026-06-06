import { AuthRepository } from "../auth.repository.js";
import { GoogleOAuthService } from "./oauth.service.js";

const authRepository = new AuthRepository();
const googleOAuthService = new GoogleOAuthService(authRepository);

export { googleOAuthService };
