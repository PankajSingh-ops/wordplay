"use client"
import { useRouter } from "next/navigation";
import Header from "./common/Header";

export default function Home() {
  const navigate=useRouter()
  return (
   <>
   <Header/>
   <div onClick={()=>navigate.push("pages/instagramcaptions")}>
    Instagram Captions
   </div>
   <div onClick={()=>navigate.push("pages/resume")}>
    Resume Generator
   </div>
   <div onClick={()=>navigate.push("pages/namegenerator")}>
    Names Generator
   </div>
   </>
  );
}
