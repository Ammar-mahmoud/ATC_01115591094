"use client";
import { useUserContext } from "@/app/context/UserContext";
import { sideBarLinks } from "@/data/sideBarLinks";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar({
  styleClass,
  imgStyle,
  isAdmin,
}: {
  imgStyle?: string;
  styleClass?: string;
  isAdmin?: boolean;
}) {
  const { user } = useUserContext();
  const router = useRouter();
  return (
    <header className={`absolute inset-x-0 top-0 z-10 ${styleClass}`}>
      <div className="px-4  sm:px-4 lg:px-4 max-w-11xl">
        <div className="flex items-center justify-between">
          <div className="flex flex-shrink-0">
            <a
              href="#"
              title="BakerStreet"
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-secondary focus:ring-primary"
            >
              <img
                className={`w-auto  ${imgStyle ?? "h-38"}`}
                src="https://i.postimg.cc/0y8wjx8f/Zevent.png"
                alt="BakerStreet"
              />
            </a>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              className="p-2 -m-2 transition-all duration-200 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary"
            ></button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-10 lg:ml-28">
            {sideBarLinks.map((link) => {
              if (user && ["Login", "Signup"].includes(link.itemName)) {
                if (link.itemName === "Login") {
                  return (
                    <div
                      key="user-icon"
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center"
                    >
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                }
                return null;
              }
              if (!user && ["Logout"].includes(link.itemName)) {
                return null;
              }
              return (
                <a
                  key={link.itemName}
                  href={link.itemLink}
                  title=""
                  className="font-sans text-base font-normal transition-all duration-200 rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary"
                >
                  {link.itemName}
                </a>
              );
            })}

            {isAdmin && (
              <a
                key={9}
                onClick={() => router.replace("/admin")}
                title=""
                className="font-sans cursor-pointer text-base font-normal transition-all duration-200 rounded text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary"
              >
                Admin Panel
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
