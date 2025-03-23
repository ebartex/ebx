"use client"

import * as React from "react"
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"


export function CommandDialogInput() {
  const [open, setOpen] = React.useState(false)

  // Funkcja do otwierania dialogu po kliknięciu w input
  const openDialog = () => setOpen(true)



  return (
    <>

      {/* Input, który uruchamia dialog po kliknięciu */}
      <Input
        type="text"
        onClick={openDialog}  // Otwiera dialog po kliknięciu
        placeholder="Czego dziś szukasz?"
        className="border p-2 rounded-md w-64"
      />

      {/* Dialog z shadcn */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Wpisz nazwę produktu kod kreskowy lub kod katalogowy..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
