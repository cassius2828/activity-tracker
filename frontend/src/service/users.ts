import axios from "axios";
type User = {
  id: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
};

type CreateUserBody = {
  email: string;
  password: string;
  confirmPassword: string;
};
type UpdateUserBody = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: "admin" | "user";
};

const getUsers = async () => {
  try {
    const response = await axios.get<User[]>(
      import.meta.env.BACKEND_URL + "/users",
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getUserById = async (id: string) => {
  try {
    const response = await axios.get<User>(
      import.meta.env.BACKEND_URL + "/users/" + id,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const createUser = async (userBody: CreateUserBody) => {
  try {
    const response = await axios.post<User>(
      import.meta.env.BACKEND_URL + "/users",
      userBody,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const updateUser = async (id: string, userBody: UpdateUserBody) => {
  try {
    const response = await axios.put<User>(
      import.meta.env.BACKEND_URL + "/users/" + id,
      userBody,
    );
    return response.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
export { getUsers, getUserById, createUser, updateUser };
