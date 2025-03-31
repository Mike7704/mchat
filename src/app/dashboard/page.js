import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Profile from "@/components/Profile";
import SearchUsers from "@/components/SearchUsers";
import FriendRequests from "@/components/FriendRequests";
import FriendsList from "@/components/FriendsList";

export default function Dashboard() {
  return (
    <div className="layout">
      <Header />
      <main>
        <h2>Dashboard</h2>
        <Profile />
        <SearchUsers />
        <FriendRequests />
        <FriendsList />
      </main>
      <Footer />
    </div>
  );
}
