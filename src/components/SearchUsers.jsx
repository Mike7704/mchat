"use client";
import { useState } from "react";
import UserCard from "@/components/UserCard";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search-users?query=${query}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        console.error("Error fetching users:", data.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div>
      <h3>Search for a user</h3>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for a user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>

      <div>
        {searching && <p>Searching...</p>}
        {!searching && results.length > 0 && results.map((user) => <UserCard key={user.id} user={user} />)}
        {!searching && results.length === 0 && hasSearched && <p>No users found.</p>}
      </div>
    </div>
  );
}
