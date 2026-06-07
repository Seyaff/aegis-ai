import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/types";
import API from "../axios-client";

export const loginMutation = async (
  data: LoginRequest,
): Promise<LoginResponse> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutation = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await API.post("/auth/register", data);
  return response.data;
};
