'use client';
import type { ReactNode } from "react";
import { createContext, useContext, useState, useCallback, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  role : string;
};

type UserContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  booking : any;
  confirmBooking : (data:any)=> void;
  resetBooking : ()=> void;
  currentEvent : any;
  setEventManual : (event:any)=> void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [booking , setBooking] = useState<any>(null);
  const [event,setEvent] = useState(null);

  const login = useCallback((userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
    }
  }, []);


  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  }, []);

  const confirmBooking = useCallback((data)=>{
    setBooking(data);
  },[])

  const resetBooking = useCallback(()=>{
    setBooking(null);
  },[])

  const setEventManual = useCallback((event)=>{
    setEvent(event);
  },[])

  // Optional: Initialize from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        login(JSON.parse(savedUser));
      }
    }
  }, [login]);

  return (
    <UserContext.Provider value={{setEventManual,currentEvent:event, user,isAuthenticated, login, logout ,booking,confirmBooking , resetBooking }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
}