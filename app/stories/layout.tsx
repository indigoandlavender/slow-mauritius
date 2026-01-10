import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories",
  description: "Cultural stories from Mauritius — history, craft, traditions, and the hidden layers that make Mauritius make sense.",
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
