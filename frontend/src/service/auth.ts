import axios from "axios";

type LoginBody = Omit<SignupBody, "confirmPassword">;

type LoginResponse = {
  message: string;
  token: string;
};

type SignupBody = {
  email: string;
  password: string;
  confirmPassword: string;
};
const login = async (loginBody: LoginBody) => {
  try {
    const response = await axios.post<LoginResponse>(
      import.meta.env.BACKEND_URL + "/auth/login",
      loginBody,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const register = async (signupBody: SignupBody) => {
  try {
    const response = await axios.post<LoginResponse>(
      import.meta.env.BACKEND_URL + "/auth/register",
      signupBody,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { login, register };
