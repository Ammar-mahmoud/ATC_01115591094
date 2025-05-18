"use client";
import { Calendar, MapPin, Router } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface EventCardProps {
  data: {
    name?: string;
    date?: string;
    venue: {
      location: { en: string; ar: string };
    };
    imageUrl?: string;
    category?: string;
    price?: string;
  };
  skeleton: boolean;
}

export default function EventCard({ data, skeleton }: EventCardProps) {
  const router = useRouter();
  return (
    <Card
      onClick={() => router.replace(`/events/${data?.id}`)}
      className={` w-full  cursor-pointer group hover:shadow-lg transition-all min-h-70 duration-300 bg-gray-300 ${
        skeleton && "bg-gray-300 animate-pulse"
      }`}
    >
      {data && (
        <>
          <div className="relative h-48  w-full  overflow-hidden">
            <Image
              src={data?.imageUrl ?? ""}
              alt={data?.name?.en || "Event image"}
              sizes={"100vw"}
              fill
              className="object-cover w-full min-h-40 transition-transform duration-300 group-hover:scale-105"
            />
            {data?.isBooked && (<div className="absolute top-2 left-2">
              <Badge className="bg-black text-white">
                {data?.isBooked && "Booked"}
              </Badge>
            </div>)}
            <div className="absolute top-2 right-2">
              <Badge className="bg-purple-600 hover:bg-purple-700">
                {data?.category?.name?.en}
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2">
              <Badge
                variant="outline"
                className="bg-background/80 backdrop-blur-sm"
              >
                {data?.price}
              </Badge>
            </div>
          </div>
          <CardContent className="p-2">
            <h3 className="font-semibold text-lg line-clamp-1 mb-2 ">
              {data?.name?.en}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{data?.date}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{data?.venue?.en}</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <button className="cursor-pointer text-sm font-medium text-purple-600 hover:text-purple-700">
              View Details →
            </button>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
