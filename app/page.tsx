"use client"
import ButtonInvincible from "@/components/custom/Button";
import NavBar from "@/components/ui/navbar";
import Image from "next/image";
import { motion } from "framer-motion"
import HeroSection from "@/components/admin/herosection";
import CategoryHighlight from "@/components/admin/CategoryHighlight";
import FindPerfectMatch from "@/components/admin/FindPerfectMatch";
import SaleUIHome from "@/components/SaleUIHome";
import NewArrival from "@/components/NewArrival";
import Teaching from "@/components/Teaching";
import StartExploring from "@/components/StartExploring";
import BestSeller from "@/components/BestSeller";
import FindYourFavorProduct from "@/components/FindYourFavorProduct";
import BrandofShop from "@/components/BrandofShop";
import Blog from "@/components/Blog";
import Comment from "@/components/Comment";
import useFetch from "./hooks/useFetchData";

export default function Home() {

  return (
    <div>
      <NavBar />
      <HeroSection />

      <CategoryHighlight />

      <FindPerfectMatch />
      <FindYourFavorProduct />
      <SaleUIHome />
      <NewArrival />
      <Teaching />
      <StartExploring />
      {/* <BestSeller /> */}
      <BrandofShop />
      <Blog />
      <Comment />
    </div>
  )
}
