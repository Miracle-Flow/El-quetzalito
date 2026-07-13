import "../globals.css";

export default function CheckoutResultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
