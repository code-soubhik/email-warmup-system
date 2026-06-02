"use client"

import { UserSessionInterface } from "@/types/interfaces"
import { createContext, ReactNode, useContext, useState } from "react"

type SessionContextType = {
  session: UserSessionInterface
  setSession: React.Dispatch<React.SetStateAction<UserSessionInterface>>
}

const SessionContext = createContext<SessionContextType | null>(null)

export const SessionProvider = ({
  children,
  defaultValue
}: {
  children: ReactNode
  defaultValue: UserSessionInterface
}) => {
  const [session, setSession] = useState<UserSessionInterface>(defaultValue)

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSessionAuth = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used inside SessionProvider")
  }

  return context
}