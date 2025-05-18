import axios from "axios";

const client = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Client-side interceptor
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  console.log("intercepted from client...", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle on client-side
    if (typeof window !== "undefined" && error.response?.status === 401) {
      // Clear auth token
      localStorage.removeItem("authToken");

      // Redirect to login page
      window.location.href = "/auth/login"; // Full page reload to clear state

      // Alternatively, if using Next.js router:
      // const router = useRouter();
      // router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default client;
