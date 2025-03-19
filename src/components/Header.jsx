import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import headerStyle from "@/styles/header.module.css";

export default function Header() {
  return (
    <header className={headerStyle.container}>
      <h1>MChat</h1>
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
