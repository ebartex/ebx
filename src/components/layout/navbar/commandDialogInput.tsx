"use client";

import * as React from "react";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

export function CommandDialogInput() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]); // Typowanie wyników z API
  const [loading, setLoading] = React.useState(false);

  // Funkcja do otwierania dialogu po kliknięciu w input
  const openDialog = () => setOpen(true);

  // Funkcja do obsługi zmiany wprowadzania tekstu
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    console.log("Search Query:", query); // Sprawdź wartość query

    if (query.length > 2) {
      fetchResults(query); // Dopiero po wpisaniu więcej niż 2 znaków rozpoczynamy wyszukiwanie
    } else {
      setResults([]); // Jeśli zapytanie jest krótkie, resetujemy wyniki
    }
  };

  // Funkcja do pobierania wyników z API
  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.bapi2.ebartex.pl/tw/index?tw-nazwa=?${query}?`
      );
      const data = await response.json();
      console.log("API Response:", data); // Zobacz, jak wygląda struktura danych

      // Sprawdzenie, czy odpowiedź zawiera wyniki
      if (Array.isArray(data)) {
        setResults(data); // Zaktualizuj wyniki
      } else {
        setResults([]); // Jeśli odpowiedź nie jest tablicą, resetuj wyniki
      }
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      setResults([]); // W przypadku błędu resetuj wyniki
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Input, który uruchamia dialog po kliknięciu */}
      <Input
        type="text"
        onClick={openDialog} // Otwiera dialog po kliknięciu
        placeholder="Czego dziś szukasz?"
        value={searchQuery}
        onChange={handleSearchChange} // Obsługuje zmianę w polu tekstowym
        className={`active:border-sky-600 transition-all focus:ring-2 focus:ring-sky-600 focus:ring-offset-1 focus:outline-none pl-6 pr-10 block w-full h-10 rounded-md text-sm border border-sky-700 focus:outline-none`}
      />

      {/* Dialog z shadcn */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Wpisz nazwę produktu, kod kreskowy lub kod katalogowy..." />
        <CommandList>
          {loading ? (
            <CommandEmpty>Ładowanie wyników...</CommandEmpty>
          ) : results.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Wyniki wyszukiwania">
              {results.map((result, index) => (
                <CommandItem key={index}>
                  <span>{result.nazwa}</span> {/* Upewnij się, że pole 'nazwa' istnieje w odpowiedzi API */}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
