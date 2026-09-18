"use client";

import { createContext, useContext } from "react";
import type { Profile } from "@/content/profile.types";

// The console runs in the browser; it gets the contact lines from the page that mounts it.
export const ContactContext = createContext<Profile["header"] | null>(null);
export const useContact = () => {
  const h = useContext(ContactContext);
  if (!h) throw new Error("Console needs <ContactContext.Provider value={profile.header}>");
  return h;
};
