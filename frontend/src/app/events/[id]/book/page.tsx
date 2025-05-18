"use client";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  MapPin,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox";
import { sideBarLinks } from "@/data/sideBarLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import eventsService from "@/lib/domain/events/events.service";
import { useParams, useRouter } from "next/navigation";
import bookingService from "@/lib/domain/booking/booking.service";
import { useUserContext } from "@/app/context/UserContext";
import Navbar from "@/components/navbar";

export default function BookTickets() {
  const { id } = useParams();
  const router = useRouter();
  const { user,confirmBooking} = useUserContext();
  console.log(id);
  const [loading, setLoading] = useState(true);
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [event, setEvent] = useState(null);
  const [ticketCounter, setTicketCounter] = useState<number>(1);
  const [isValid, setValid] = useState(true);
  const [error, setError] = useState(null);
  const getEventById = async (id: string) => {
    setLoading(true);
    try {
      const event = await eventsService.getEventById(id || "1");
      console.log(event.data);
      setEvent(event.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };


  useEffect(() => {
    getEventById(id);
  }, []);

  useEffect(() => {
    console.log(event)
    if(event && event?.isBooked){
      alert("Operation Reestricted !")
      router.replace("/")
    }
  }, [event]);

  // This would normally fetch the event data based on the ID
  const dummyevent = {
    id: id,
    title: "TechConf 2023: Future of Web Development",
    date: "November 15, 2023",
    time: "10:00 AM - 6:00 PM",
    location: "Tech Hub, San Francisco, CA",
    image: "/placeholder.svg?height=400&width=800",
    ticketTypes: [
      {
        id: "regular",
        name: "Regular",
        price: 99,
        description: "Standard admission",
      },
      {
        id: "vip",
        name: "VIP",
        price: 149,
        description:
          "Priority seating, exclusive networking event, conference swag",
      },
      {
        id: "group",
        name: "Group (4+)",
        price: 79,
        description: "Per person, minimum 4 tickets",
        minQuantity: 4,
      },
    ],
  };

  const submitBook = async () => {
    setLoadingIndicator(true);
    try {
      const book = await bookingService.book(id || "1", { user: user.id });
      console.log("response", book.data.data);
      confirmBooking({ ...(book.data.data || {}), ...(event || {}),...{_id:book.data.data._id} });
      router.replace(`/events/${id}/book/confirmation`)
    } catch (err) {
      console.log("error", err);
    } finally {
      setTimeout(() => {
        setLoadingIndicator(false);
      }, 1500);
    }
  };

  useEffect(() => {
    console.log("ff",user);
  }, []);

  useEffect(() => {
    if (event) {
      if (
        ticketCounter > event?.ticketQuantity - event?.soldTickets &&
        event?.ticketQuantity != 0
      ) {
        return setError(
          `Only Available Tickets Are ${
            event?.ticketQuantity - event?.soldTickets
          }`
        );
      }
    }
    return setError(null);
  }, [ticketCounter]);

  if (loading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-[100vh] w-[100vw] bg-gray-200">
        <FontAwesomeIcon icon={faSpinner} spin />
        <p>Loading..</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 ">
      <div className="w-full py-4 bg-white ">
        {/* Header/Nav remains the same */}
        <Navbar imgStyle="h-20" styleClass="bg-black text-white p-0"/>
      </div>

      <div className="py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-2">
              <CardHeader>
                <CardTitle className="text-2xl">Book Tickets</CardTitle>
                <CardDescription>
                  Complete your ticket purchase for {event?.name?.en}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Event Summary */}
                <div className="flex items-start gap-4 mb-6 p-4 bg-muted rounded-lg">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={event.imageUrl || "/placeholder.svg"}
                      alt={event.name.en}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{event.name.en}</h3>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      {/* <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{event.time}</span>
                      </div> */}
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.venue.en}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Number of Tickets
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Select
                        onValueChange={(value) =>
                          setTicketCounter(parseInt(value))
                        }
                        defaultValue="1"
                      >
                        <SelectTrigger id="quantity">
                          <SelectValue placeholder="Select quantity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-red-500">{error}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="promo">Promo Code</Label>
                      <Input id="promo" placeholder="Enter code (optional)" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Ticket Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">Delivery</h4>
                  <p className="text-muted-foreground">
                    E-tickets will be sent to your email immediately after
                    purchase
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Refund Policy</h4>
                  <p className="text-muted-foreground">
                    Full refund available up to 7 days before the event
                  </p>
                </div>

                <div>
                  <h4 className="font-medium">Transfer</h4>
                  <p className="text-muted-foreground">
                    Tickets can be transferred to another person up to 24 hours
                    before the event
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6 ">
            <Card className=" top-6 p-2 ">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Regular Ticket × {ticketCounter}</span>
                    <span>${ticketCounter * (event?.price || 1)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-sm">
                    <span>Service Fee</span>
                    <span>$4.95</span>
                  </div>
                </div>

                {/* <Separator /> */}

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${ticketCounter * (event?.price || 1)}</span>
                </div>

                <div className="bg-muted p-3 rounded-lg text-sm text-muted-foreground flex items-start space-x-2">
                  <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p>
                    Your purchase is secure and encrypted. All ticket purchases
                    are subject to our refund policy.
                  </p>
                </div>

                <Button
                  onClick={() => submitBook()}
                  disabled={error !== null}
                  size="lg"
                  className={`w-full cursor-pointer ${
                    error && "bg-neutral-200"
                  }`}
                >
                  {loadingIndicator ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    "Complete Purchase"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  You won&apos;t be charged until you complete this purchase
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
