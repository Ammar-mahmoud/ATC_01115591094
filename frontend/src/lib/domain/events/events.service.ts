import client from "@/lib/client";
class EventsService {
  async getPagedEvents() {
    try {
      const response = await client.get("/events");
      if (!response.status.toString().startsWith("2")) {
        throw new Error(response.data.message || "Failed !");
      }
      return response;
    } catch (err) {
      throw err;
    }
  }

  async getEventById(id: string) {
    try {
      const response = await client.get(`events/${id}`);
      if (!response.status.toString().startsWith("2")) {
        throw new Error(response.data.message || "Failed !");
      }
      return response;
    } catch (err) {
      throw err;
    }
  }

  async deleteEvent(id:string){
    try {
      const response = await client.delete(`events/${id}`);
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

const eventsService = new EventsService();

export default eventsService;
