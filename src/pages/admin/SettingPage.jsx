import { Button, Dialog, DialogBody, DialogHeader, Input, Option, Select } from "@material-tailwind/react";
import DataTable from "react-data-table-component";
import { cloneElement, useEffect, useState } from "react";
import axios from "../../configs/axios-config";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import moment from "moment/moment";
// import { toast } from "react-toastify";

export default function SettingPage() {
  const [data, setData] = useState([])
  const [input, setInput] = useState({
    color: "green",
    header: "",
    footer: "",
    version: null,
  })
  const [open, setOpen] = useState(false);

  const createAt = new Date();

  const updateAt = new Date();

  const handleOpen = () => setOpen(!open);

  const navigate = useNavigate();

  document.title = "ADMIN / ตั้งค่าระบบ"

  let token = sessionStorage.getItem("token");

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
    { name: "สีระบบ", 
      selector: (row, index) => 
        <div className="flex items-center gap-1" key={index + 1}>
          <div className={`w-6 h-6 rounded-full bg-${row?.color}-600`}></div>
          <p>{row?.color}</p>
        </div>,
      sortable: true },
    { name: "อัพเดตล่าสุด", selector: row => row.update_at, sortable: true },
    { name: "เว็บที่ใช้งาน", selector: row => row.type_web, sortable: true },
    { name: "ตัวเลือก", 
      selector: ( row, index ) => 
      <div key={index + 1}>
        <Button onClick={ () => navigate(`${row?.id}`)}>แก้ไข</Button>
        {/* <Button></Button> */}
      </div>, 
      sortable: true
    },
  ]

  const handleChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    e.preventDefault();
    try {
      const rs = await axios.post("/system/create", input, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(rs.status === 200){
        alert(rs.data.message);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const hdlReset = (e) => {
    e.preventDefault();
    setInput({
      header: "",
      color: "",
      footer: "",
      version: null
    })
  }

  return (
    <div className="px-4 text-[18px] bg-white">
      <h1 className="my-2 text-lg font-semibold px-1">การตั้งค่า</h1>
      <Button onClick={handleOpen}>+</Button>
      <Dialog open={open} handler={handleOpen}>
        <DialogHeader>
          <div className="flex justify-between w-full">
            <p>เพิ่มการตั้งค่า</p>
            <button className="group" onClick={handleOpen}><FontAwesomeIcon className=" group-hover:rotate-180 group-hover:text-red-800 transition-all duration-150 ease-in-out transform" icon={faXmark} /></button>
          </div>
        </DialogHeader>
        <DialogBody className="pt-0">
          <form onSubmit={hdlSubmit} onReset={hdlReset}>
            <div className={`w-full h-10 flex items-center px-2 bg-${input?.color}-800 mb-2 rounded-md text-white font-semibold`}>
              <FontAwesomeIcon className="pl-2 mr-3" icon={faBars} />
              <p className="text-md">{input.header}</p>
            </div>
            <hr />
            <p className="mb-3 text-sm font-medium mt-1 text-center drop-shadow-sm">Copyright &copy; {moment(createAt).format("YYYY")} {input.footer} | เวอร์ชั่น v {input.version} | อัพเดทล่าสุด {moment(updateAt).add(543, 'year').format("DD/MMM/YY")}</p>
            <div className="my-2">
              <Select 
                name="color"
                className="bg-white rounded-lg shadow-sm"
                selected={(element) =>
                  element &&
                  cloneElement(element, {
                    disabled: true,
                    className:
                    "flex items-center opacity-100 px-0 gap-2 pointer-events-none",
                  })
                }
                menuProps={{
                  className: "bg-white rounded-lg shadow-lg", // สไตล์เมนู dropdown
                }}
                label="เลือกสีของระบบ"
                onChange={(vel) => setInput((prev) => ({ ...prev, color:vel }))}
                >
              {['red', 'blue', 'green', 'yellow', 'purple', 'gray', 'pink', 'indigo', 'teal', 'cyan', 'amber', 'lime'].map((color) => (
                <Option key={color} className="flex gap-2" value={color} disabled={data.find((el) => el.color === color)}>
                  <p className={`bg-${color}-700 w-5 h-5 overflow-hidden shadow-md rounded-full`}></p>
                  <p className="drop-shadow-md">{color}</p>
                </Option>
              ))}
              </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Input label="หัวเรื่องของระบบ" name="header" value={input.header} onChange={handleChange} size="lg" />
                <Input label="ส่วนข้างล่าง" name="footer" value={input.footer} onChange={handleChange} size="lg" />
                <Input className="" label="เวอร์ชั่นของระบบ" name="version" value={input.version} onChange={handleChange} size="lg" />
                <Input className="" label="ประเภทระบบ" name="type_web" value={input.type_web} onChange={handleChange} size="lg" />
              </div>
              <div className="flex justify-end">
                <Button type="reset">ล้างข้อมูล</Button>
                <Button type="submit">บันทึกข้อมูล</Button>
              </div>
          </form>
        </DialogBody>
      </Dialog>
      <div className={`max-w-[90vw] mx-auto`}>
        <DataTable
          data={data}
          columns={columns}
          keyField="id"
          responsive
          striped
          pagination
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </div>
    </div>
  )
}
