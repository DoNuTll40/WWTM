import { Button, Input, Option, Select, Step, Stepper, Textarea } from "@material-tailwind/react";
import { useState } from "react";
import { toast } from "react-toastify";
import UserHook from "../hooks/UserHook";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RecordPage() {

  const { user } = UserHook();

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token")

  document.title = "เพิ่มข้อมูล " + user?.ofw_fullname

    const [input, setInput] = useState({
        w_date: new Date(),
        water_usage: "",
        wastewater: "",
        electricity_unit: "",
        chlorine_kg: "",
        chlorine_residual: "",
        pH: "",
        sludge_test_60min: "",
        SV10: "",
        SV30: "",
        SV60: "",
        treatment_status: "",
        water_pump_status: "",
        excess_sludge: "",
        grease_trap: "",
        other_notes: "",
    })

    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);

    const handleNext = () => {
      if (!isLastStep) {
        // ตรวจสอบว่าแต่ละช่องมีข้อมูลหรือไม่
        if (
          input.water_usage === "" ||
          input.wastewater === "" ||
          input.electricity_unit === "" ||
          input.chlorine_kg === "" ||
          input.chlorine_residual === "" ||
          input.pH === "" ||
          input.sludge_test_60min === "" ||
          input.SV10 === "" ||
          input.SV30 === "" ||
          input.SV60 === "" 
        ) {
          // แสดงการแจ้งเตือนหากข้อมูลไม่ครบ
          toast.error("กรุณากรอกข้อมูลหน้าแรกให้ครบถ้วน", {
            position: "top-right",
            autoClose: 5000,
            theme: "colored"
          });
          scrollToTop();
          return;
        }
        setActiveStep((cur) => cur + 1);
        scrollToTop();
      }
    };
    
    const handlePrev = () => {
      if (!isFirstStep) {
        setActiveStep((cur) => cur - 1);
        scrollToTop();
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    };

    const formSubmit = async (e) => {
      const toastLoading = toast.loading("กำลังบันทึกข้อมูล...");
      e.preventDefault();

      try {
        const rs = await axios.post("/user/record/add", input, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if(rs.status === 200){
          navigate("/")
          toast.update(toastLoading, {
            render: rs.data.message,
            type: "success",
            isLoading: false,
            theme: "colored",
            autoClose: 2000,
          });
        }
      } catch (err) {
        console.log(err)
        toast.update(toastLoading, {
          render:"เกิดข้อผิดพลาด: " + (err.response?.data?.message || "ไม่สามารถส่งข้อมูลได้"),
          type: "error",
          isLoading: false,
          theme: "colored",
          autoClose: 3000,
        });
      }
    }

    const hdlChange = (e) => {
      setInput((prv) => ({ ...prv, [e.target.name]: e.target.value }));
    }

    const options = [
      { name: "ปกติ", key_id: 0},
      { name: "เสีย", key_id: 1}
    ]; // ตัวเลือกที่ใช้ร่วมกันในทุกๆ Select

    const selectFields = [
      { name: "treatment_status", label: "ระบบบำบัด ปกติ/เสีย" },
      { name: "water_pump_status", label: "เครื่องสูบน้ำ ปกติ/เสีย" },
      { name: "aerator_status", label: "เครื่องเติมอากาศ ปกติ/เสีย" },
      { name: "sludge_pump_status", label: "เครื่องสูบตะกอน ปกติ/เสีย" },
    ];

  return (
    <>
        <div className="w-[95%] h-full px-2 rounded-lg bg-white mx-auto">
            <div className="flex justify-between mb-2">
              <h1 className="text-lg pl-2 pt-3 pb-3 font-semibold">กรอกข้อมูล</h1>
              <Stepper
                className="w-1/3 scale-75 select-none"
                activeStep={activeStep}
                isLastStep={(value) => setIsLastStep(value)}
                isFirstStep={(value) => setIsFirstStep(value)}
                lineClassName="bg-green-800/30"
                activeLineClassName="bg-gradient-to-t from-green-800 to-green-500"
              >
                <Step
                  activeClassName="bg-white text-green-800 border-green-800 border-2"
                  completedClassName="bg-green-800 text-white"
                  onClick={handlePrev}>
                    1
                </Step>
                <Step
                  className=""
                  activeClassName="bg-white text-green-800 border-green-800 border-2"
                  completedClassName="bg-green-800 text-white"
                  onClick={handleNext}>
                    2
                </Step>
              </Stepper>
            </div>
            <hr />
            <form className="" onSubmit={formSubmit}>
                <div className="my-4 mt-6 px-2 flex flex-col gap-3 md:grid md:grid-cols-2">
                  {activeStep === 0 && 
                    <>
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="w_date" type="text" size="lg" label="วันที่ / เวลา" placeholder="วันที่ / เวลา" value={(input.w_date).toLocaleString("th-TH")} readOnly required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="SV60" type="number" value={input.SV60} size="lg" label="SV60" placeholder="SV60" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="water_usage" value={input.water_usage} type="number" size="lg" label="ปริมาณน้ำใช้ทุกกิจกรรม ลบ.ม." placeholder="ปริมาณน้ำใช้ทุกกิจกรรม ลบ.ม." required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="wastewater" value={input.wastewater} type="number" size="lg" label="ปริมาณน้ำเสียเข้าระบบ ลบ.ม." placeholder="ปริมาณน้ำเสียเข้าระบบ ลบ.ม." required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="electricity_unit" value={input.electricity_unit} type="number" size="lg" label="ไฟฟ้า (Unit)" placeholder="ไฟฟ้า (Unit)" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="chlorine_kg" value={input.chlorine_kg} type="number" size="lg" label="คลอรีน (Kg)" placeholder="คลอรีน (Kg)" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="chlorine_residual" value={input.chlorine_residual} type="number" size="lg" label="คลอรีนตกค้าง (0.5-1 mg/1)" placeholder="คลอรีนตกค้าง (0.5-1 mg/1)" max="1" min="0" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="pH" type="number" value={input.pH} size="lg" label="pH (6.8-8.5)" placeholder="pH (6.8-8.5)" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="sludge_test_60min" value={input.sludge_test_60min} type="number" size="lg" label="การทดสอบตะกอน 60 นาที" placeholder="การทดสอบตะกอน 60 นาที" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="SV10" type="number" value={input.SV10} size="lg" label="SV10" placeholder="SV10" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="SV30" type="number" value={input.SV30} size="lg" label="SV30" placeholder="SV30" required />
                    </>
                  }
                  
                  {/* page 2 */}
                  {activeStep === 1 && 
                    <>
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="solid_waste" type="text" size="lg" label="ขยะชิ้น" placeholder="ขยะชิ้น" required />
                      {selectFields.map((field) => (
                        <Select
                          key={field.name} // ใช้ชื่อฟิลด์เป็นคีย์เพื่อป้องกันข้อผิดพลาดใน React
                          value={input[field.name]}
                          onChange={(vel) => setInput((prev) => ({ ...prev, [field.name]:vel }))}
                          variant="standard"
                          label={field.label}
                        >
                          {options.map((el, index) => (
                            <Option key={index} value={el.key_id}>{el.name}</Option> // สร้าง Option จากอาเรย์ options
                          ))}
                        </Select>
                      ))}
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="excess_sludge" type="number" size="lg" label="ตะกอนส่วนเกิน" placeholder="ตะกอนส่วนเกิน" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="grease_trap" type="text" size="lg" label="ตักดักไขมัน" placeholder="ตักดักไขมัน" required />
                      <Textarea className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="other_notes" size="lg" label="หมายเหตุ" />
                    </>
                  }
                </div>
                <div className={`w-full flex justify-end ${activeStep === 0 && "hidden"}`}>
                  <Button variant="gradient" color="green" type="submit" className="w-full md:w-3/12 ml-auto my-2 md:text-[15px]">บันทึก</Button>
                </div>
            </form>
            <div className="my-5 mb-24 md:mb-12 flex justify-between">
              <Button variant="gradient" color="gray" onClick={handlePrev} disabled={isFirstStep}>
                ย้อนกลับ
              </Button>
              <Button variant="gradient" color="gray" onClick={handleNext} disabled={isLastStep}>
                ถัดไป
              </Button>
            </div>
        </div>
    </>
  );
}
