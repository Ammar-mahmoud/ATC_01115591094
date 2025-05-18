# Areeb-Task  
Full-stack event booking system  

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



