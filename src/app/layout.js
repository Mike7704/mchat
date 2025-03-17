import "@/styles/globals.css";

export const metadata = {
  title: "MChat",
  description: "An online chat application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
