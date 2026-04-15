import type { Metadata } from "next";
import AboutContent from "./components/AboutContent";

export const metadata: Metadata = {
  title: "About | RuneIcons",
  description: "Meet the team behind RuneIcons.",
};

export default function AboutPage() {
  return <AboutContent />;
}
