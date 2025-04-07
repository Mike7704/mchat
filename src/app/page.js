"use client";
import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  const { isSignedIn, user, isLoaded } = useUser();

  // Wait for Clerk profile to load
  if (!isLoaded) {
    return null;
  }

  return (
    <main>
      {!isSignedIn ? (
        <>
          <h2>Welcome to MChat</h2>
          <p>Sign in to start chatting</p>
          <div>
            <SignedOut>
              <SignInButton className="button" />
              <SignUpButton className="button" />
            </SignedOut>
          </div>
        </>
      ) : (
        <>
          <h2>Welcome back {user?.username}!</h2>
          <p>You are already signed in.</p>
          <Link className="button" href="/dashboard">
            Go to your Dashboard
          </Link>
        </>
      )}
    </main>
  );
}
