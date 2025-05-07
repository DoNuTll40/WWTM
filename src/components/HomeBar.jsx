import {
  faChartLine,
  faGear,
  faHouse,
  faPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip } from "@material-tailwind/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserHook from "../hooks/UserHook";
import AppHook from "../hooks/AppHook";

export default function HomeBar() {
  const navigate = useNavigate();
  const { user } = UserHook();
  const { system } = AppHook();

  const color = system?.color;
  
  const pathName = location?.pathname?.split("/")[1];
  let token = sessionStorage?.getItem("token");

  useEffect(() => {
    if (pathName === "" && user !== null || pathName === "login") {
      navigate("/home");
    } else if (user === null || !token) {
      navigate("/");
    }
  }, [navigate, pathName, user, token]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };
  
  let icons = [];

  if(user?.ofw_department_sub_sub_id === 43){
    icons = [
      { icon: faHouse, path: "/home", title: "หน้าหลัก" },
      // { icon: faUsers, path: "/users", title: "ผู้ใช้งาน", isAdmin: "ADMIN" },
      { icon: faChartLine, path: "/chart", title: "กราฟ" },
      { icon: faGear, path: "/setting", title: "ตั้งค่า", isAdmin: "ADMIN" },
      { icon: faRightFromBracket, path: "/logout", title: "Logout" },
    ]
  } else {
    icons = [
      { icon: faHouse, path: "/home", title: "หน้าหลัก" },
      // { icon: faUsers, path: "/users", title: "ผู้ใช้งาน", isAdmin: "ADMIN" },
      { icon: faPlus, path: "/record", title: "เพิ่มข้อมูล", InSapc: 43 },
      { icon: faChartLine, path: "/chart", title: "กราฟ" },
      { icon: faGear, path: "/setting", title: "ตั้งค่า", isAdmin: "ADMIN" },
      { icon: faRightFromBracket, path: "/logout", title: "Logout" },
    ]
  }

  return (
    <div className={`bg-${color}-900 h-20 w-full md:hidden mx-auto right-0 shadow-md left-0 fixed -bottom-0 rounded-t-2xl`}>
      <div className="w-[90%] mt-1 md:hidden mx-auto shadow-md text-xl px-2 rounded-2xl h-16 flex justify-around items-center bg-white">
        {icons.map((el, index) => 
        (!el.isAdmin || user?.status === el.isAdmin) && (
          <Tooltip content={el.title} key={index}>
            <FontAwesomeIcon
              icon={el.icon}
              onClick={() => {
                scrollToTop();
                navigate(el.path);
              }}
              className={`cursor-pointer transition-all py-5 transform duration-250 ease-in-out bg-transparent ${
                el.path.split("/")[1] === pathName
                  ? `${`bg-gradient-to-t from-${color}-800 to-${color}-600 rounded-t-full`} w-[34%] text-white shadow-xl translate-y-[0.15rem]`
                  : "w-1/3 text-gray-500"
              }`}
            />
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
