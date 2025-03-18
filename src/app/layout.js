import { ClerkProvider } from "@clerk/nextjs";
import "@/styles/globals.css";

export const metadata = {
  title: "MChat",
  description: "An online chat application",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body suppressHydrationWarning={true}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
