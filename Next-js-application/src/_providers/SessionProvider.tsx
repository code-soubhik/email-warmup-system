"use client"

import { UserSessionInterface } from "@/_types/interfaces"
import { createContext, ReactNode, useContext } from "react"

type SessionContextType = {
  session: UserSessionInterface
}

const SessionContext = createContext<SessionContextType | null>(null)

export const SessionProvider = ({
  children,
  defaultValue
  }: {
  children: ReactNode
  defaultValue: UserSessionInterface
}) => {
  return (
    <SessionContext.Provider value={{ session: defaultValue }}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSessionAuth = () => {
  const context = useContext(SessionContext)

  if (!context) {
    throw new Error("useSession must be used inside SessionProvider")
  }

  return context.session
}