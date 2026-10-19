"use client";
import { useEffect, useRef } from "react";
export function Reveal({children,delay=0,className="",as:Tag="div"}:{children:React.ReactNode;delay?:number;className?:string;as?:"div"|"section"|"li"|"article"}) {
 const ref=useRef<HTMLElement>(null);
 useEffect(()=>{
  const element=ref.current;
  if(!element || !("IntersectionObserver" in window)) return;
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");
  let animation:Animation | undefined;
  const observer=new IntersectionObserver(entries=>{
   if(!entries.some(entry=>entry.isIntersecting))return;
   observer.disconnect();
   if(!media.matches && element.animate) animation=element.animate([{opacity:0,transform:"translateY(24px)"},{opacity:1,transform:"translateY(0)"}],{duration:650,delay,fill:"backwards",easing:"cubic-bezier(0.16, 1, 0.3, 1)"});
  },{threshold:0.1});
  observer.observe(element);
  const change=()=>{if(media.matches)animation?.cancel();};
  media.addEventListener("change",change);
  return ()=>{observer.disconnect();animation?.cancel();media.removeEventListener("change",change);};
 },[delay]);
 return <Tag ref={(node: HTMLElement | null)=>{ref.current=node;}} className={`reveal ${className}`}>{children}</Tag>;
}
