/* eslint-disable no-unused-vars */
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../configs/axios-config';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Input, Select, Option, Textarea, Button, Stepper, Step } from '@material-tailwind/react'; // ตัวอย่างการนำเข้า Component
import moment from 'moment/moment';
import AppHook from '../hooks/AppHook';
import UserHook from '../hooks/UserHook';
import LoadingPage from '../components/LoadingPage';

export default function RecordEditPage() {
  const [data, setData] = useState(null); // เก็บข้อมูลจาก API
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState({}); // เก็บค่าจากฟอร์ม
  const [activeStep, setActiveStep] = useState(0); // สำหรับ Stepper
  const [isFirstStep, setIsFirstStep] = useState(false);
  const [isLastStep, setIsLastStep] = useState(false);
  const { system } = AppHook();

  const location = useLocation();
  const id = location.pathname.split('/')[2]; // ดึง ID จาก URL

  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const options = [
    { name: "ปกติ", key_id: 0 },
    { name: "เสีย", key_id: 1 },
  ]; // ตัวเลือกที่ใช้ร่วมกันในทุกๆ Select

  const selectFields = [
    { name: "fix_treatment_id", label: "ระบบบำบัด ปกติ/เสีย" },
    { name: "fix_pump_id", label: "เครื่องสูบน้ำ ปกติ/เสีย" },
    { name: "fix_aerator_id", label: "เครื่องเติมอากาศ ปกติ/เสีย" },
    { name: "fix_sludge_id", label: "เครื่องสูบตะกอน ปกติ/เสีย" },
  ];

  useEffect(() => {
    if (!id) {
      navigate('/'); // Redirect ถ้าไม่พบ ID
      return;
    }

    const toastLoading = toast.loading('กำลังโหลดข้อมูล...');

    const getData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`/user/record/view/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setLoading(false);
          if (response.data.result.status) {
            setLoading(true)
            toast.update(toastLoading, {
              render: 'ข้อมูลนี้ถูกอนุมัติแล้ว',
              type: 'info',
              isLoading: false,
              theme: 'colored',
              autoClose: 1500,
              onClose: () => {
                navigate("/")
              }
            });
            return;
          }
  
          setData(response.data.result);
          setInput(response.data.result);
          toast.update(toastLoading, {
            render: response.data.message,
            type: 'success',
            isLoading: false,
            theme: 'colored',
            autoClose: 1500,
          });
        }
      } catch (err) {
        setError(err); // ตั้งค่า state error
        setLoading(true)
        toast.update(toastLoading, {
          render: err.response?.data?.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
          type: 'error',
          isLoading: false,
          theme: 'colored',
          autoClose: 1500,
          onClose: () => {
            navigate('/'); // Redirect เมื่อเกิดข้อผิดพลาด
          }
        });
      } finally {
        // setLoading(false); // ตั้งค่า loading เป็น false
      }
    };

    getData();
  }, [id, navigate, token]);

  const hdlChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value })); // อัปเดตค่าใน state
  };

  const handleNext = () => setActiveStep((prev) => prev + 1); // ไปขั้นตอนถัดไป
  const handlePrev = () => setActiveStep((prev) => prev - 1); // กลับไปขั้นตอนก่อนหน้า

  const formSubmit = async (e) => {
    e.preventDefault();
  
    const toastLoading = toast.loading('กำลังบันทึกข้อมูล...');
  
    try {
      // ส่งข้อมูลไปยัง API
      const { timestamp, ...output} = input;

      const response = await axios.patch(`/user/record/edit?id_w=${id}`, output, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        toast.update(toastLoading, {
          render: response.data.message,
          type: 'success',
          isLoading: false,
          theme: 'colored',
          autoClose: 1500,
          onClose: () => {
            navigate(-1);
          },
        });
      }
    } catch (err) {
      toast.update(toastLoading, {
        render: err.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        type: 'error',
        isLoading: false,
        theme: 'colored',
        autoClose: 2000,
      });
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center flex-col my-20 gap-2'>
        <span className="border-gray-300 h-12 w-12 animate-spin rounded-full border-[6px] border-t-green-800"></span>
        <p>กำลังโหลด...</p>
      </div>
  )}

  if (error) {
    return <div>เกิดข้อผิดพลาด: {error.message}</div>; // แสดงข้อความผิดพลาด
  }

  if(loading){
    return <LoadingPage />
  }

  return (
    <>
      <div className="w-[95%] h-full md:h-fit px-2 rounded-lg bg-white mx-auto">
        <div className="flex justify-between mb-2">
          <div className='overflow-hidden'>
            <h1 className="text-lg pt-3 md:pt-0 pl-2 pb-1 font-semibold">แก้ไขข้อมูล</h1>
            <div className=' relative'>
              <div className={`bg-${system?.color}-800 rounded-l-md rounded-r-lg`}>
              <div className='ml-1 mb-3 text-sm bg-gray-200 p-4 rounded-md max-w-[50vw] hidden md:block '>
                <p className='truncate'><span className='font-semibold'>ไอดีข้อมูล : </span>{id}</p>
                <p className='truncate'><span className='font-semibold'>เวลาบันทึก : </span>{moment(input.timestamp).format("DD/MM/YY HH:mm:SS น.")}</p>
              </div>
              </div>
            </div>
          </div>          
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
              onClick={handlePrev}
            >
              1
            </Step>
            <Step
              className=""
              activeClassName="bg-white text-green-800 border-green-800 border-2"
              completedClassName="bg-green-800 text-white"
              onClick={handleNext}
            >
              2
            </Step>
          </Stepper>
        </div>
        <hr />
        <form onSubmit={formSubmit}>
          <div className="my-4 mt-6 px-2 flex flex-col gap-3 md:grid md:grid-cols-2">
            {activeStep === 0 && (
              <>
                <Input
                  className="text-[1.1rem]"
                  onChange={hdlChange}
                  variant="standard"
                  name="w_date"
                  type="text"
                  size="lg"
                  label="วันที่ / เวลา"
                  placeholder="วันที่ / เวลา"
                  value={new Date(input.w_date).toLocaleString('th-TH')}
                  readOnly
                  required
                />
                <Input
                  className="text-[1.1rem]"
                  onChange={hdlChange}
                  variant="standard"
                  name="water_usage"
                  value={input.water_usage || ''}
                  type="number"
                  size="lg"
                  label="ปริมาณน้ำใช้ทุกกิจกรรม ลบ.ม."
                  placeholder="ปริมาณน้ำใช้ทุกกิจกรรม ลบ.ม."
                  required
                />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="wastewater" value={input.wastewater} type="number" size="lg" label="ปริมาณน้ำเสียเข้าระบบ ลบ.ม." placeholder="ปริมาณน้ำเสียเข้าระบบ ลบ.ม." required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="electricity_unit" value={input.electricity_unit} type="number" size="lg" label="ไฟฟ้า (Unit)" placeholder="ไฟฟ้า (Unit)" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="chlorine_kg" value={input.chlorine_kg} type="number" size="lg" label="คลอรีน (Kg)" placeholder="คลอรีน (Kg)" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="chlorine_residual" value={input.chlorine_residual} type="number" size="lg" label="คลอรีนตกค้าง (0.5-1 mg/1)" placeholder="คลอรีนตกค้าง (0.5-1 mg/1)" max="1" min="0" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="pH" type="number" value={input.pH} size="lg" label="pH (6.8-8.5)" placeholder="pH (6.8-8.5)" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="sludge_test_60min" value={input.sludge_test_60min} type="number" size="lg" label="การทดสอบตะกอน 60 นาที" placeholder="การทดสอบตะกอน 60 นาที" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="SV10" type="number" value={input.SV10} size="lg" label="SV10" placeholder="SV10" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="SV30" type="number" value={input.SV30} size="lg" label="SV30" placeholder="SV30" required />
                      <Input className="text-[1.1rem]" onChange={hdlChange} variant="standard" name="SV60" type="number" value={input.SV60} size="lg" label="SV60" placeholder="SV60" required />
              </>
            )}

            {activeStep === 1 && (
              <>
                <Input
                  className="text-[1.1rem]"
                  onChange={hdlChange}
                  variant="standard"
                  name="solid_waste"
                  type="text"
                  size="lg"
                  label="ขยะชิ้น"
                  placeholder="ขยะชิ้น"
                  value={input.solid_waste || ''}
                  required
                />
                {selectFields.map((field) => (
                  <Select
                    key={field.name}
                    value={input[field.name]} // ใช้ค่าเริ่มต้นจาก data
                    onChange={(val) => setInput((prev) => ({ ...prev, [field.name]: val }))}
                    variant="standard"
                    label={field.label}
                  >
                    {options.map((el, index) => (
                      <Option key={index} value={el.key_id}>
                        {el.name}
                      </Option>
                    ))}
                  </Select>
                ))}
                <Input className="text-[1.1rem]" onChange={hdlChange} value={input.excess_sludge} variant="standard" name="excess_sludge" type="number" size="lg" label="ตะกอนส่วนเกิน" placeholder="ตะกอนส่วนเกิน" required />
                <Input className="text-[1.1rem]" onChange={hdlChange} value={input.grease_trap} variant="standard" name="grease_trap" type="text" size="lg" label="ตักดักไขมัน" placeholder="ตักดักไขมัน" required />
                <Textarea className="text-[1.1rem]" onChange={hdlChange} value={input.other_notes} variant="standard" name="other_notes" size="lg" label="หมายเหตุ" />
              </>
            )}
          </div>
          <div className={`w-full flex justify-end ${activeStep === 0 && 'hidden'}`}>
            <Button variant="gradient" color="green" type="submit" className="w-full md:w-3/12 ml-auto my-2 md:text-[15px]">
              บันทึก
            </Button>
          </div>
        </form>
        <div className="my-5 mb-24 md:mb-12 flex justify-between md:justify-end md:gap-4">
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