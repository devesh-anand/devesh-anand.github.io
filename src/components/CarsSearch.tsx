import Fuse from "fuse.js";
import { useEffect, useRef, useState, useMemo, type FormEvent } from "react";
// Removed Card import as results won't be rendered here
import type { CollectionEntry } from "astro:content";

// Adjusted SearchItem type to be more generic or specifically for cars if needed.
// For now, let's make it align with the expected structure for car data.
export type CarSearchItem = {
  title: string;
  description: string;
  // Assuming 'cars' is the collection name. Adjust if different.
  data: CollectionEntry<'cars'>['data']; 
  slug: string;
};

interface Props {
  searchList: CarSearchItem[];
  // Allow string for global function name, or function for direct passing
  onSearchUpdate: ((results: CarSearchItem[]) => void) | string; 
}

interface SearchResult { // This internal type can remain as it structures Fuse's output
  item: CarSearchItem;
  refIndex: number;
}

const DEBOUNCE_DELAY = 500; // milliseconds

export default function CarsSearch({ searchList, onSearchUpdate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputVal, setInputVal] = useState("");
  // Reverted to keep searchResults variable name, even if only set.
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>(null);

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setInputVal(e.currentTarget.value);
  };

  const fuse = useMemo(
    () =>
      new Fuse(searchList, {
        keys: ["title", "description", "data.name", "data.brand", "data.series"], // Adjusted keys for car data
        includeMatches: true,
        minMatchCharLength: 2,
        threshold: 0.4, // Adjusted threshold slightly
      }),
    [searchList]
  );

  useEffect(() => {
    const searchUrl = new URLSearchParams(window.location.search);
    const searchStr = searchUrl.get("q");
    if (searchStr) setInputVal(searchStr);

    setTimeout(function () {
      if (inputRef.current) {
        inputRef.current.selectionStart = inputRef.current.selectionEnd =
          searchStr?.length || 0;
      }
    }, 50);
  }, []);

  useEffect(() => {
    // If input is too short, update immediately without debounce and show all items
    if (inputVal.length <= 1) {
      setSearchResults([]); // Clear actual fuse search results
      if (typeof onSearchUpdate === 'function') {
        onSearchUpdate(searchList); // Show all cars
      } else if (typeof onSearchUpdate === 'string' && window[onSearchUpdate]) {
        (window[onSearchUpdate] as (results: CarSearchItem[]) => void)(searchList);
      }
      // Clear the query param from URL if input is too short
      if (window.location.search.includes("q=")){
        history.replaceState(history.state, "", window.location.pathname);
      }
      return; // Skip debouncing for short input
    }

    // Setup a timer for debouncing for inputs longer than 1 character
    const handler = setTimeout(() => {
      const fuseResults = fuse.search(inputVal);
      setSearchResults(fuseResults); // Update internal fuse results state

      const itemsToUpdate = fuseResults.map(res => res.item);

      if (typeof onSearchUpdate === 'function') {
        onSearchUpdate(itemsToUpdate);
      } else if (typeof onSearchUpdate === 'string' && window[onSearchUpdate]) {
        (window[onSearchUpdate] as (results: CarSearchItem[]) => void)(itemsToUpdate);
      } else {
        console.error("onSearchUpdate prop is not a function or valid global function name.");
      }

      // Update search string in URL
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("q", inputVal);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      history.replaceState(history.state, "", newRelativePathQuery);

    }, DEBOUNCE_DELAY);

    // Cleanup function to clear the timeout if value changes or component unmounts
    return () => {
      clearTimeout(handler);
    };
  // Ensure fuse object is a dependency if its generation depends on props/state that might change
  // and affect its behavior within this effect.
  }, [inputVal, searchList, onSearchUpdate, fuse]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []); // Changed dependency to empty array to only focus on mount

  return (
    <>
      <label className="relative block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2 opacity-75">
          <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"> {/* Adjusted SVG size/viewbox */}
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <span className="sr-only">Search Cars</span>
        </span>
        <input
          className="block w-full rounded border border-skin-fill/40 bg-skin-fill py-3 pl-10 pr-3 placeholder:italic focus:border-skin-accent focus:outline-none"
          placeholder="Search by name, brand, series..." // Updated placeholder
          type="text"
          name="search"
          value={inputVal}
          onChange={handleChange}
          autoComplete="off"
          ref={inputRef}
        />
      </label>

      {/* Result rendering removed from here */}
      {/* The "Found X results" message is also removed */}
    </>
  );
} 