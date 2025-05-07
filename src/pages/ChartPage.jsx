/* eslint-disable react/prop-types */
import { Button, Input, Option, Select } from "@material-tailwind/react";
import AppHook from "../hooks/AppHook";
import { useState } from "react";
import axios from "../configs/axios-config";
import moment from "moment/moment"
import "moment/locale/th.js";
import SidebarHook from "../hooks/SidebarHook";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; // สำหรับ Export Excel
import { saveAs } from "file-saver"; // สำหรับบันทึกไฟล์
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTable } from "@fortawesome/free-solid-svg-icons";
// import Papa from "papaparse"; // สำหรับ Export CSV

export default function ChartPage() {

  const { system } = AppHook();
  const { isMini, isOpen } = SidebarHook();
  const [data, setData] = useState([]);
  const [ statusData, setStatusData ] = useState(false)
  const [input, setInput] = useState({
    type_web: "",
    start_date: "",
    end_date: "", 
  });

  const color = system?.color;

  let token = sessionStorage.getItem("token");

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const hdlClick = async () => {

    if (input.end_date === "" || input.start_date === "" || input.type_web === "") {
      return toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
    }
  
    try {
      const rs = await axios.get(`/user/record/views/report?type=${input.type_web}&start=${input.start_date}&end=${input.end_date}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (rs.status === 200) {
        setData(rs.data.result);
        setStatusData(true)
      }
    } catch (err) {
      console.log(err);
      toast.error("เกิดข้อผิดพลาดในการดึงข้อมูล");
    }
  };

  const hdlReset = () => {
    setInput({
      type_web: "",
      start_date: "",
      end_date: "",
    })
    setData([]);
    setStatusData(false)
  }

  const columns = [
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
    { name: <span className="truncate" title="ระบบบำบัด">ระบบบำบัด</span>, selector: row => <div className={`px-5 text-white rounded-full ${row.fix_treatment_id === 1 ? "bg-gradient-to-tr from-red-800 to-red-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.treatment_status.status_name}</div>, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="เครื่องสูบน้ำ">เครื่องสูบน้ำ</span>, selector: row => <div className={`px-5 text-white rounded-full ${row.fix_pump_id === 1 ? "bg-gradient-to-tr from-red-800 to-red-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.water_pump_status.status_name}</div>, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="เครื่องเติมอากาศ">เครื่องเติมอากาศ</span>, selector: row => <div className={`px-5 text-white rounded-full ${row.fix_aerator_id === 1 ? "bg-gradient-to-tr from-red-800 to-red-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.aerator_status.status_name}</div>, maxWidth: "150px", sortable: true},
    { name: <span className="truncate" title="เครื่องสูบตะกอน">เครื่องสูบตะกอน</span>, selector: row => <div className={`px-5 text-white rounded-full ${row.fix_sludge_id === 1 ? "bg-gradient-to-tr from-red-800 to-red-500" : "bg-gradient-to-tr from-green-800 to-green-500"}`}>{row.sludge_pump_status.status_name}</div>, maxWidth: "150px", sortable: true},
  ]

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

  // ฟังก์ชันสำหรับ Export ข้อมูลเป็นไฟล์ Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายงานข้อมูล");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `รายงาน ${input?.type_web} วันที่${moment(input?.start_date).format("DDMMYY")}-${moment(input?.end_date).format("DDMMYY")}.xlsx`);
  };

  // ฟังก์ชันสำหรับ Export ข้อมูลเป็นไฟล์ CSV
  // const exportToCSV = () => {
  //   const csv = Papa.unparse(data);
  //   const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  //   saveAs(blob, `รายงานข้อมูล.csv`);
  // };

  return (
    <div className="w-[95%] md:w-[99%] min-h-[80vh] px-2 rounded-lg pt-3 md:pt-0 bg-white mx-auto">
      <div className={`bg-${color}-800 md:max-w-[30vw] lg:max-w-[20vw] rounded-l-md rounded-r-lg`}>
        <h1 className="text-lg font-semibold bg-gray-200 h-[3rem] flex items-center ml-1.5 px-2 rounded-md">ข้อมูลรายงาน</h1>
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-2">
        <Select name="type_web" value={input.type_web} label="ประเภทของข้อมูล" onChange={ val => setInput( (prev) => ({ ...prev, type_web: val }))}>
          <Option value="WWTM">ข้อมูลบำบัดน้ำ</Option>
        </Select>
        <Input name="start_date" value={input.start_date} type="date" label="วันที่เริ่มต้น (เดือน/วัน/ปี ค.ศ.)" onChange={hdlChange} />
        <Input name="end_date" value={input.end_date} min={input.start_date} type="date" label="วันที่สิ้นสุด (เดือน/วัน/ปี ค.ศ.)" disabled={input.start_date === ""} onChange={hdlChange} />
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-2">
          <Button color="green" onClick={ () => hdlClick() }>ยืนยัน</Button>
          <Button color="amber" disabled={input.type_web === "" || input.end_date === "" || input.start_date === ""} onClick={ () => hdlReset() }>รีเซ็ตรายงาน</Button>
        </div>
      </div>

      {/* render data elements if in use data*/}
      {statusData && (
        <>
          <hr className="my-4" />
          <div 
          className={`w-[90vw] pb-20 mx-auto px-2 my-4 transition-all duration-100 ease-in-out transform bg-white
            ${isOpen ? isMini ? "max-w-[90vw]" : "md:max-w-[60vw] xl:max-w-[80vw]" : "max-w-[90vw]"}`
          }>
            <div className="flex gap-2 mb-4 justify-end md:justify-start">
              <Button className="text-sm font-sans bg-green-700" size="sm" color="green" onClick={exportToExcel}><FontAwesomeIcon icon={faTable} /> บันทึก</Button>
              {/* <Button onClick={exportToCSV}>Export CSV</Button> */}
            </div>
            <div className="overflow-x-auto mx-auto rounded-md shadow-md select-none text-lg">
              <DataTable 
                data={data} 
                columns={columns} 
                pagination
                fixedHeader
                striped
                responsive
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
      )}
    </div>
  );
}
