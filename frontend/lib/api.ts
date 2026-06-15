import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getOAuthGoogleUrl = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/auth/google`, {
      withCredentials: true,
    });

    const googleOAuthUrl = res.data.data.url;

    return googleOAuthUrl;
  } catch (error) {
    console.log(error);
  }
};

interface RegisterUserInput {
  email: string;
  password: string;
  confirmPassword: string;
  captchaToken: string;
}

export async function registerUser(data: RegisterUserInput) {
  const response = await axios.post(
    `${BACKEND_URL}/api/v1/auth/register`,
    data,
  );

  return response.data;
}

interface LoginUserInput {
  email: string;
  password: string;
}

export async function loginUser(data: LoginUserInput) {
  const response = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, data, {
    withCredentials: true,
  });

  return response.data;
}
