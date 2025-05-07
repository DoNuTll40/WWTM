/* eslint-disable react-hooks/exhaustive-deps */
import axios from "../../configs/axios-config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SidebarHook from "../../hooks/SidebarHook";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const { isMini, isOpen } = SidebarHook();
  let token = sessionStorage.getItem("token");

  const navigate = useNavigate();

  const getUsers = async () => {
    const toastLoading = toast.loading("กำลังโหลดข้อมูล...");

    try {
      if (!token) {
        return;
      }

      const rs = await axios.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (rs.status === 200) {
        
        const generateDataImage = rs.data.users.map((user, index) => {
          let imageUrl = null;
          if (user.image_blob) {
            const byteArray = new Uint8Array(Object.values(user.image_blob));
            const blob = new Blob([byteArray], { type: "image/jpeg" });
            imageUrl = URL.createObjectURL(blob);
          }
          return { ...user, imageUrl, key: index };
        });
        
        setData(generateDataImage);

        toast.update(toastLoading, {
          render: rs.data.message,
          type: "success",
          isLoading: false,
          theme: "colored",
          autoClose: 2000,
        });
      }
    } catch (err) {
      console.log(err);
      toast.update(toastLoading, {
        render:"เกิดข้อผิดพลาด: " + (err.response?.data?.message || "ไม่สามารถโหลดข้อมูลได้"),
        type: "error",
        isLoading: false,
        theme: "colored",
        autoClose: 3000,
      });
      if (err.response.data.message.startsWith("TokenExpiredError")) {
        sessionStorage.removeItem("token");
        setUser(null)
      }
    }
  };

  useEffect(() => {
    getUsers()
  }, []);

  useEffect(() => {
    return () => {
      data.forEach(user => {
        if (user.imageUrl) {
          URL.revokeObjectURL(user.imageUrl);
        }
      });
    };
  }, [data]);

  const columns = [
    { 
      name: "รูปภาพ", 
      cell: row => (
        row.imageUrl ? (
          <img 
            src={row.imageUrl} 
            alt="profile" 
            className="max-w-9 max-h-9 pl-1"
          />
        ) : (
          <div className="bg-gray-300 text-gray-600 rounded-full flex items-center justify-center w-9 h-9">
            N/A
          </div>
        )
      ), 
      ignoreRowClick: true, 
      allowOverflow: true,
      maxWidth: "2.5rem",
    },
    {
      id: "id_ofw",
      name: <span title="รหัสประจำตัวบุคลากร">ไอดี</span>,
      selector: row => row.hrd_person_id,
      sortable: true,
      maxWidth: "20px",
      cell: row => <div className="w-12">{row.hrd_person_id}</div>, // กำหนดความกว้าง
    },
    {
      name: "คำนำหน้า",
      selector: row => row.ofw_prefix,
      sortable: true,
      cell: row => <div className="w-16 truncate">{row.ofw_prefix}</div>, // ตัดข้อความที่ยาวเกิน
      maxWidth: "30px",
      title: "คำนำหน้า",
    },
    {
      name: "ชื่อจริง",
      selector: row => row.ofw_fullname,
      sortable: true,
      cell: row => <div className="w-48 truncate" title={row.ofw_fullname}>{row.ofw_fullname}</div>, // กำหนดให้กว้างขึ้น
      maxWidth: "170px"
    },
    {
      name: "ชื่ออังกฤษ",
      selector: row => row.ofw_eng_name,
      sortable: true,
      cell: row => <div className="w-52 truncate">{row.ofw_eng_name || "-"}</div>,
      maxWidth: "150px"
    },
    { name: "ชื่อเล่น", selector: row => row.ofw_nickname || "-", sortable: true, maxWidth: "20px" },
    { name: "เบอร์โทร", selector: row => row.ofw_phone || "-", sortable: true, maxWidth: "120px" },
    { name: "ชื่อผู้ใช้งาน", selector: row => row.ofw_username, sortable: true, maxWidth: "50px" },
    { id: "status_row",name: "สถานะ", selector: row => row.status, sortable: true, maxWidth:"30px" },
    { name: "กลุ่มงาน", selector: row => row.ofw_department, sortable: true, maxWidth: "170px" },
    { name: "หน่วยงาน", selector: row => row.ofw_department_sub_sub, sortable: true },
    { 
      name: "การจัดการ", 
      width: "fit-content",
      cell: row => (
        <div className="flex gap-2 w-full px-2">
          <button 
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={() => console.log(row)}
          >
            แก้ไข
          </button>
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded"
            onClick={() => console.log(row)}
          >
            ลบ
          </button>
        </div>
      ),
      ignoreRowClick: true, // ป้องกันไม่ให้คลิกที่ปุ่มส่งผลกับการเลือกแถว
      allowOverflow: true, // อนุญาตให้เนื้อหาล้นในเซลล์นี้
      button: true, // แสดงสไตล์เหมือนปุ่ม
    }
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
      },
    },
    cells: {
      style: {
        fontSize: '14px', // ขนาดตัวหนังสือของเซลล์
      },
    },
  };

  return (
    <div 
      className={`mx-auto w-screen px-2 md:my-4 pb-10 transition-all duration-100 ease-in-out transform bg-white
      ${isOpen ? isMini ? "max-w-[90rem]" : "max-w-[78rem]" : "max-w-[90rem]"}`
      }>
      <div className="overflow-x-auto rounded-md shadow-md select-none text-lg">
        <DataTable
          data={data}
          columns={columns}
          fixedHeader
          striped
          pagination
          responsive
          subHeader
          defaultSortFieldId="status_row"
          defaultSortAsc={false}
          customStyles={customStyles}
          progressPending={!data.length}
          progressComponent={<div>Loading...</div>}
          subHeaderWrap
          paginationPerPage={10} // จำนวนแถวเริ่มต้นต่อหน้า
          paginationRowsPerPageOptions={[5, 10, 25, 50, 100]} // ตัวเลือกจำนวนแถว
          fixedHeaderScrollHeight="68vh"
          subHeaderComponent={<div className="text-lg font-semibold">รายชื่อผู้ใช้งานทั้งหมดในระบบ</div>}
        />
    </div>
    </div>
  );
}
