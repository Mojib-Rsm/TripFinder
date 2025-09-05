
"use client"

import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from './ui/input';
import { Airport } from '@/lib/types';
import { Loader2, MapPin } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface AirportInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function AirportInput({ value, onChange, placeholder }: AirportInputProps) {
    const [query, setQuery] = useState(value);
    const [suggestions, setSuggestions] = useState<Airport[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debouncedQuery = useDebounce(query, 300);

    const fetchSuggestions = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            setSuggestions([]);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/airports?query=${searchQuery}`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Failed to fetch airport suggestions:", error);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debouncedQuery) {
            fetchSuggestions(debouncedQuery);
        } else {
            setSuggestions([]);
        }
    }, [debouncedQuery, fetchSuggestions]);

    const handleSelect = (airportCode: string) => {
        setQuery(airportCode);
        onChange(airportCode);
        setShowSuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value.toUpperCase());
        onChange(e.target.value.toUpperCase());
        if (!showSuggestions) {
            setShowSuggestions(true);
        }
    }

    return (
        <div className="relative" ref={containerRef}>
            <Input
                placeholder={placeholder}
                value={query || ''}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                className="h-14 text-base bg-gray-100 uppercase"
                autoComplete="off"
            />
            {showSuggestions && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
                    {isLoading && <div className="p-4 flex items-center justify-center"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>}
                    {!isLoading && suggestions.length > 0 && (
                        <ul className="py-1">
                            {suggestions.map((airport) => (
                                <li
                                    key={airport.code}
                                    className="px-4 py-2 cursor-pointer hover:bg-accent"
                                    onClick={() => handleSelect(airport.code)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-semibold">{airport.name}</p>
                                                <p className="text-sm text-muted-foreground">{airport.country_code}</p>
                                            </div>
                                        </div>
                                        <span className="font-mono text-sm text-muted-foreground">{airport.code}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                    {!isLoading && (debouncedQuery || '').length > 1 && suggestions.length === 0 && (
                        <div className="p-4 text-sm text-center text-muted-foreground">No airports found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
