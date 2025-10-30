"use client"
import ButtonInvincible from "@/components/custom/Button";
import NavBar from "@/components/ui/navbar";
import Image from "next/image";
import { motion } from "framer-motion"
import HeroSection from "@/components/admin/herosection";
import CategoryHighlight from "@/components/admin/CategoryHighlight";
import FindPerfectMatch from "@/components/admin/FindPerfectMatch";

export default function Home() {


  return (
    <div>
      <NavBar />
      <HeroSection />
      <CategoryHighlight />
      <FindPerfectMatch />

    </div>
  )
}
