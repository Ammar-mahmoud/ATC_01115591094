import client from "@/lib/client";

class BookingService {
  async book(id: string, payload: any) {
    try {
      const response = await client.post(`bookings/${id}`, payload);
      console.log(response);
      if (!response.status.toString().startsWith("2")) {
        throw new Error(response.data.message || "Failed !");
      }
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getPagedBooks(){
    try {
      const response = await client.get(`bookings`);
      console.log(response);
      if (!response.status.toString().startsWith("2")) {
        throw new Error(response.data.message || "Failed !");
      }
      return response;
    } catch (err) {
      throw err;
    }
  }

  async deleteBooking(id:string){
    try {
      const response = await client.delete(`bookings/${id}`);
      console.log(response);
      if (!response.status.toString().startsWith("2")) {
        throw new Error(response.data.message || "Failed !");
      }
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getUserBooks(){
    try {
      const response = await client.get(`bookings/me`);
      console.log(response);
      if (!response.status.toString().startsWith("2")) {
        throw new Error(response.data.message || "Failed !");
      }
      return response;
    } catch (err) {
      throw err;
    }
  }
}

const bookingService = new BookingService();

export default bookingService;
