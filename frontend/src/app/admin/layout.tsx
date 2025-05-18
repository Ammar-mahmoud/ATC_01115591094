"use client";
import type React from "react"
import { useEffect, useState, type ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Calendar, Ticket, Users } from "lucide-react"
import { useUserContext } from "../context/UserContext";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const {user} = useUserContext();
  const [loading,setLoading] = useState(true);
  const router = useRouter();
  useEffect(()=>{
    console.log(user)
    if(user===null || user?.role=="user") return router.replace("/")
    setTimeout(()=>setLoading(false),1000)
  },[user])

  if (loading) {
      return (
        <div className="flex flex-col gap-2 justify-center items-center h-[100vh] w-[100vw] bg-gray-200">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl" />
          <p>Loading...</p>
        </div>
      );
    }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-background border-r h-screen sticky top-0">
        <div className="p-6 border-b">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Calendar className="h-6 w-6" />
            <span >ZEvent</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">

          <div className="mt-1 space-y-1">
            <p className="text-xs font-medium text-muted-foreground px-2 py-2">Management</p>
            <NavItem href="/admin" icon={<Calendar className="h-4 w-4 mr-3" />}>
              Events
            </NavItem>
            <NavItem href="/admin/bookings" icon={<Ticket className="h-4 w-4 mr-3" />}>
              Bookings
            </NavItem>
            <NavItem href="/admin/users" icon={<Users className="h-4 w-4 mr-3" />}>
              Users
            </NavItem>
          </div>
        </nav>

        <div className="p-4 border-t mt-auto">
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-background border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <Calendar className="h-5 w-5" />
            <span>EventHub</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1  pt-16 md:pt-0">
        <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  )
}

function NavItem({
  href,
  icon,
  children,
}: {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  // In a real app, you would check if the current path matches the href
  const isActive = false

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center text-sm px-3 py-2 rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      {icon}
      {children}
    </Link>
  )
}
