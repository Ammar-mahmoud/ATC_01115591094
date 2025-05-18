"use client";
import { ArrowLeft, Calendar, Check, Download, MapPin, Router, Share2, Ticket } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUserContext } from "@/app/context/UserContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingConfirmation() {
  // This would normally fetch the event and booking data based on the ID
  const {user,booking:booking1,resetBooking}=useUserContext()
  const router = useRouter();
  const event = {
    id: 1,
    title: "TechConf 2023: Future of Web Development",
    date: "November 15, 2023",
    time: "10:00 AM - 6:00 PM",
    location: "Tech Hub, San Francisco, CA",
    image: "/placeholder.svg?height=400&width=800",
  }

  const booking = {
    id: "TCF-2023-12345",
    date: "October 10, 2023",
    ticketType: "Regular",
    quantity: 1,
    total: "$103.95",
    attendee: "John Doe",
    email: "john.doe@example.com",
  }

  useEffect(()=>{
    console.log(booking1)
     if(!booking1?._id){
      router.replace(`/`)
     }
    // return ()=>{
    //   resetBooking()
    // }
  },[])

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h1>
            <p className="text-green-700">
              Your tickets have been booked successfully. A confirmation email has been sent to {user?.email}.
            </p>
          </div>

          {/* Ticket Information */}
          <Card className="p-2">
            <CardHeader className="border-b mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Booking Details</CardTitle>
                  <CardDescription>Booking ID: {booking1?._id}</CardDescription>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Tickets
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex gap-4 items-start">
                    <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={booking1?.imageUrl || "/placeholder.svg"} alt={'placeholder'} fill className="object-cover" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-lg">{booking1?.name?.en}</h2>
                      <div className="text-sm text-muted-foreground space-y-1 mt-2">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{booking1?.date}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{booking1?.venue?.en}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Attendee Information</h3>
                      <p className="text-sm">{booking1?.soldTickets+" Attendees"}</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Important Information</h3>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>Please arrive 30 minutes before the event starts for check-in</li>
                        <li>Bring a photo ID that matches the name on your ticket</li>
                        <li>Your e-ticket will be scanned at the entrance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ticket Summary */}
                <div className="md:w-64 space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Ticket className="h-4 w-4" />
                      Ticket Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Ticket Type:</span>
                        <span className="font-medium">{'Regular'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity:</span>
                        <span className="font-medium">{'1'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Booking Date:</span>
                        <span className="font-medium">{booking?.date}</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total Paid:</span>
                        <span>{booking1?.priceAtBooking}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-3">Share Your Booking</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Let your friends know you're attending this event!
                    </p>
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Link href={`/`}>
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Event
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
