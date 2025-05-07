
import { faCheck, faCirclePlus, faDownload, faFileCode } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Switch, Textarea } from "@material-tailwind/react"
import axios from "../../configs/axios-config";
import { useEffect, useState } from "react";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // ธีม Prism (เลือกธีมที่ชอบ)
import "prismjs/components/prism-sql.min.js"; // โหลดไฮไลต์ SQL
import DataTable from "react-data-table-component";
import SidebarHook from "../../hooks/SidebarHook";

export default function UpUsersPage() {

  const { isMini, isOpen } = SidebarHook();

  const [input, setInput] = useState({
    name: "",
    desc: "",
    query: "",
  })

  const token = sessionStorage.getItem("token");

  const [openView, setOpenView] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);

  const [openSqlView, setOpenSqlView] = useState(false);
  const [sqlView, setSqlView] = useState(null);

  const [dataView, setDataView] = useState(null);
  const [loadingView, setLoadingView] = useState(false);

  const [copied, setCopied] = useState(false);
  const [data, setData] = useState([]);
  const [updateData, setUpdateData] = useState(false);
 
  const hdlOpenView = async () => {
    setOpenView(!openView)
    if(!openView){
      setLoadingView(true)
      try {
        const rs = await axios.get("/sql/query/view", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(rs.status === 200){
          setDataView(rs.data.result);
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoadingView(false)
      }
    }else{
      setDataView(null);
    }
  };

  const hdlOpenCreate = () => {
    setOpenCreate(!openCreate)
    setInput({
      name: "",
      desc: "",
      query: "",
    })
  };

  const loop = [
    { name: "viewPrompt", title: "อัพเดท", color: "green", variant: "outlined", icon: faDownload, funtion: () => hdlOpenView()},
    { name: "createPrompt", title: "เพิ่มคำสั่ง", color: "yellow", variant: "outlined", icon: faCirclePlus, funtion: () => hdlOpenCreate()},
  ]
  
  const handleCopy = (query) => {
    const textToCopy = query;
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy'); // ใช้ document.execCommand แทน Clipboard API
    document.body.removeChild(textArea); // ลบ textarea ออกหลังคัดลอกเสร็จ
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // แสดงข้อความ "Copied!" แล้วหายไปภายใน 3 วินาที
  };

  useEffect(() => {
    Prism.highlightAll(); // ใช้ Prism ไฮไลต์โค้ดหลัง render
  }, [dataView?.query]);

  useEffect(() => {
    const getDataQuery = async () => {
      try {
        const rs = await axios.get("/sql/query/views", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if(rs.status === 200){
          setData(rs.data.result);
        }
      } catch (err) {
        console.log(err)
      }
    }

    getDataQuery();
  }, [token, updateData])

  const hdlSubmit = async (e) => {
    e.preventDefault()
    try {
      const rs = await axios.post("/sql/query/add", input, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(rs.status === 200){
        hdlOpenCreate()
        setUpdateData(!updateData)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const hdlStatus = async (id) => {
    try {
      const rs = await axios.patch(`/sql/query/update-status?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

      if(rs.status === 200){
        setUpdateData(!updateData)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const hdlChange = (e) => {
    setInput( (prev) => ({ ...prev, [e.target.name]: e.target.value }) );
  }

  const viewSql = (query) => {
    setSqlView(query)
    setOpenSqlView(!openSqlView)
  }

  const columns = [
    { name: "ไอดี", selector: rows => rows?.id, sortable: true, maxWidth: "100px" },
    { name: "ชื่อคำสั่ง", selector: rows => rows?.name, sortable: true, maxWidth: "120px" },
    { name: "คำอธิบาย", selector: rows => rows?.desc, sortable: true, maxWidth: "200px" },
    { name: "คำสั่ง SQL", selector: rows => rows?.query, sortable: true, maxWidth: "260px" },
    { name: "วันที่สร้าง", selector: rows => rows?.create_at, sortable: true },
    { name: "สถานะใช้งาน", selector: rows => 
      <div className="select-none flex gap-2 justify-center">
        <span>ปิด</span>
        <Switch className=" drop-shadow-md border border-blue-800" color="blue" checked={rows.active} onClick={ () => hdlStatus(rows.id)} />
        <span>เปิด</span>
      </div>
    , sortable: true, maxWidth: "130px" },
    { name: "ดูคำสั่ง", selector: rows => 
      <div className="select-none mx-auto">
        <Button color="blue" className="flex gap-1 justify-center items-center" onClick={ () => viewSql(rows.query)}><FontAwesomeIcon icon={faFileCode} /> ดู</Button>
      </div>
    , sortable: true, maxWidth: "100px"},
  ]
  
  return (
    <div className="w-[95%] min-h-[90vh] md:min-h-[35vw] shadow-lg p-4 mx-auto rounded-lg bg-white">

      {/* info pages */}
      <div className={`bg-red-700 rounded-md md:max-w-[30vw]`}>
        <div className="bg-gray-200 ml-1.5 mr-0.5 p-2 rounded-md">
          <p className="text-lg font-semibold line-clamp-1">อัพเดทข้อมูลผู้ใช้</p>
          <p className="text-sm text-gray-700 font-medium line-clamp-1">เป็นการอัพเดทข้อมูลทั้งหมดจากฐานข้อมูล <a className="underline underline-offset-1 hover:text-blue-700 hover:font-semibold" href="http://backoffice.akathospital.com/" target="_blank" >BackOffice</a></p>
        </div>
      </div>

      {/* head options */}
      <div className="w-full my-2 flex gap-2 justify-end">
        {loop.map((el, index) => (
          <Button 
            className={`border-${el.color}-500 focus:border-${el.color}-500 border-2 text-${el.color}-900 py-2 text-sm`} 
            key={index + 1} 
            variant={el.variant} 
            name={el.name}
            onClick={el.funtion}
            >
              <FontAwesomeIcon icon={el.icon} /> {el.title}
          </Button>
        ))}
      </div>

      <hr />

      {/* data output */}
      <div 
      className={`w-[90vw] pb-16 md:pb-0 mx-auto px-2 my-4 transition-all duration-100 ease-in-out transform bg-white
      ${isOpen ? isMini ? "max-w-[85vw]" : "md:max-w-[60vw] xl:max-w-[75vw]" : "max-w-[90vw]"}`
      }>
      <div className="overflow-x-auto mx-auto rounded-md select-none text-lg">
        <DataTable
          columns={columns}
          data={data}
          striped
          pagination
          responsive
          paginationPerPage={5}
          paginationRowsPerPageOptions={[5, 10, 25, 50, 100]} // ตัวเลือกจำนวนแถว
          fixedHeaderScrollHeight="68vh"
        />
      </div>
      </div>

      {/* modal view prompt */}
      <Dialog className="max-h-[90vh]" name="modal_view_prompt" open={openView} handler={hdlOpenView}>
        <DialogHeader>รายละเอียดคำสั่ง</DialogHeader>
        <DialogBody className="my-0 py-0">
          <div>
            {loadingView && <p>Loading...</p>}

            {dataView !== null ? (
              <div className="border py-4 rounded-md shadow-md">
                <div className="flex justify-between px-3 select-none">
                  <div>
                    <p className="font-semibold">ชื่อคำสั่ง : {dataView.name}</p>
                    <p className="text-sm text-gray-700">รายละเอียดคำสั่ง : {dataView.desc}</p>
                  </div>
                  <div className="text-xs bg-gradient-to-t from-amber-600 to-amber-300 h-fit px-3 py-1 text-white rounded-full font-semibold shadow-md">
                    <p>สถานะการใช้งาน : {dataView.active ? "ใช้งาน" : "ปิดการใช้งาน"}</p>
                  </div>
                </div>
                <div className="relative">
                  <pre className="lang-sql text-xs my-2 bg-gray-100 p-2 max-h-[50vh] overflow-y-auto overflow-x-auto group pb-4">
                    {dataView.query}
                  </pre>
                    <button 
                      onClick={ () => handleCopy(dataView.query)} 
                      className="absolute top-2 right-6 text-sm bg-gray-300/80 shadow-inner rounded-full p-1 hover:bg-gray-400/80 transition-all duration-100"
                      title="Copy"
                    >
                      {copied ?
                        <div className="flex gap-1 items-center px-2 text-xs font-medium justify-center"><FontAwesomeIcon icon={faCheck} /> Copied</div>
                      :
                        <div className="flex gap-1 items-center px-2 text-xs font-medium justify-center"><FontAwesomeIcon icon={faCopy} /> Copy</div>
                      }
                    </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">ไม่มีข้อมูล</p>
            )}
          </div>
        </DialogBody>
        <DialogFooter className="p-2">
          <Button className="w-full mb-1 text-sm py-2 bg-gradient-to-t from-green-800 to-green-500 hover:opacity-90 border-none outline-none mx-2 drop-shadow-md">เริ่ม</Button>
          <Button
            variant="text"
            color="red"
            onClick={hdlOpenView}
            className="mr-1"
          >
            <span>ปิด</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* modal create prompt */}
      <Dialog className="max-h-[90vh]" name="modal_create_prompt" open={openCreate} handler={hdlOpenCreate}>
        <DialogHeader>เพิ่มคำสั่ง</DialogHeader>
        <DialogBody className="my-0 py-0">
          <form onSubmit={hdlSubmit} className="flex flex-col gap-2 ">
            <Input name="name" label="ชื่อคำสั่ง" onChange={hdlChange} required />
            <Input name="desc" label="คำอธิบาย" onChange={hdlChange} required />
            <Textarea name="query" label="คำสั่ง SQL" className="max-h-[50vh]" rows={12} onChange={hdlChange} required />
            <Button type="submit">บันทึกข้อมูล</Button>
          </form>
        </DialogBody>
        <DialogFooter className="p-2">
          <Button
            variant="text"
            color="red"
            onClick={hdlOpenCreate}
            className="mr-1"
          >
            <span>ปิด</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* view sql query table */}
      <Dialog className="max-h-[90vh]" name="modal_view_prompt" open={openSqlView} handler={viewSql}>
        <DialogHeader>คำสั่ง SQL Query</DialogHeader>
        <DialogBody className="my-0 py-0">
          <div className="relative">
            <pre className="lang-sql text-xs my-2 bg-gray-100 p-2 max-h-[50vh] overflow-y-auto overflow-x-auto group pb-4">
              {sqlView}
            </pre>
            <button 
              onClick={ () => handleCopy(sqlView)} 
              className="absolute top-2 right-6 text-sm bg-gray-300/80 shadow-inner rounded-full p-1 hover:bg-gray-400/80 transition-all duration-100"
              title="Copy"
            >
              {copied ?
              <div className="flex gap-1 items-center px-2 text-xs font-medium justify-center"><FontAwesomeIcon icon={faCheck} /> Copied</div>
                :
              <div className="flex gap-1 items-center px-2 text-xs font-medium justify-center"><FontAwesomeIcon icon={faCopy} /> Copy</div>
              }
            </button>
          </div>
        </DialogBody>
        <DialogFooter className="p-2">
          <Button
            variant="text"
            color="red"
            onClick={viewSql}
            className="mr-1"
          >
            <span>ปิด</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
