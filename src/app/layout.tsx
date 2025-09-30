import "./globals.css";

export const metadata = {
  title: "AI League Coach",
  description: "Analyze your League matches with AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0c0f17] text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
