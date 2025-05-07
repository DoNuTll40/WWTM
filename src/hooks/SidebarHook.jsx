import { useContext } from "react";
import SidebarContext from "../contexts/SidebarContext";

export default function SidebarHook() {
  return useContext(SidebarContext)
}

