export interface GoogleUserProfile {
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  picture?: string;
}
