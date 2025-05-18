"use client";
import Footer from "@/components/footer";
import Hero from "../components/hero";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/event-card";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { Badge } from "lucide-react";
import EventsWrapper from "@/components/events/events-wrapper";
import { useUserContext } from "./context/UserContext";
import { useEffect } from "react";

export default function Home() {
  const { user , booking } = useUserContext();

  useEffect(() => {
    console.log(user,booking);
  }, []);

  return (
    <div className="">
      <main className="flex flex-col ">
        <Hero />
        {/* Events Section */}
        <section className="py-12 px-4 w-full ">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8  gap-2">
            <div>
              <h2 className="text-3xl font-bold mb-2">Upcoming Events</h2>
              <p className="text-muted-foreground">
                Discover and join amazing events happening near you
              </p>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4 " />
              Filters
            </Button>
          </div>

          {/* Filters */}
          {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-0 mb-0">
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="arts">Arts & Culture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Date</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          <EventsWrapper />

          {/* Active Filters
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="outline" className="flex items-center gap-1">
              Tech
              <button className="ml-1 rounded-full hover:bg-muted p-1">
                ×
              </button>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              This Week
              <button className="ml-1 rounded-full hover:bg-muted p-1">
                ×
              </button>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              Clear All
            </Badge>
          </div> */}

          {/* Load More */}
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg">
              Load More Events
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
