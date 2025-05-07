/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import axios from "../configs/axios-config";
import CountUp from "react-countup";
import moment from "moment/moment"
import "moment/locale/th.js";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faHourglassStart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SidebarHook from "../hooks/SidebarHook";
import AppHook from "../hooks/AppHook";
import { useNavigate } from "react-router-dom";
import { Button, Checkbox } from "@material-tailwind/react";
import UserHook from "../hooks/UserHook";
import { toast } from "react-toastify";

// moment.locale("th")

export default function MiniDashBoard() {
  const { user } = UserHook();
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { isMini, isOpen } = SidebarHook();
  const { system } = AppHook();
  const [complete, setComplete] = useState(null)

  const navigate = useNavigate();

  let token = sessionStorage.getItem("token");
  
  let pathUser = user?.ofw_department_sub_sub_id === 43 ? "user/record/views" : "user/record/view"

  const getDataOfDay = async () => {
    setIsLoading(true)
    try {
      const rs = await axios.get(`${pathUser}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(rs.status === 200){
        setData(rs.data.result)
        setComplete(rs.data.complete)
      }
    }catch(err){
      console.log(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    getDataOfDay();
  }, [])

  const hdlCheckBox = async (e, row) => {
    e.preventDefault();
    try {

      const status = { status: !row.status };

      const rs = await axios.patch(`/user/record/edit?id_w=${row.id_w}`, status, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (rs.status === 200) {
        toast.success("อัพเดตสำเร็จ", {
          autoClose: 1500,
        }); // แสดงข้อความ success ด้วย toast
        getDataOfDay(); // เรียกข้อมูลใหม่หลังอัพเดตสำเร็จ
      } else {
        toast.error("ไม่สามารถอัพเดตได้"); // แสดงข้อความ error ด้วย toast
      }
    } catch (err) {
      console.log('Error updating status:', err);
      toast.error("เกิดข้อผิดพลาดในการอัพเดต"); // แสดงข้อความ error ด้วย toast
    }
  }

  const columns = [
    user?.ofw_department_sub_sub_id === 43 ?
    { name: <span className="truncate" title="ตรวจแล้ว">ตรวจแล้ว</span>, selector: row => 
      <div className={`mx-auto`}>
        <Checkbox color="green" checked={row.status} onClick={ (e) => hdlCheckBox(e, row)} />
      </div>,
      maxWidth: "100px", sortable: true}
    : { name: "ตัวเลือก", selector: (row, index) => <button className=" hover:underline disabled:hover:no-underline disabled:cursor-default disabled:opacity-30" disabled={row.status} key={index + 1} onClick={ () => navigate(`/record/${row.id_w}`)}>แก้ไข</button>, maxWidth: "10px" },
    { name: "ลำดับ", selector: (row, index) => Number(index + 1), maxWidth: "10px" },
    { name: "วันที่บันทึก", selector: row => moment(row.w_date).locale('th').add(543, 'year').format("DD/MM/YYYY"), sortable: true },
    { name: "เวลาบันทึก", selector: row => moment(row.w_date).locale('th').format("HH:mm:ss น."), sortable: true },
    { name: <span className="truncate" title="ปริมาณน้ำใช้ทุกกิจกรรม ลบ.ม.">ปริมาณน้ำใช้ทุกกิจกรรม ลบ.ม.</span>, selector: row => row.water_usage, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="ปริมาณน้ำเสียเข้าระบบ ลบ.ม.">ปริมาณน้ำเสียเข้าระบบ ลบ.ม.</span>, selector: row => row.wastewater, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="ไฟฟ้า (Unit)">ไฟฟ้า (Unit)</span>, selector: row => row.electricity_unit, maxWidth: "120px", sortable: true},
    { name: <span className="truncate" title="คลอรีน (Kg)">คลอรีน (Kg)</span>, selector: row => row.chlorine_kg, maxWidth: "120px", sortable: true},
    { name: <span className="truncate" title="คลอรีนตกค้าง (0.5-1 mg/1)">คลอรีนตกค้าง (0.5-1 mg/1)</span>, selector: row => row.chlorine_residual, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="pH (6.8-8.5)">pH (6.8-8.5)</span>, selector: row => row.pH, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="การทดสอบตะกอน 60 นาที">การทดสอบตะกอน 60 นาที </span>, selector: row => row.sludge_test_60min, maxWidth: "150px", sortable: true},
    // { name: <span className="truncate" title="SV10">SV10</span>, selector: row => row.SV10, maxWidth: "150px", sortable: true},
    // { name: <span className="truncate" title="SV30">SV30</span>, selector: row => row.SV30, maxWidth: "150px", sortable: true},
    // { name: <span className="truncate" title="SV60">SV60</span>, selector: row => row.SV60, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="ระบบบำบัด">ระบบบำบัด</span>, selector: row => <div className={`px-5 text-white rounded-full ${row.fix_treatment_id === 1 ? "bg-gradient-to-tr from-red-800 to-red-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.treatment_status.status_name}</div>, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="เครื่องสูบน้ำ">เครื่องสูบน้ำ</span>, selector: row => <div className={`px-5 text-white rounded-full ${row.fix_pump_id === 1 ? "bg-gradient-to-tr from-red-800 to-red-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.water_pump_status.status_name}</div>, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="เครื่องเติมอากาศ">เครื่องเติมอากาศ</span>, selector: row => <div className={`px-5 text-white rounded-full ${row.fix_aerator_id === 1 ? "bg-gradient-to-tr from-red-800 to-red-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.aerator_status.status_name}</div>, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="เครื่องสูบตะกอน">เครื่องสูบตะกอน</span>, selector: row => <div className={`px-5 text-white rounded-full ${row.fix_sludge_id === 1 ? "bg-gradient-to-tr from-red-800 to-red-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.sludge_pump_status.status_name}</div>, maxWidth: "150px", sortable: true},
    // { name: <span className="truncate" title="ตะกอนส่วนเกิน">ตะกอนส่วนเกิน</span>, selector: row => row.excess_sludge, maxWidth: "150px", sortable: true},
    // { name: <span className="truncate" title="ตักดักไขมัน">ตักดักไขมัน</span>, selector: row => row.grease_trap, maxWidth: "150px", sortable: true},
    // { name: <span className="truncate" title="บันทึก อื่นๆ">บันทึก อื่นๆ</span>, selector: row => row.other_notes, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="สถานะ">สถานะ</span>, selector: row => <div className={`px-5 text-white rounded-full ${!row.status ? "bg-gradient-to-tr from-yellow-800 to-yellow-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.status ? <FontAwesomeIcon icon={faCircleCheck} /> : <FontAwesomeIcon icon={faHourglassStart} /> }</div>, maxWidth: "100px", sortable: true}
  ]

  const customStyles = {
    header: {
      style: {
        // fontSize: '6px', // ขนาดตัวหนังสือของส่วนหัว
        fontWeight: 'bold',
      },
    },
    rows: {
      style: {
        fontSize: '16px', // ขนาดตัวหนังสือของข้อมูลในแถว
      },
    },
    headCells: {
      style: {
        fontSize: '15px', // ขนาดตัวหนังสือของหัวข้อคอลัมน์
        fontWeight: 'bold',
        backgroundColor: 'rgb(230, 244, 244)',
      },
    },
    cells: {
      style: {
        fontSize: '14px', // ขนาดตัวหนังสือของเซลล์
      },
    },
  };

  const ExpandComponents = ({ data }) => {
    return (
      <div className="py-2 px-5 text-sm pl-16">
        {/* <p>รหัสข้อมูล : {data.id_w}</p> */}
        <div className="flex gap-4">
          <p>SV10 : {data.SV10}</p>
          <p>SV30 : {data.SV30}</p>
          <p>SV60 : {data.SV60}</p>
        </div>
        <p>ตะกอนส่วนเกิน : {data.excess_sludge}</p>
        <p>ตักดักไขมัน : {data.grease_trap}</p>
        <p>บันทึก อื่นๆ : {data.other_notes}</p>
      </div>
    )
  }

  return (
    <>
      <div className=" relative">
        <p className="text-center font-bold text-[17px] underline mb-3 absolute mx-auto right-0 left-0 -top-5 shadow-md bg-white w-fit px-6 py-1 rounded-lg">ข้อมูลทั้งเดือน</p>
        <hr className="my-5" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 md:my-8 gap-1 pt-2">
        <div className={`bg-gradient-to-br from-${system?.color}-800 to-${system?.color}-600 hover:to-${system?.color}-400 h-20 rounded-lg shadow-md border flex justify-between text-white p-2`}>
          {/* use map for data */}
          <h1>จำนวนข้อมูลที่มี</h1>
          <h1 className="mt-auto text-3xl"><CountUp start={0} end={data.length} duration={3} /></h1>
        </div>
        <div className={`bg-gradient-to-br from-${system?.color}-800 to-${system?.color}-600 hover:to-${system?.color}-400 h-20 rounded-lg shadow-md border flex justify-between text-white p-2`}>
          {/* use map for data */}
          <h1>ตรวจแล้ว</h1>
          <h1 className="mt-auto text-3xl"><CountUp start={0} end={complete} duration={3} /></h1>
        </div>
      </div>
      <div 
      className={`w-[90vw] pb-16 mx-auto px-2 my-4 transition-all duration-100 ease-in-out transform bg-white
      ${isOpen ? isMini ? "max-w-[85vw]" : "md:max-w-[60vw] xl:max-w-[75vw]" : "max-w-[90vw]"}`
      }>
      <div className="overflow-x-auto mx-auto rounded-md shadow-md select-none text-lg">
        <DataTable 
          data={data} 
          columns={columns} 
          pagination
          fixedHeader
          striped
          responsive
          progressPending={user?.ofw_department_sub_sub_id !== 43 && isLoading}
          customStyles={customStyles}
          paginationPerPage={5}
          expandableRows
          expandableRowsComponent={ExpandComponents}
          fixedHeaderScrollHeight="68vh"
          paginationRowsPerPageOptions={[5, 10, 25, 50, 100]} // ตัวเลือกจำนวนแถว
        />
      </div>
      </div>
      </>
  );
}
