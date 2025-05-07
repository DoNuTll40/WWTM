import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import SidebarHook from "../hooks/SidebarHook";
import UserHook from "../hooks/UserHook";
import {
  faAddressCard,
  faAngleDown,
  faAnglesLeft,
  faAnglesRight,
  faAngleUp,
  faArrowsDownToPeople,
  faChartLine,
  faGear,
  faGears,
  faHouse,
  faPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import AppHook from "../hooks/AppHook";
import { useState } from "react";

export default function SideBar() {
  const { isOpen, isMini, toggleMini } = SidebarHook();
  const { user } = UserHook();
  const { system } = AppHook();
  const { pathname } = useLocation();
  const [onHover, setOnHover] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  // const pathName = pathname?.split("/")[1];
  const navigate = useNavigate();

  let icons = [];

  if(user?.ofw_department_sub_sub_id === 43){
    icons = [
      { icon: faHouse, path: "/home", title: "หน้าหลัก" },
      { icon: faChartLine, path: "/chart", title: "กราฟ" },
    ]
  }else{
    icons = [
      { icon: faHouse, path: "/home", title: "หน้าหลัก" },
      { icon: faUsers, path: "/users", title: "ผู้ใช้งาน", isAdmin: "ADMIN" },
      { icon: faPlus, path: "/record", title: "เพิ่มข้อมูล" },
      { icon: faChartLine, path: "/chart", title: "กราฟ" },
      {
        icon: faGear,
        title: "ตั้งค่า",
        isAdmin: "ADMIN",
        rightIcon: submenuOpen ? faAngleUp : faAngleDown,
        submenu: [
          { icon: faAddressCard, path: "/setting/profile", title: "โปรไฟล์" },
          { icon: faArrowsDownToPeople, path: "/setting/users", title: "อัพเดทผู้ใช้งาน" },
          { icon: faGears, path: "/setting/preferences", title: "การตั้งค่าเพิ่มเติม" },
        ],
      },
    ]
  }

  return (
    <div
      className={`${isOpen ? (isMini ? `w-14 ${onHover ? "w-64" : ""}` : "w-64") : "w-0"} bg-gray-800 text-white hidden md:flex justify-between flex-col fixed top-0 left-0 h-full transition-all duration-200 ease-in-out z-[60] overflow-hidden`}
      onMouseEnter={() => setOnHover(true)}
      onMouseLeave={() => setOnHover(false)}
    >
      {isOpen && (
        <div className="px-2 py-5 h-fit overflow-hidden flex flex-col w-64 select-none">
          <span className={`${isMini && !onHover && "hidden"} select-none`}>
            ตัวเลือก
          </span>
          <div className="my-2">
            {icons.map((el, index) => (
              (!el.isAdmin || (user && user.status === el.isAdmin)) && (
                <div key={index}>
                  <div
                    className={`${isMini && !onHover && "w-10 justify-center gap-0 my-2"} 
                      ${pathname === el.path || pathname.startsWith(el.path) || 
                        (el.submenu && el.submenu.some(sub => pathname.startsWith(sub.path))) 
                        ? `bg-${system?.color}-800 shadow-md` : ""
                      } flex items-center px-2 py-3 gap-2 my-1 hover:bg-gray-700 hover:cursor-pointer rounded-md`}
                    onClick={() => {
                      if (el.submenu) {
                        setSubmenuOpen(!submenuOpen);
                      } else {
                        navigate(el.path);
                      }
                    }}
                    aria-label={el.title}
                  >
                    {el.icon && <FontAwesomeIcon icon={el.icon} />}
                    <p className={`${isMini && !onHover && `hidden`}`}>{el.title}</p>
                    {el.rightIcon && <FontAwesomeIcon className={`${isMini && !onHover && `hidden` } ml-auto`} icon={el.rightIcon} />}
                  </div>

                  {/* แสดงข้อมูลใน option */}
                  {el.submenu && submenuOpen && (!isMini || onHover) && (
                    <div className="ml-2 mt-2">
                      {el.submenu.map((sub, subIndex) => (
                        <div key={subIndex} className={`flex items-center px-2 py-2 gap-2 my-1 rounded-md hover:cursor-pointer hover:bg-gray-700 
                          ${pathname.startsWith(sub.path) ? `bg-${system?.color}-800 shadow-md` : ""}`}
                          onClick={() => navigate(sub.path)}
                        >
                          {sub.icon && <FontAwesomeIcon icon={sub.icon} />}
                          <p>{sub.title}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      )}
      {isOpen && (
        <div
          className={`border-t w-full hover:bg-gray-700 h-10 flex ${isMini ? (onHover ? `justify-end` : `justify-center`) : "justify-end"}`}
        >
          <button
            onClick={toggleMini}
            className="text-white px-2"
            aria-label={isMini ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMini ? (
              <FontAwesomeIcon icon={faAnglesRight} />
            ) : (
              <FontAwesomeIcon icon={faAnglesLeft} />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
