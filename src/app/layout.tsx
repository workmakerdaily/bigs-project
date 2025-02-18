
import "./globals.css";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en">
      <body className="antialiased flex">
        <ProtectedRoute>
          <Navbar />
          <main className="flex-1 md:pl-64">{children}</main>
        </ProtectedRoute>
      </body>
    </html>
  );
}
