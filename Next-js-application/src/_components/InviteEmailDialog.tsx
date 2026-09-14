"use client"

import { useState } from "react"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_components/ui/dialog"

import { Button } from "@/_components/ui/button"
import { Input } from "@/_components/ui/input"
import { Label } from "@/_components/ui/label"
import { X } from "lucide-react"

import { inviteEmail } from "@/_actions/inviteEmail"
import { toast } from "sonner"

export function InviteEmailDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleInvite = async () => {
    if (!email.trim()) {
      setMessage("Please enter an email address")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const result = await inviteEmail(email.trim())

      if (result.success) {
        // Clear everything after successful invite
        setEmail("")
        setMessage("")

        toast.success("Invitation sent successfully!")

        // Close dialog
        setOpen(false)
      } else {
        setMessage(result.message)
      }
    } catch {
      setMessage("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)

    // Reset form whenever dialog is opened
    if (value) {
      setEmail("")
      setMessage("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="
            bg-amber-400
            text-[#080a0f]
            hover:bg-amber-300
            font-mono
            text-[11px]
            uppercase
            tracking-widest
          "
        >
          Add Email
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        {/* Close button */}
        <DialogClose asChild>
          <button
            type="button"
            className="
              absolute
              right-4
              top-4
              rounded-sm
              opacity-70
              transition-opacity
              hover:opacity-100
              focus:outline-none
            "
            aria-label="Close"
            disabled={loading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle>Invite by email</DialogTitle>

          <DialogDescription>
            Enter the email address you want to add.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-4">
          <Label htmlFor="invite-email">
            Email address
          </Label>

          <Input
            id="invite-email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          {message && (
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={handleInvite}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send invite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}