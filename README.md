# Areeb-Task  
Full-stack event booking system  
Don't forget to read Areeb Task Submission.pdf pls
---

## 🚀 Getting Started – Backend Setup

### 1. 🛠️ Prepare Environment Variables

Before running the backend, create a MongoDB database (locally or via MongoDB Atlas), and set up a DigitalOcean Space (S3-compatible) for image uploads.

Create a file named `config.env` inside the `backend/` directory with the following variables:

```env
PORT=8000
NODE_ENV=development
BASE_URL= http://localhost:8000/

# Database
DB_URI=your_mongo_connection_string

# JWT Auth
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRE_TIME=7d

# DigitalOcean Space (S3 Compatible)
DO_ACCESS_KEY=your_access_key
DO_SECRET_KEY=your_secret_key
DO_SPACE_NAME=your_space_name
DO_SPACE_REGION=your_region
DIGITAL_OCEAN_BASE_URL=https://your-space-url

run backend:
- cd backend
- npm install
- npm run start:dev

## 🚀 Getting Started – Frontend Setup

- cd frontend

First, install dependencies:
# npm install
Second, run dev server:
# npm run dev
Third , before deploy
# npm run build


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
