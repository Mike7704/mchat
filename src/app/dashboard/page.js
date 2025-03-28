"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchUsers from "@/components/SearchUsers";
import FriendRequests from "@/components/FriendRequests";
import FriendsList from "@/components/FriendsList";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="layout">
      <Header />
      <main>
        <h2>Dashboard</h2>

        <div className="profile">
          {user?.imageUrl && (
            <Image src={user.imageUrl} alt="Profile Picture" width={100} height={100} className="profile-pic" />
          )}
          <h3>Username: {user?.username}</h3>
          <p>Email: {user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div>
          <h3>Search for a user:</h3>
          <SearchUsers />
          <FriendRequests />
          <FriendsList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
