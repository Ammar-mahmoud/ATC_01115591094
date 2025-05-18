import client from "@/lib/client";
import type { ILoginUser, ICreateUser, SignUpResponse } from "@/lib/types/auth";

class AuthService {
  async login(payload: ILoginUser): Promise<any> {
     try {
      const response = await client.post("/auth/login", payload);
      if (response.status >= 400) {
        console.log(response)
        throw new Error(response.data.message || "Login failed");
      }
      return response;
    } catch (error) {
        console.log(error.reponse)
       if (error.response) {
        const apiError = new Error(error.response.data?.message || "Signup failed");
        apiError.response = error.response.data;
        throw apiError;
      }
      throw new Error(error.message || "Network error");
    }
    }
  

  async signup(payload: ICreateUser): Promise<any> {
    try {
      const response = await client.post("/auth/signup", payload);
      if (response.status >= 400) {
        console.log(response)
        throw new Error(response.data.message || "Signup failed");
      }
      return response;
    } catch (error) {
        console.log(error.reponse)
       if (error.response) {
        const apiError = new Error(error.response.data?.message || "Signup failed");
        apiError.response = error.response.data;
        throw apiError;
      }
      throw new Error(error.message || "Network error");
    }
    }
  }

export default new AuthService();
