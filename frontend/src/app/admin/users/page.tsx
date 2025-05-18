"use client";
import Link from "next/link";
import {
  Download,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  User,
  Calendar,
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
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import usersService from "@/lib/domain/users/users.service";

// Mock service for demonstration - replace with your actual service
// const usersService = {
//   getPagedUsers: async () => {
//     // This would be your actual API call
//     return {
//       data: {
//         results: 10,
//         paginationResult: {
//           currentPage: 1,
//           limit: 10,
//           numberOfPages: 2,
//           totalDocuments: 12,
//           next: 2,
//         },
//         data: [
//           {
//             _id: "a9c2f487-d0b8-4ecf-a6fa-7abdb7ce25b4",
//             name: "Mohamed Kamal",
//             email: "mn@gmail.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-15T22:26:00.715Z",
//             updatedAt: "2025-05-15T22:26:01.176Z",
//           },
//           {
//             _id: "f585cc80-5199-4c3f-a048-0caa22bc6ebf",
//             name: "Mohamed Kamal",
//             email: "ms@gmail.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-15T22:26:31.052Z",
//             updatedAt: "2025-05-15T22:26:31.494Z",
//           },
//           {
//             _id: "39795e4f-3017-4cc0-a108-22a76d7c9e55",
//             name: "Mohamed Kamal",
//             email: "superadmin@example.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-15T21:31:57.707Z",
//             updatedAt: "2025-05-17T13:51:40.643Z",
//           },
//           {
//             _id: "e18fd63b-38c0-4336-ab5f-b5676f1104e4",
//             name: "Mohamed Kamal",
//             email: "seradmin@example.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-15T21:34:27.580Z",
//             updatedAt: "2025-05-15T21:34:28.052Z",
//           },
//           {
//             _id: "c8708a5c-c7ec-4116-b39e-0c26df490b60",
//             name: "Mohamed Kamal",
//             email: "superadin@example.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-15T21:33:00.100Z",
//             updatedAt: "2025-05-15T21:33:00.555Z",
//           },
//           {
//             _id: "1a1a6fd7-cd49-4862-9375-c530f331f461",
//             name: "test1",
//             email: "mk5391130@gmail.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-15T19:44:32.403Z",
//             updatedAt: "2025-05-15T19:44:32.862Z",
//           },
//           {
//             _id: "2d29fd9a-8dad-4552-9f1a-63258f3223ee",
//             name: "ammar",
//             email: "ammar@gmail.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-10T10:31:47.227Z",
//             updatedAt: "2025-05-10T10:46:06.693Z",
//           },
//           {
//             _id: "50c43305-d05e-4c5d-a6ec-186ad652a54a",
//             name: "Client User",
//             email: "client@example.com",
//             role: "user",
//             gender: null,
//             deletedAt: null,
//             createdAt: "2025-05-09T19:58:15.302Z",
//             updatedAt: "2025-05-09T19:58:15.302Z",
//           },
//           {
//             _id: "db5d1538-f57a-44df-ada9-3f4d1a7e3983",
//             name: "ammar",
//             email: "ammar2@gmail.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-12T20:22:11.942Z",
//             updatedAt: "2025-05-17T19:11:17.383Z",
//           },
//           {
//             _id: "c541cebb-d6f9-4b87-9f68-e38844e71aca",
//             name: "Mohamed Kamal",
//             email: "supradmin@example.com",
//             role: "user",
//             gender: "Male",
//             deletedAt: null,
//             createdAt: "2025-05-15T21:33:44.712Z",
//             updatedAt: "2025-05-15T21:33:45.150Z",
//           },
//         ],
//       },
//     }
//   },
// }

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    numberOfPages: 1,
    totalDocuments: 0,
  });

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await usersService.getPagedUsers();
      console.log("API Response:", response.data);
      setUsers(response.data.data);
      setPagination(response.data.paginationResult);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
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

  // Helper function to get role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Admin
          </Badge>
        );
      case "manager":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Manager
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            User
          </Badge>
        );
    }
  };

  // Helper function to get status badge (based on deletedAt)
  const getStatusBadge = (deletedAt) => {
    if (deletedAt) {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          Deleted
        </Badge>
      );
    } else {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          Active
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions.
          </p>
        </div>
      </div>

      <Card className="p-2">
        <CardHeader className="m-3">
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            You have {pagination?.totalDocuments || 0} users in total.
          </CardDescription>
        </CardHeader>
        <CardContent>

          {/* Users Table */}
          <div className="p-2 rounded-md border overflow-hidden">
            <Table className="p-2">
              <TableHeader className="p-2">
                <TableRow>
                  <TableHead className="w-[250px]">User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(users) &&
                  users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            {user.name}
                            <div className="text-xs text-muted-foreground mt-1">
                              {user._id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{user.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{user.gender || "Not specified"}</TableCell>
                      <TableCell>{getStatusBadge(user.deletedAt)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {formatDate(user.createdAt).split(",")[0]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(user.updatedAt)}</TableCell>
                    </TableRow>
                  ))}
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
