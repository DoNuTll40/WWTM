
import { faAddressCard, faArrowsDownToPeople, faGears } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"

export default function SettingMainPages() {
    const navigate = useNavigate();

    const icons = [
        { icon: faAddressCard, path: "/setting/profile", title: "โปรไฟล์" },
        { icon: faArrowsDownToPeople, path: "/setting/users", title: "อัพเดทผู้ใช้งาน" },
        { icon: faGears, path: "/setting/preferences", title: "การตั้งค่าเพิ่มเติม" },
    ]

    return (
        <div className="w-[95%] min-h-[90vh] md:min-h-[35vw] shadow-lg p-4 mx-auto rounded-lg bg-white grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 select-none">
            {icons?.map((el, index) => (
                <div 
                    className="flex flex-col items-center gap-2 hover:border-2 hover:cursor-pointer hover:border-blue-400 hover:bg-blue-50 hover:shadow-md h-fit p-2 rounded-md group" 
                    key={index}
                    onClick={() => navigate(el.path)}
                >
                    <div className="bg-gray-800 group-hover:bg-gradient-to-t group-hover:from-gray-800 group-hover:to-gray-500 w-14 h-14 rounded-md flex justify-center items-center text-xl text-white group-hover:shadow-md">
                        <FontAwesomeIcon className="group-hover:drop-shadow-md" icon={el.icon} />
                    </div>
                    <p className="text-sm text-black/70 group-hover:drop-shadow-md group-hover:text-black group-hover:font-medium line-clamp-1">{el.title}</p>
                </div>
            ))}
        </div>
    )
}
