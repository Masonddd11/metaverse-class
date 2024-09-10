"use client";

import React, { createContext, useContext } from "react";
import { User, Session } from "lucia";

interface SessionContextType {
  user: User | null;
  session: Session | null;
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  session: null,
});

export const useSession = () => useContext(SessionContext);

export function SessionProvider({
  children,
  user,
  session,
}: {
  children: React.ReactNode;
  user: User | null;
  session: Session | null;
}) {
  return (
    <SessionContext.Provider value={{ user, session }}>
      {children}
    </SessionContext.Provider>
  );
}
