
import { Avatar, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import SidebarHook from "../hooks/SidebarHook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import UserHook from "../hooks/UserHook";
import AppHook from "../hooks/AppHook";

export default function HeaderPC() {

  const { isOpen, isMini, toggleSidebar } = SidebarHook();
  const { logout, user } = UserHook();
  const { system } = AppHook();

  const color = system?.color

  let imageUrl = null;
  if (user?.image_blob) {
    const byteArray = new Uint8Array(Object.values(user?.image_blob));
    const blob = new Blob([byteArray], { type: "image/jpeg" });
    imageUrl = URL.createObjectURL(blob);
  }

  return (
    <div className="sticky top-0 z-50">
      <div className="hidden md:block">
        <div className={`w-full ${isOpen ? isMini ? "pl-4" : "pl-2" : "pl-2" } h-12 flex justify-between items-center bg-gradient-to-tl to-${color}-900 from-${color}-500 backdrop-blur-md shadow-md pr-2`}>
          <div className="flex items-center gap-3">
            <FontAwesomeIcon className="text-white text-lg hover:text-gray-300 pl-2 hover:cursor-pointer active:scale-95" icon={faBars} onClick={toggleSidebar} />
            <h1 className="text-white font-bold select-none">{system?.header}</h1>
          </div>
          <div className="group mr-2 flex items-center max-h-10 max-w-10">
            <Menu>
              <MenuHandler>
                <Avatar
                  src={`${imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQJxKGGpPc9-5g25KWwnsCCy9O_dlS4HWo5A&usqp=CAU" }`}
                  alt="avatar"
                  className="max-w-10 max-h-10 cursor-pointer group-hover:border-2"
                />
              </MenuHandler>
              <MenuList className="p-2">
                <MenuItem className="flex items-end gap-2 p-2" onClick={ () => logout()}>
                  <FontAwesomeIcon icon={faRightFromBracket} />
                  <p>ออกจากระบบ</p>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}
