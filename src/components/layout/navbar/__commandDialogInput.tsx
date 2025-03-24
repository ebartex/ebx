"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Definicja interfejsu dla wyników
interface SearchResult {
  nazwa: string;
}

export function CommandDialogInput() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);

  const router = useRouter();

  // Funkcja do obsługi zmiany tekstu w polu wyszukiwania
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setResults([]);

      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      const timer = setTimeout(() => {
        fetchResults(query);
      }, 500);

      setDebounceTimer(timer);
    } else {
      setResults([]);
    }
  };

  // Funkcja do pobierania wyników z API
  const fetchResults = async (query: string) => {
    setLoading(true);

    try {
      const response = await fetch(`https://www.bapi2.ebartex.pl/tw/index?tw-nazwa=?${query}?`);
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Błąd podczas pobierania wyników:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja do obsługi kliknięcia na przycisk "Przejdź do wyników" w footerze
  const handleGoToResultsClick = () => {
    if (searchQuery.length > 2) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full h-10 rounded-md">
          Czego dziś szukasz?
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4">
        <div className="space-y-4">
          <Input
            placeholder="Wpisz nazwę produktu, kod kreskowy lub kod katalogowy..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full h-10 mb-4"
          />

          {loading || results.length === 0 ? (
            <div>
              {searchQuery.length > 2 ? (
                [...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-12 mb-2" />
                ))
              ) : (
                <span></span>
              )}
            </div>
          ) : (
            <div>
              <h4 className="font-semibold">Wyniki wyszukiwania</h4>
              {results.slice(0, 6).map((result, index) => (
                <div key={index} className="flex items-center p-2">
                  <Image src="/products_thumbs.png" alt="logo" width={30} height={30} />
                  <span className="ml-3">{result.nazwa}</span>
                </div>
              ))}
            </div>
          )}

          {searchQuery.length > 2 ? (
            <div className="p-2 border-t border-gray-200">
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-md"
                onClick={handleGoToResultsClick}
              >
                Przejdź do wyników
              </button>
            </div>
          ) : (
            <div className="p-2 border-t border-gray-200">
              <button
                disabled={true}
                className="w-full bg-slate-200 text-white py-2 rounded-md"
                onClick={handleGoToResultsClick}
              >
                Przejdź do wyników
              </button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
