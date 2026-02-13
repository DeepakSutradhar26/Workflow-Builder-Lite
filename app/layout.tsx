import "./globals.css";

export const metadata = {
  title: "Workflow Builder Lite",
  description: "Chain AI steps to process text",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
