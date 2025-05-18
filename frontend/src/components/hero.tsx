"use client";
import { sideBarLinks } from "@/data/sideBarLinks";
import React from "react";
import Navbar from "./navbar";
import { useUserContext } from "@/app/context/UserContext";

const Hero = () => {
  const {user} = useUserContext();
  return (
    <div className="relative pt-30 pb-12 bg-black xl:pt-45 sm:pb-16 lg:pb-32 xl:pb-48 2xl:pb-56">
      {/* Header/Nav remains the same */}
      <Navbar isAdmin={user?.role=="admin"}/>

      {/* Background Image */}
      <div className="absolute   inset-0">
        <img
          className="object-cover w-full h-full opacity-60"
          src="https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Event crowd background"
        />
      </div>

      {/* Hero Content */}
      <div className="relative h-full">
        <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-white">
              <span className="block font-sans text-5xl font-light tracking-wider sm:text-6xl md:text-7xl">
                Crafting
              </span>
              <span className="block mt-2 font-serif text-6xl italic font-normal leading-tight sm:text-7xl md:text-8xl">
                Moments That Move
              </span>
              <span className="block font-serif text-6xl italic font-normal leading-tight sm:text-7xl md:text-8xl">
                The World
              </span>
            </h1>
            
            <p className="mt-6 font-sans text-lg font-light leading-relaxed text-white text-opacity-90 sm:text-xl">
              We design extraordinary experiences that inspire action, forge connections, 
              and leave lasting impressions—from global tech summits to championship celebrations.
            </p>

            {/* CTA Buttons (unchanged) */}
            <div className="flex items-center justify-center mt-10 space-x-4 sm:space-x-6">
              <a
                href="#"
                title=""
                className="
                            inline-flex
                            items-center
                            justify-center
                            px-5
                            py-2
                            font-sans
                            text-base
                            font-semibold
                            leading-6
                            transition-all
                            duration-200
                            border-2 border-transparent
                            rounded-full
                            sm:leading-8
                            bg-white
                            sm:text-lg
                            text-black
                            hover:bg-opacity-90
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-secondary
                        "
                role="button"
              >
                Explore Events
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator (unchanged) */}
      <div className="absolute hidden transform -translate-x-1/2 lg:bottom-8 xl:bottom-12 left-1/2 lg:block">
         <a
          href="#"
          title=""
          className="inline-flex items-center justify-center w-12 h-12 transition-all duration-200 rounded-full text-white hover:bg-white hover:text-black bg-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:ring-offset-secondary"
          role="button"
        >
        </a>
      </div>
    </div>
  );
};

export default Hero;
