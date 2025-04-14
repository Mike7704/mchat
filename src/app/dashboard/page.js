import Link from "next/link";
import Profile from "@/components/Profile";
import SearchUsers from "@/components/SearchUsers";
import FriendRequests from "@/components/FriendRequests";
import FriendsList from "@/components/FriendsList";

export default function Dashboard() {
  return (
    <main>
      <h2>Dashboard</h2>
      <Profile />
      <SearchUsers />
      <FriendRequests />
      <FriendsList />
      <Link className="button" href="/chatbot">
        ChatBot
      </Link>
    </main>
  );
}
