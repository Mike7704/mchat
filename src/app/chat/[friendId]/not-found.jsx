import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="layout">
      <Header />
      <main>
        <h2>404 - Page Not Found</h2>
        <p>Could not find user messages</p>
        <Link className="button" href={`/dashboard`}>
          Dashboard
        </Link>
      </main>
      <Footer />
    </div>
  );
}
