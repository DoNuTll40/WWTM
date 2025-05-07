import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHook from "../hooks/UserHook";

export default function NotFound() {
  const [loading, setLoading] = useState(true); // สถานะที่บอกว่าภาพกำลังโหลด
  const { user } = UserHook();
  const path = location.href;
  const navigate = useNavigate();

  let token = sessionStorage.getItem("token");

  // เมื่อภาพโหลดเสร็จ
  const handleImageLoad = () => {
    setLoading(false); // ตั้งสถานะการโหลดเป็น false
  };

  // เมื่อเกิดข้อผิดพลาดในการโหลดภาพ
  const handleImageError = () => {
    setLoading(false); // ตั้งสถานะการโหลดเป็น false
  };

  useEffect(() => {
    if(!token && user === null){
      navigate("/")
    }
  }, [])

  return (
      <div className="w-screen h-[94vh] select-none">
        <div className="h-3/4 w-full flex flex-col gap-2 justify-end items-center">
          {loading && (
            <span className="my-20 border-gray-300 h-8 w-8 animate-spin rounded-full border-[4px] border-t-green-800"></span>
          )}
          {/* แสดงข้อความ Loading เมื่อภาพกำลังโหลด */}
          <img
            className="max-w-56 sm:max-w-80 pointer-events-none"
            src="./picture/page_not_found.png"
            alt="Page Not Found"
            loading="lazy"
            onLoad={handleImageLoad} // เรียกเมื่อภาพโหลดเสร็จ
            onError={handleImageError} // เรียกเมื่อเกิดข้อผิดพลาดในการโหลดภาพ
          />
          <h1 className="text-xl font-semibold drop-shadow-md">
            Page Not Found
          </h1>
          <div className="w-screen overflow-hidden px-4 text-center">
            <p className="text-sm underline drop-shadow-md break-words line-clamp-2" title={path}>{path}</p>
          </div>
          <p className="hover:underline hover:cursor-pointer" onClick={() => navigate("/")}>กลับหน้าหลัก</p>
        </div>
        <div className="h-1/4 pb-2 w-full flex flex-col gap-2 justify-end items-center">
          <img
            className="max-w-32"
            src="./picture/akathosp-logo.png"
            alt="akathosplogo"
          />
        </div>
      </div>
  );
}
