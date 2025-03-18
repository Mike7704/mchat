"use client";

export default function GlobalError({ error, reset }) {
  return (
    <main>
      <h2>Error! Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </main>
  );
}
