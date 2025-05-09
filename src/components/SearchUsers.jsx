"use client";
import { useState } from "react";
import UserCard from "@/components/UserCard";
import { fetchProfilePicture } from "@/utils/fetchProfilePicture";
import searchUsersStyle from "@/styles/search_users.module.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Search for users
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search-users?query=${query}`);
      const data = await response.json();

      // Fetch profile images for each user
      const usersWithProfileImages = await Promise.all(
        data.map(async (user) => {
          const profileImage = await fetchProfilePicture(user.id);
          return { ...user, profileImage }; // Add profile image
        })
      );

      if (response.ok) {
        setResults(usersWithProfileImages);
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
    <div className="component-container">
      <form onSubmit={handleSearch} className={searchUsersStyle["search-form"]}>
        <input
          type="text"
          placeholder="Search for a user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={searchUsersStyle["search-input"]}
        />
        <button type="submit" disabled={searching}>
          {searching ? "Searching..." : "Search"}
        </button>
      </form>
      {/* Display search results */}
      {hasSearched && (
        <div className={searchUsersStyle["search-results"]}>
          {searching && <p className="sub-container">Searching...</p>}
          {!searching && results.length > 0 && results.map((user) => <UserCard key={user.id} user={user} />)}
          {!searching && results.length === 0 && <p className="sub-container">No users found.</p>}
        </div>
      )}
    </div>
  );
}
