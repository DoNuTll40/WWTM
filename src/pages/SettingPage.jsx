import { Input } from "@material-tailwind/react";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import axios from "../configs/axios-config";

export default function SettingPage() {
  const [data, setData] = useState([])

  useEffect( () => {
    const getList = async () => {
      try {
        const rs = await axios.get("/system/list")
        setData(rs.data.result)
      } catch (err) {
        console.log(err)
      }
    }
    getList();
  }, [])
  const columns = [
    { name: "ไอดี", selector: row => row.id, sortable: true },
    { name: "หัวระบบ", selector: row => row.header, sortable: true },
    { name: "ส่วนท้าย", selector: row => row.footer,   sortable: true },
    { name: "เวอร์ชั่น", selector: row => row.version, sortable: true },
    { name: "สีระบบ", selector: row => row.color, sortable: true },
    { name: "อัพเดตล่าสุด", selector: row => row.update_at, sortable: true },
    { name: "เว็บที่ใช้งาน", selector: row => row.type_web, sortable: true },
  ]

  return (
    <div className="px-4 text-[18px]">
      <h1 className="my-2 text-lg font-semibold px-1">การตั้งค่า</h1>
      <Input label="หัวเรื่องของระบบ" size="lg" />
      <DataTable
        data={data}
        columns={columns}
      />
    </div>
  )
}
