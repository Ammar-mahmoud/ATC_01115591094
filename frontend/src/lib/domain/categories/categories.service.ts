import client from "@/lib/client";
class CategoriesService {
  async getCategories() {
    try {
      const response = await client.get("/categories");
      if (!response.status.toString().startsWith("2")) {
        throw new Error(response.data.message || "Failed !");
      }
      return response;
    } catch (err) {
      throw err;
    }
  }
}

const categoriesService = new CategoriesService();

export default categoriesService;
