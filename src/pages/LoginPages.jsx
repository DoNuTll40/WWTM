import { Button, Input } from "@material-tailwind/react";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHook from "../hooks/UserHook";
import axios from "../configs/axios-config";
import { toast } from "react-toastify";

export default function LoginPages() {
  document.title = "เข้าสู่ระบบ";

  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();
  const { user, setUser } = UserHook();

  useEffect(() => {
    if (user === null && location.pathname === "/") {
      navigate("/login");
    } else if (user?.id_ofw || user !== null) {
      navigate("/")
    }
  }, [navigate, user]);

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlLogin = async (e) => {
    e.preventDefault();

    if (!input.username || !input.password) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    const toastLoading = toast.loading("กำลังโหลดข้อมูล")

    try {

      const rs = await axios.post("/auth/login", input);
      sessionStorage.setItem("token", rs.data.token)
      if(rs.status === 200){
        const verify = await axios.get("/auth/verify", {
          headers: {
            Authorization: `Bearer ${rs.data.token}`
          }
        })

        if(verify.status === 200){
          const data = verify.data
          setUser(data)
          toast.update(toastLoading, {
            render: "ยินดีตอนรับเข้าสู่ระบบ",
            type: "success",
            isLoading: false,
            autoClose: 2000,
            onClose: () => {
            },
          })
        }
    
      }
      
    } catch (err) {
      toast.update(toastLoading, {
        render: "เกิดข้อผิดพลาด: " + (err.response?.data?.message || "ไม่สามารถเข้าสู่ระบบได้"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
      console.error(err);
    }

  };

  return (
    <div className="flex flex-col justify-between items-center h-[90vh] w-full">
      <div className="h-12 w-full flex items-center justify-center">
        <h1 className="text-center text-lg sm:text-xl font-semibold">
          ระบบบันทึกข้อมูล
        </h1>
      </div>
      <form onSubmit={hdlLogin} className="w-[90%] sm:w-[60%] md:w-[50%] lg:w-[35%] xl:w-[30%] 2xl:w-[25%] h-fit flex flex-col gap-4 border-2 shadow-md px-4 sm:px-5 rounded-md">
        <h1 className="text-center font-semibold mt-10 mb-3 text-xl">
          เข้าสู่ระบบ
        </h1>
        <Input
          name="username"
          className="text-md"
          size="lg"
          label="ชื่อผู้ใช้งาน"
          placeholder="ชื่อผู้ใช้งาน"
          onChange={hdlChange}
          required
        />
        <Input
          name="password"
          className="text-md"
          size="lg"
          type={showPassword ? "text" : "password"}
          label="รหัสผ่าน"
          placeholder="รหัสผ่าน"
          icon={
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
            />
          }
          onChange={hdlChange}
          required
        />
        <hr />
        <Button
          type="submit"
          variant="gradient"
          color="green"
          size="lg"
          className="mt-3 mb-10"
        >
          เข้าสู่ระบบ
        </Button>
      </form>
      <Footer />
    </div>
  );
}
