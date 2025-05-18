import client from "@/lib/client";
class UsersService {
  async getPagedUsers() {
    try {
      const response = await client.get(`users`);
      if (!response.status.toString().startsWith("2")) {
        throw new Error(response.data.message || "Failed !");
      }
      return response;
    } catch (err) {
      throw err;
    }
  }
}

const usersService = new UsersService();

export default usersService;
