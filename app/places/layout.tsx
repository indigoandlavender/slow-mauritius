import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Places",
  description:
    "Discover the villages, towns, and landscapes of Mauritius. From dramatic mountains to pristine lagoons, explore the destinations that make this island extraordinary.",
  openGraph: {
    title: "Places | Slow Mauritius",
    description:
      "Discover the villages, towns, and landscapes of Mauritius. From dramatic mountains to pristine lagoons, explore the destinations that make this island extraordinary.",
  },
};

export default function PlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
