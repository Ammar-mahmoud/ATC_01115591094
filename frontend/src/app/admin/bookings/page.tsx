"use client";
import Link from "next/link";
import {
  Calendar,
  Download,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  User,
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
import bookingsService from "@/lib/domain/booking/booking.service";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

export default function BookingsPage() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    numberOfPages: 1,
    totalDocuments: 0,
  });

  const getBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingsService.getPagedBooks();
      console.log("API Response:", response.data);
      setBookings(response.data.data);
      setPagination(response.data.paginationResult);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id:string)=>{
    setLoading(true)
    try{
       const resp = await bookingsService.deleteBooking(id);
       console.log(resp);
       await getBookings();
    }
    catch(err){
      console.log(err);
    }
    finally{
        setLoading(false);
    }
  }

  useEffect(() => {
    getBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-[100vh] w-[100vw] bg-gray-200">
        <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
        <p>Loading...</p>
      </div>
    );
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">
            Manage your event bookings and reservations.
          </p>
        </div>
        {/* <Link href="/admin/new-booking">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Booking
          </Button>
        </Link> */}
      </div>

      <Card className="p-2">
        <CardHeader className="m-3">
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>
            You have {pagination?.totalDocuments || 0} bookings in total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          {/* <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search bookings..." className="pl-8" /> */}
          {/* </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="11111111-0000-0000-0000-000000000004">
                    Premium Workshop
                  </SelectItem>
                  <SelectItem value="11111111-0000-0000-0000-000000000005">
                    Music Festival
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50">$0 - $50</SelectItem>
                  <SelectItem value="51-100">$51 - $100</SelectItem>
                  <SelectItem value="101+">$101+</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div> */}

          {/* Bookings Table */}
          <div className="p-2 rounded-md border overflow-hidden">
            <Table className="p-2">
              <TableHeader className="p-2">
                <TableRow>
                  <TableHead className="w-[250px]">Booking ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(bookings) &&
                  bookings.map((booking) => {
                    const user = booking.user?.name || "Unknown User";
                    const eventName =
                      booking.event?.name?.en || "Unknown Event";
                    const venue = booking.event?.venue?.en || "Unknown Venue";

                    return (
                      <TableRow key={booking._id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              {booking._id.substring(0, 8)}...
                              <div className="text-xs text-muted-foreground mt-1">
                                {formatDate(booking.createdAt).split(",")[0]}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div>
                              {user}
                              <div className="text-xs text-muted-foreground mt-1">
                                {booking.user?.email || "No email"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {eventName}
                            <div className="text-xs text-muted-foreground mt-1">
                              {venue}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                          >
                            ${booking.priceAtBooking}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(booking.createdAt)}</TableCell>
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
                                className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onSelect={() => handleDelete(booking._id)}
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
              Showing{" "}
              <strong>
                {(pagination.currentPage - 1) * pagination.limit + 1}
              </strong>{" "}
              to{" "}
              <strong>
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.totalDocuments
                )}
              </strong>{" "}
              of <strong>{pagination.totalDocuments}</strong> results
            </div>
            <div className="flex items-center space-x-2">
              {/* <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage <= 1}
                onClick={() => {
                  // Implement previous page logic
                }}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.currentPage >= pagination.numberOfPages}
                onClick={() => {
                  // Implement next page logic
                }}
              >
                Next
              </Button> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
