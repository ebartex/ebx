"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";

export function CommandDialogInput() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(""); // Przechowywanie zapytania
  const [results, setResults] = React.useState<any[]>([]); // Wyniki wyszukiwania
  const [loading, setLoading] = React.useState(false); // Flaga ładowania

  // Funkcja otwierająca dialog
  const openDialog = () => setOpen(true);

  // Funkcja do obsługi zmiany tekstu w polu wyszukiwania
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Rozpoczynaj wyszukiwanie po 3 znakach
    if (query.length > 2) {
      fetchResults(query);
    } else {
      setResults([]); // Resetuj wyniki, jeśli zapytanie jest krótkie
    }
  };

  // Funkcja do pobierania wyników z API
  const fetchResults = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-nazwa=?${query}?`);
      const data = await response.json();
      setResults(data); // Zaktualizuj wyniki
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      setResults([]);
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
        className="active:border-none transition-all focus:ring-2 focus:ring-sky-600 focus:ring-offset-1 focus:outline-none pl-6 pr-10 block w-full h-10 rounded-md text-sm border border-sky-700 focus:outline-none"
      />

      {/* Dialog z ShadCN */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Input
          placeholder="Wpisz nazwę produktu, kod kreskowy lub kod katalogowy..."
          value={searchQuery} // Wartość kontrolowana przez React
          onChange={handleSearchChange} // Obsługuje zmiany tekstu
        />
        <CommandList className="h-2000">
          {loading ? (
            <CommandEmpty>Ładowanie wyników...</CommandEmpty>
          ) : results.length === 0 ? (
            <CommandEmpty>Brak wyników.</CommandEmpty>
          ) : (
            <CommandGroup heading="Wyniki wyszukiwania">
              {results.map((result, index) => (
                <CommandItem key={index}>
                  <span>{result.nazwa}</span> {/* Zaktualizuj pole, jeśli struktura danych jest inna */}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
