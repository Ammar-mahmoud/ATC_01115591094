"use client";
import { useEffect, useState } from "react";
import EventCard from "../event-card";
import eventsService from "@/lib/domain/events/events.service";

const EventsWrapper = () => {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState(
    Array.from({ length: 8 }, (_, i) => {
      return { id: i };
    })
  );
  const [currentPage, setPage] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(8);

  const getEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsService.getPagedEvents();
      console.log(response);
      setEvents(response.data.data)
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  useEffect(() => {
    getEvents();
  }, [currentPage]);

  useEffect(()=>{
    console.log("events:",events)
  },[events])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.isArray(events) &&
        events.map((event, i) => (
          <EventCard
            key={i}
            data={loading ? null : event}
            skeleton={loading}
          />
        ))}
    </div>
  );
};

export default EventsWrapper;
