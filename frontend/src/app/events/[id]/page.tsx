"use client";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Share2,
  Heart,
  Users,
  ExternalLink,
  Tag,
  Info,
  Ticket,
  Router,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sideBarLinks } from "@/data/sideBarLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import eventsService from "@/lib/domain/events/events.service";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { useUserContext } from "@/app/context/UserContext";
// import { Separator } from "@/components/ui/separator"

export default function EventDetails() {
  // This would normally fetch the event data based on the ID
  const { id } = useParams();
  const router = useRouter();
  console.log(id);
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const {user} = useUserContext();
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

  const getBookings = async () => {};

  useEffect(() => {
    getEventById(id);
    getBookings();
  }, []);

  const dummyevent = {
    id: id,
    title: "TechConf 2023: Future of Web Development",
    date: "November 15, 2023",
    time: "10:00 AM - 6:00 PM",
    location: "Tech Hub, San Francisco, CA",
    organizer: "TechConf Group",
    organizerImage: "/placeholder.svg?height=40&width=40",
    price: "$99",
    category: "Tech",
    attendees: 243,
    description:
      "Join us for the biggest tech conference of the year focused on the future of web development. Learn from industry experts, network with fellow developers, and get hands-on experience with the latest technologies.",
    longDescription:
      "TechConf 2023 brings together the brightest minds in web development for a day of learning, networking, and inspiration. This year's conference focuses on the future of web technologies and how they're shaping the digital landscape.\n\nWhether you're a seasoned developer or just starting your journey, TechConf offers valuable insights and practical knowledge you can apply immediately. The conference features a mix of presentations, hands-on workshops, and networking opportunities.\n\nTopics covered include modern JavaScript frameworks, serverless architectures, performance optimization, accessibility, and more. You'll leave with new skills, connections, and a renewed passion for web development.",
    image: "/placeholder.svg?height=400&width=800",
    tags: [
      "Web Development",
      "JavaScript",
      "React",
      "Next.js",
      "Frontend",
      "Backend",
      "Full Stack",
    ],
    ticketTypes: [
      { name: "Early Bird", price: "$79", available: false },
      { name: "Regular", price: "$99", available: true },
      {
        name: "VIP",
        price: "$149",
        available: true,
        perks: [
          "Priority seating",
          "Exclusive networking event",
          "Conference swag",
        ],
      },
    ],
  };

  // Mock related events
  const relatedEvents = [
    {
      id: "1",
      title: "JavaScript Meetup",
      date: "November 20, 2023",
      location: "Online",
      image: "/placeholder.svg?height=200&width=300",
      category: "Tech",
    },
    {
      id: "2",
      title: "Design Systems Workshop",
      date: "November 25, 2023",
      location: "Design Studio, San Francisco",
      image: "/placeholder.svg?height=200&width=300",
      category: "Design",
    },
    {
      id: "3",
      title: "React Advanced Conference",
      date: "December 5, 2023",
      location: "Conference Center, New York",
      image: "/placeholder.svg?height=200&width=300",
      category: "Tech",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col gap-2 justify-center items-center h-[100vh] w-[100vw] bg-gray-200">
        <FontAwesomeIcon icon={faSpinner} spin />
        <p>Loading..</p>
      </div>
    );
  } else if (event) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {/* Back Navigation */}
          <div className="w-full py-0">
            {/* Header/Nav remains the same */}
            <Navbar />
          </div>

          {/* Event Hero */}
          <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden">
            <Image
              src={
                event?.imageUrl ||
                "https://th.bing.com/th/id/R.a568438fe79630b9349d9e904db49539?rik=1VOAlZwMV7FceQ&pid=ImgRaw&r=0"
              }
              alt={event?.name?.en || ""}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 to-black" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="container">
                <Badge className="mb-2">{event?.category?.en}</Badge>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">
                  {event?.name?.en}
                </h1>
                <div className="flex flex-wrap gap-4 text-white/90">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(event?.date).toLocaleDateString()}</span>
                  </div>
                  {/* <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{event.time}</span>
                </div> */}
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event?.venue?.en}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{10} attending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8 ">
                {/* About Section */}
                <Card className="p-2">
                  <CardHeader>
                    <CardTitle className="text-2xl">About This Event</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 mb-4">
                    <div className="space-y-1">
                      <p className="text-muted-foreground">
                        {event?.description?.en}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {Array.isArray(event?.tags) && event?.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Section */}
                <Card className="p-2">
                  <CardHeader>
                    <CardTitle className="text-2xl flex gap-2 items-center">
                      <MapPin className="h-5 w-5" />
                      Event Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden border h-[300px] relative">
                      <Image
                        src="/placeholder.svg?height=300&width=600"
                        alt="Event location map"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-4 left-4 bg-background p-3 rounded-md shadow-md">
                        <p className="font-medium">{event?.venue?.en}</p>
                        <Link
                          href="#"
                          className="text-sm text-primary flex items-center mt-1"
                        >
                          Get directions
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Link>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <h3 className="font-medium mb-2">Getting There</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>
                          <span className="font-medium">Public Transit:</span>{" "}
                          The venue is a 5-minute walk from Downtown Station.
                        </p>
                        <p>
                          <span className="font-medium">Parking:</span> Limited
                          parking available at the venue. We recommend using
                          public transportation.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Event Details Summary */}
                <Card className="p-2">
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Date & Time</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event?.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {/* <Separator /> */}
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-sm text-muted-foreground">
                          {event?.venue?.en}
                        </p>
                      </div>
                    </div>
                    {/* <Separator /> */}
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <h3 className="font-medium">Attendees</h3>
                        <p className="text-sm text-muted-foreground">
                          {event?.ticketsSold} people attending
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-14">
                {/* Ticket Options */}
                <Card className="p-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      Tickets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      key={Math.random()}
                      className={`p-4 border rounded-lg `}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">{"Regular"}</h3>
                        <span className="font-bold">{event?.price}</span>
                      </div>
                      {user.role!="admin" && (<Button
                        className="w-full mt-3 cursor-pointer"
                        variant={"default"}
                        disabled={(event?.isBooked)}
                        onClick={() =>
                          router.replace( `/events/${id}/book`)
                        }
                      >
                        <Link href={`/events/${id}/book`}>
                          { (event?.isBooked) ? "Already Booked" : "Purchase"}
                        </Link>
                      </Button>)}
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {event.ticketQuantity == 0
                        ? "unlimited"
                        : (
                            "Only " +
                            (event.ticketQuantity - event.soldTickets)
                          ).toString() + " tickets remaining"}
                    </p>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <Card className="p-2">
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold">
                        Share This Event
                      </span>
                      <div className="flex space-x-2">
                        <Button size="icon" variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                      <p className="mb-2">
                        Event Code:{" "}
                        <span className="font-mono font-medium">TECH2023</span>
                      </p>
                      <p>
                        Use this code when sharing with friends for group
                        discounts!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          {/* <section className="px-8 py-12 bg-muted/50">
            <div className="container">
              <h2 className="text-2xl font-bold mb-6">
                Similar Events You Might Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-background rounded-lg overflow-hidden border"
                  >
                    <div className="relative h-40">
                      <Image
                        src={
                          "https://th.bing.com/th/id/R.a568438fe79630b9349d9e904db49539?rik=1VOAlZwMV7FceQ&pid=ImgRaw&r=0"
                        }
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <Badge className="mb-2">{event.category}</Badge>
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section> */}
        </main>
      </div>
    );
  }
}
