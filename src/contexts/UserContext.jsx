/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import axios from "../configs/axios-config";
import { toast } from "react-toastify";

const UserContext = createContext(); // สร้าง Context เพื่อใช้ในการแชร์ข้อมูลระหว่างคอมโพเนนต์

function UserContextProvider(props) {
  const [user, setUser] = useState(null); // สถานะสำหรับเก็บข้อมูลผู้ใช้
  const [isLoading, setIsLoading] = useState(false); // สถานะสำหรับตรวจสอบว่ากำลังโหลดข้อมูลหรือไม่
  const [isLoggingOut, setIsLoggingOut] = useState(false); // เพิ่มตัวแปรเพื่อตรวจสอบสถานะการ logout
  let token = sessionStorage.getItem("token"); // ดึง token จาก sessionStorage

  // ฟังก์ชันสำหรับ Logout
  const logout = async () => {
    if (!token || isLoggingOut) { // ถ้ามีการ logout อยู่แล้ว หรือไม่มี token
      return;
    }
    setIsLoggingOut(true); // ตั้งค่า isLoggingOut เป็น true
    try {
      // ส่ง request ไปยังเซิร์ฟเวอร์เพื่อทำการ logout
      await axios.get("/auth/logout", {
        headers: {
          Authorization: `Bearer ${token}`, // ส่ง token ไปกับ header
        },
      });

      // ลบ token และเวลาจาก sessionStorage
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("lastActiveTime");
      setUser(null); // รีเซ็ตผู้ใช้เป็น null
      toast.success("ออกจากระบบเรียบร้อยแล้ว", { autoClose: 1500 });
    } catch (err) {
      console.error("Error during logout:", err); // แสดงข้อผิดพลาดหาก logout ล้มเหลว
    } finally {
      setIsLoggingOut(false); // รีเซ็ตสถานะ logout
    }
  };

  // ฟังก์ชันตั้งเวลา Logout อัตโนมัติ
  const setLogoutTimer = () => {
    const lastActiveTime = sessionStorage.getItem("lastActiveTime"); // ดึงเวลาล่าสุดที่ผู้ใช้ใช้งาน
    const currentTime = new Date().getTime(); // เวลาปัจจุบัน
    const remainingTime = lastActiveTime
      ? 30 * 60 * 1000 - (currentTime - Number(lastActiveTime)) // คำนวณเวลาที่เหลือ (30 นาที)
      : 30 * 60 * 1000; // ตั้งค่าเป็น 30 นาทีถ้าไม่มีเวลาใน sessionStorage

    // ถ้าเวลาที่เหลือหมดแล้ว Logout ทันที
    if (remainingTime <= 0) {
      logout();
    } else {
      // ตั้ง Timer สำหรับ Logout เมื่อเวลาที่เหลือหมด
      setTimeout(() => {
        logout();
      }, remainingTime);
    }
  };

  // ฟังก์ชันสำหรับตรวจสอบ token และดึงข้อมูลผู้ใช้
  useEffect(() => {
    const verify = async () => {
      try {
        setIsLoading(true); // ตั้งค่า isLoading เป็น true เพื่อแสดงว่ากำลังโหลดข้อมูล

        if (!token) {
          return; // ถ้าไม่มี token ให้หยุดการทำงาน
        }

        // ส่ง request ไปยังเซิร์ฟเวอร์เพื่อตรวจสอบ token
        const rs = await axios.get("/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`, // ส่ง token ไปกับ header
          },
        });

        if (rs.status === 200) {
          setUser(rs.data); // อัปเดตข้อมูลผู้ใช้

          // บันทึกเวลาเริ่มต้นเข้าสู่ระบบลงใน sessionStorage
          if (!sessionStorage.getItem("lastActiveTime")) {
            sessionStorage.setItem("lastActiveTime", new Date().getTime());
          }
          setLogoutTimer(); // ตั้ง Timer สำหรับ Logout
        }
      } catch (err) {
        console.log(err);

        // ถ้า token ไม่ถูกต้องหรือหมดอายุ
        if (
          err.response?.data?.message?.startsWith("Token verification failed") ||
          err.response?.data?.message?.startsWith("TokenExpiredError")
        ) {
          sessionStorage.removeItem("token");
          setUser(null); // รีเซ็ตผู้ใช้เป็น null
        }
      } finally {
        setIsLoading(false); // ตั้งค่า isLoading เป็น false เมื่อโหลดข้อมูลเสร็จ
      }
    };

    verify(); // เรียกใช้ฟังก์ชัน verify
  }, [token]); // useEffect จะทำงานเมื่อ `token` มีการเปลี่ยนแปลง

  // ค่าที่จะส่งไปยังคอมโพเนนต์ลูกผ่าน Context
  const value = { user, setUser, isLoading, logout };

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  );
}

export { UserContextProvider };
export default UserContext;
