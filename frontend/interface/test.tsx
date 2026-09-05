import type { ReactNode } from "react";

export interface Testinterface {
  lol: string;
}

export interface User 
{
  user_id:number;
  name: string;
  username: string;
  password:string;
  description:string;
  icon:string;

}

export interface LayoutProps
{
  children: ReactNode;
}

export interface Points
{
  point_id:number;
  lat:number;
  lng:number;
  description:Text;
}