import type { ReactNode } from "react";
import "./globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="m-0 [&_:is(input,textarea,select):focus]:outline-none [&_:is(input,textarea,select):focus]:ring-0">{children}</body>
    </html>
  );
}
