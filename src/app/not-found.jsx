"use client";

export default function NotFound() {
  return (
    <main>
      <h2>404 - Page Not Found</h2>
      {/* Using normal button rather than link because of this issue
      https://github.com/vercel/next.js/issues/48367 
      <Link className="button" href="/">
        Return to the home page
      </Link>
      */}
      <button onClick={() => (window.location.href = "/")}>Return To Home</button>
    </main>
  );
}
