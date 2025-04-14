import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import headerStyle from "@/styles/header.module.css";

export default function Header() {
  return (
    <header className={headerStyle.container}>
      <Link className="link-button" href="/dashboard">
        <h1>MChat</h1>
      </Link>
      <div>
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
