"use client";

import { useState, useEffect, useCallback } from "react";

export interface SearchHistoryItem {
  location: string;
  dates: { from?: Date; to?: Date };
  timestamp: number;
}

const HISTORY_KEY = "tripfinder_search_history";

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        const parsed = JSON.parse(storedHistory).map((item: any) => ({
          ...item,
          dates: {
            from: item.dates.from ? new Date(item.dates.from) : undefined,
            to: item.dates.to ? new Date(item.dates.to) : undefined,
          },
        }));
        setHistory(parsed);
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
      setHistory([]);
    }
  }, []);

  const addSearchToHistory = useCallback(
    (item: Omit<SearchHistoryItem, "timestamp">) => {
      setHistory((prevHistory) => {
        const newHistoryItem = { ...item, timestamp: Date.now() };
        // Avoid adding duplicate consecutive searches
        if (
          prevHistory[0] &&
          prevHistory[0].location === newHistoryItem.location
        ) {
          return prevHistory;
        }
        const updatedHistory = [newHistoryItem, ...prevHistory].slice(0, 10); // Keep last 10 searches
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
          console.error("Failed to save search history:", error);
        }
        return updatedHistory;
      });
    },
    []
  );

  return { history, addSearchToHistory };
};
