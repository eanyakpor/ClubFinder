import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import VideoBackground from "./components/VideoBackground";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Project X",
  description: "Find clubs, events, or skills — one search away.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white`}
      >
        {/*   Background Video always on */}
        <VideoBackground />

        {/* Overlay Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
