"use client";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Wait for Clerk profile to load
  if (!isLoaded) {
    return null;
  }

  return (
    <div className="layout">
      <Header />
      <main>
        {!isSignedIn ? (
          <>
            <h2>Welcome to MChat</h2>
            <p>Sign in to start chatting</p>
            <Link className="link-button" href="/sign-in">
              Sign In
            </Link>
          </>
        ) : (
          <>
            <h2>Welcome back {user?.username}!</h2>
            <p>You are already signed in.</p>
            <Link className="link-button" href="/dashboard">
              Go to your Dashboard
            </Link>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
