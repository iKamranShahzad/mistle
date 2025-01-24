import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "@/app/utils/SessionProvider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mistle",
  description: "Mistle UML Diagram Tool",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div>{children}</div>
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              style: {
                background: "#d9d9d9",
                padding: "12px",
                paddingLeft: "24px",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}

//PER PAGE LAYOUT FOR MULTIPLE LAYOUTS!
