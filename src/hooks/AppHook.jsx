import { useContext } from "react";
import AppContext from "../contexts/AppContext";

export default function AppHook() {
  return useContext(AppContext);
}