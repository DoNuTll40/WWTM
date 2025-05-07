import { useContext } from "react";
import UserContext from "../contexts/UserContext";

export default function UserHook() {
  return useContext(UserContext)
}
