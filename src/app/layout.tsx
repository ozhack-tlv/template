import type { Metadata } from "next";
import "./globals.css";

// TODO(צוות): לשנות לשם האפליקציה ולתיאור שלה
export const metadata: Metadata = {
  title: "<OZ/> HACK",
  description: "אפליקציה שנבנתה בהאקתון של מגמת מדעי המחשב, עמוס עוז",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
