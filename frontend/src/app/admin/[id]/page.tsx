"use client";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AddEventSchema } from "@/utils/schema/addEvent";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import categoriesService from "@/lib/domain/categories/categories.service";
import useFileUpload from "@/hooks/file-upload";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/context/UserContext";

export default function NewEventPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [receivedData, setReceivedData] = useState(null);
  const { uploadFile } = useFileUpload();
  const router = useRouter();
  const {currentEvent} = useUserContext();


  const getCategories = async () => {
    try {
      const resp = await categoriesService.getCategories();
      console.log(resp.data.data);
      setCategories(resp.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Formik
      validationSchema={AddEventSchema}
      onSubmit={async (values: any) => {
        console.log("form values : ", values);
        setLoading(true);
        try {
          const { image, ...otherValues } = values;

          // Convert date to ISO string if needed
          if (otherValues.date) {
            otherValues.date = new Date(otherValues.date).toISOString();
          }

          const response = await uploadFile(
            image,
            `http://localhost:8000/api/v1/events/${currentEvent._id}`,
            "image",
            "PUT",
            otherValues
          );

          console.log("Upload successful:", response);
          setTimeout(()=>router.replace("/admin"),400)
          // Handle successful upload (redirect, show message, etc.)
        } catch (error: any) {
          console.error("Upload failed with details:", {
            message: error.message,
            status: error.status,
            data: error.data,
          });

          // Show detailed error to user
          alert(
            `Error: ${error.message}\nStatus: ${
              error.status
            }\nDetails: ${JSON.stringify(error.data, null, 2)}`
          );
        } finally {
          setLoading(false);
        }
      }}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={true}
      initialValues={{
        name: { en:  currentEvent?.name?.en || "" },
        price: currentEvent?.price || "",
        description: currentEvent?.description?.en ||"",
        image: null,
        date: currentEvent?.date ||"",
        ticketQuantity: currentEvent?.ticketQuantity||"",
        venue: {en:currentEvent?.venue?.en} ||{ en: "" },
      }}
    >
      {({ errors, touched, isValid, setFieldValue, values }) => (
        <Form className="flex flex-col gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Link
                    href="/admin/events"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Create New Event
                  </h1>
                </div>
                <p className="text-muted-foreground">
                  Add a new event to your platform.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  disabled={!isValid || loading}
                  className={`w-full cursor-pointer ${
                    (!isValid || loading) && "bg-neutral-200"
                  }`}
                >
                  {loading ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    "Create Event"
                  )}
                </Button>
              </div>
            </div>

            <Card className="p-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details about your event.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Field
                    name="name.en"
                    type="text"
                    className={`w-full rounded-lg border p-2 text-grayscale-700 ${
                      errors["name.en"] && touched["name.en"]
                        ? "border-red-500"
                        : "border-grayscale-75"
                    }`}
                  />
                  <ErrorMessage
                    name="name.en"
                    component="div"
                    className="m-0 text-sm text-red-400 text-alert-error"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Field
                    name="description"
                    as="textarea"
                    className={`w-full rounded-lg border p-2 text-grayscale-700 ${
                      errors["description"] && touched["description"]
                        ? "border-red-500"
                        : "border-grayscale-75"
                    }`}
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="m-0 text-sm text-red-400 text-alert-error"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.isArray(categories) &&
                          categories.map((category, index) => (
                            <SelectItem key={index} value={`${category.id}`}>
                              {category.name.en}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Enter tags separated by commas"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Event Price</Label>
                  <Field
                    name="price"
                    type="text"
                    className={`w-full rounded-lg border p-2 text-grayscale-700 ${
                      errors["price"] && touched["price"]
                        ? "border-red-500"
                        : "border-grayscale-75"
                    }`}
                  />
                  <ErrorMessage
                    name="price"
                    component="div"
                    className="m-0 text-sm text-red-400 text-alert-error"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Ticket Quantity</Label>
                  <Field
                    name="ticketQuantity"
                    type="text"
                    className={`w-full rounded-lg border p-2 text-grayscale-700 ${
                      errors["ticketQuantit"] && touched["ticketQuantit"]
                        ? "border-red-500"
                        : "border-grayscale-75"
                    }`}
                  />
                  <ErrorMessage
                    name="ticketQuantit"
                    component="div"
                    className="m-0 text-sm text-red-400 text-alert-error"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader>
                <CardTitle>Date & Time</CardTitle>
                <CardDescription>
                  When will your event take place?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Field
                        name="date"
                        type="date"
                        className="pl-10 w-full rounded-lg border p-2 text-grayscale-700"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader>
                <CardTitle>Location</CardTitle>
                <CardDescription>
                  Where will your event take place?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Field
                      name="venue.en"
                      type="text"
                      className={`w-full rounded-lg border p-2 pl-8 text-grayscale-700 ${
                        errors["venue.en"] && touched["venue.en"]
                          ? "border-red-500"
                          : "border-grayscale-75"
                      }`}
                    />
                    <ErrorMessage
                      name="venue.en"
                      component="div"
                      className="m-0 text-sm text-red-400 text-alert-error"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="p-2">
              <CardHeader>
                <CardTitle>Event Media</CardTitle>
                <CardDescription>
                  Upload images and videos for your event.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Drag and drop your image here
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supports: JPG, PNG, GIF (Max 5MB)
                      </p>
                      <div>
                        <input
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setFieldValue("image", file);
                            }
                          }}
                          className="border-1"
                          disabled={uploading}
                        />
                        {uploading && <span>Uploading...</span>}
                        {values.image && (
                          <p className="mt-2 text-sm">
                            Selected file: {values.image.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Form>
      )}
    </Formik>
  );
}
