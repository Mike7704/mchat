import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h2>404 - Page Not Found</h2>
      <p>Could not find user messages</p>
      <Link className="button" href={`/dashboard`}>
        Dashboard
      </Link>
    </main>
  );
}
