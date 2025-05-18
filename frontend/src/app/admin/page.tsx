"use client";
import Link from "next/link";
import {
  Calendar,
  Download,
  Edit,
  Eye,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import eventsService from "@/lib/domain/events/events.service";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useRouter } from "next/navigation";
import { useUserContext } from "../context/UserContext";

export default function EventsPage() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const router = useRouter();
  const {setEventManual} = useUserContext()

   const navigateWithState = (event) => {
    window.history.replaceState(
      { myData: event }, // State object
      `${event?.name?.en}`,
      `/admin/${event._id}` 
    );
    router.replace(`/admin/${event._id}`);
  }

  const getEvents = async () => {
    setLoading(true);
    try {
      const response = await eventsService.getPagedEvents();
      console.log("API Response:", response.data.data);
      setEvents(response.data.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const resp = await eventsService.deleteEvent(id);
      console.log(resp);
      await getEvents();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-[100vh] w-[100vw] bg-gray-200">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground">
            Manage your events and ticket sales.
          </p>
        </div>
        <Link href="/admin/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Event
          </Button>
        </Link>
      </div>

      <Card className="p-2">
        <CardHeader className="m-3">
          <CardTitle>All Events</CardTitle>
          <CardDescription>
            You have {events?.length || 0} events in total.
          </CardDescription>
        </CardHeader>
        <CardContent>

          {/* Events Table */}
          <div className="p-2 rounded-md border overflow-hidden">
            <Table className="p-2">
              <TableHeader className="p-2">
                <TableRow>
                  <TableHead className="w-[300px]">Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(events) &&
                  events.map((event) => {
                    // Safely extract values with proper fallbacks
                    const eventName = event?.name?.en || "Untitled Event";
                    const venue = event?.venue?.en || "Location not specified";
                    const date = event?.date
                      ? new Date(event.date).toLocaleDateString()
                      : "Date not set";
                    const price =
                      event?.price !== undefined ? `$${event.price}` : "Free";
                    const ticketsSold = event?.soldTickets || 0;
                    const ticketsAvailable = event?.ticketQuantity || 0;
                    const category =
                      event?.category?.name?.en || "Uncategorized";

                    // Determine status based on tickets
                    const status =
                      ticketsAvailable === 0
                        ? "completed"
                        : ticketsSold > 0
                        ? "active"
                        : "draft";

                    return (
                      <TableRow key={event?._id || event?.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {event.imageUrl ? (
                              <img
                                src={event.imageUrl}
                                alt={eventName}
                                className="w-8 h-8 rounded object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              {eventName}
                              <div className="text-xs text-muted-foreground mt-1">
                                {category}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{date}</TableCell>
                        <TableCell>{venue}</TableCell>
                        <TableCell>{price}</TableCell>
                        <TableCell>
                          <StatusBadge status={status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            {ticketsSold} / {ticketsAvailable}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {ticketsAvailable > 0
                              ? `${Math.round(
                                  (ticketsSold / ticketsAvailable) * 100
                                )}% sold`
                              : "Sold out"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg"
                            >
                              <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium">
                                Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-2 py-1.5 text-sm  hover:bg-red-50 dark:hover:bg-red-900/20"
                                onSelect={() => {setEventManual(event); router.replace(`/admin/${event._id}`)}}
                              >
                                <span>
                                  Edit
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                              <DropdownMenuItem
                                className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onSelect={() => handleDelete(event._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>1</strong> to{" "}
              <strong>{events?.length || 0}</strong> of{" "}
              <strong>{events?.length || 0}</strong> results
            </div>
            <div className="flex items-center space-x-2">
              {/* <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return <Badge className="bg-green-500">Active</Badge>;
  }
  if (status === "draft") {
    return <Badge variant="outline">Draft</Badge>;
  }
  if (status === "completed") {
    return <Badge variant="secondary">Completed</Badge>;
  }
  return <Badge variant="outline">{status}</Badge>;
}
