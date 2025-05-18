import { number, object, string } from "yup";

export const AddEventSchema = object({
  name: object({
    en: string().required('Title is required').min(5, "Minimum 5 characters!")
  }),
  description: string().required("Description is Required !").min(30, "At least 30 character!"),
  date: string().required('Date is required'),
  price: number(),
  image: string(),
  ticketQuantity: number(),
  category:string(),
  venue: object({
    en: string()
  })
});