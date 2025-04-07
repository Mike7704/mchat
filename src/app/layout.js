import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/normalise.css";
import "@/styles/globals.css";

export const metadata = {
  title: "MChat",
  description: "An online chat application",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider afterMultiSessionSingleSignOutUrl="/" afterSignOutUrl="/">
      <html lang="en" className="layout">
        <body suppressHydrationWarning={true}>
          <div className="layout">
            <Header />
            {children}
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
