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
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image"; // Dodaj import Image
import { useRouter } from "next/navigation"; // Hook do nawigacji

// Definicja interfejsu dla wyników
interface SearchResult {
  nazwa: string; // Możesz dodać inne właściwości, które są w danych z API
}

export function CommandDialogInput() {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState(""); // Przechowywanie zapytania
  const [results, setResults] = React.useState<SearchResult[]>([]); // Wyniki wyszukiwania
  const [loading, setLoading] = React.useState(false); // Flaga ładowania
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout | null>(null); // Timer dla debouncingu

  const router = useRouter(); // Hook do nawigacji

  // Funkcja otwierająca dialog
  const openDialog = () => setOpen(true);

  // Funkcja do obsługi zmiany tekstu w polu wyszukiwania
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Jeśli zapytanie ma więcej niż 2 znaki, zaczynamy wyszukiwanie
    if (query.length > 2) {
      // Resetujemy wynik, żeby pokazać skeleton do momentu zakończenia wyszukiwania
      setResults([]);

      // Zatrzymujemy poprzedni timer, jeśli istnieje
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      // Ustawiamy nowy timer, aby rozpocząć wyszukiwanie po 500ms od zakończenia pisania
      const timer = setTimeout(() => {
        fetchResults(query);
      }, 500); // Czas debouncingu - 500ms

      // Przechowujemy timer
      setDebounceTimer(timer);
    } else {
      setResults([]); // Resetuj wyniki, jeśli zapytanie jest krótkie
    }
  };

  // Funkcja do pobierania wyników z API
  const fetchResults = async (query: string) => {
    setLoading(true);

    try {
      const response = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-nazwa=?${query}?`);
      const data: SearchResult[] = await response.json(); // Zakładając, że API zwraca dane w tym formacie
      setResults(data); // Zaktualizuj wyniki
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      setResults([]);
    } finally {
      setLoading(false); // Zakończ ładowanie
    }
  };

  // Funkcja do obsługi kliknięcia na przycisk "Przejdź do wyników" w footerze
  const handleGoToResultsClick = () => {
    if (searchQuery.length > 2) {
      router.push(`/search?query=${searchQuery}`); // Przekierowanie na stronę wyników
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
        <div className="relative">
          <Input
            placeholder="Wpisz nazwę produktu, kod kreskowy lub kod katalogowy..."
            value={searchQuery} // Wartość kontrolowana przez React
            onChange={handleSearchChange} // Obsługuje zmiany tekstu
          />
        </div>
        <CommandList className="h-2000">
          {loading || results.length === 0 ? (
      <CommandEmpty>
      {searchQuery.length > 2 ? (
        [...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-12 mb-2" />
        ))
      ) : (
        <span>Brak wyników</span>
      )}
    </CommandEmpty>
          ) : (
            <CommandGroup heading="Wyniki wyszukiwania">
              {results.slice(0, 6).map((result, index) => (
                <CommandItem key={index}>
                  <span>
                    <Image src="/products_thumbs.png" alt="logo" width={30} height={30} />
                  </span>
                  <span>{result.nazwa}</span> {/* Zaktualizuj pole, jeśli struktura danych jest inna */}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>

        {/* Footer z przyciskiem "Przejdź do wyników" */}
        {searchQuery.length > 2 && (
          <div className="p-4 border-t border-gray-200">
            <button
              className="w-full bg-blue-600 text-white py-2 rounded-md"
              onClick={handleGoToResultsClick}
            >
              Przejdź do wyników
            </button>
          </div>
        )}
      </CommandDialog>
    </>
  );
}
