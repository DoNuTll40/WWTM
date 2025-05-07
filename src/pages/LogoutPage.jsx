import { useEffect } from "react"
import UserHook from "../hooks/UserHook"

export default function LogoutPage() {

  const { logout } = UserHook();

  useEffect(() => {
    logout();
  }, [])

  return (
    <div className="w-[95%] flex justify-center min-h-screen mx-auto bg-white rounded-t-md px-2">
      <span className="my-20 border-gray-300 h-8 w-8 animate-spin rounded-full border-[4px] border-t-green-800"></span>
    </div>
  )
}
