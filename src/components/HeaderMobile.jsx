import { useState } from "react";
import AppHook from "../hooks/AppHook";
import UserHook from "../hooks/UserHook";

export default function HeaderMobile() {
  const [isNameVisible, setIsNameVisible] = useState(false);
  const { system } = AppHook();
  const { user } = UserHook();

  const toggleName = () => {
    setIsNameVisible((prevState) => !prevState);
  };

  let imageUrl = null;
  if (user?.image_blob) {
    const byteArray = new Uint8Array(Object.values(user?.image_blob));
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    imageUrl = URL.createObjectURL(blob);
  }

  return (
    <div className="h-16 flex justify-between items-center md:hidden select-none">
      <h1 className="pl-2 text-white md:text-black font-bold ml-2 text-lg">
        {system?.header}
      </h1>
      <div
        className={`${isNameVisible ? "w-fit max-w-[55%]" : "w-10 h-10"} bg-gradient-to-t from-gray-300 to-white rounded-full mr-3 flex items-center gap-1 shadow-md cursor-pointer transition-all transform duration-300 ease-in-out overflow-hidden`}
        onClick={toggleName}>
        <img
          className="max-h-10 rounded-full border-2 drop-shadow-md"
          src={`${imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQJxKGGpPc9-5g25KWwnsCCy9O_dlS4HWo5A&usqp=CAU" }`}
          alt="profile"
        />
        <p
          className={`py-1 pr-2 text-sm text-center font-semibold transform transition-opacity duration-300 ${
            isNameVisible ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          {user?.ofw_prefix}{user?.ofw_fullname}
        </p>
      </div>
    </div>
  );
}
