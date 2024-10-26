"use client"
import { useRouter } from "next/navigation";

export default function Home() {
  const navigate=useRouter()
  return (
   <>
   <div onClick={()=>navigate.push("pages/instagramcaptions")}>
    Instagram
   </div>
   <div onClick={()=>navigate.push("pages/resume")}>
    Resume
   </div>
   </>
  );
}
