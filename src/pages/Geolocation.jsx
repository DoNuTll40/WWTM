import axios from "axios";
import { useEffect, useState } from "react";

export default function Geolocation() {
  return (
    <div className="p-8 bg-white min-h-screen flex justify-center items-center text-black">
      <div className="w-full max-w-4xl border border-black p-6 text-sm font-sans">
        <div className="text-center mb-4">
          <h1 className="text-lg font-bold">แบบบันทึกตรวจสอบเวชระเบียน (OPD/ER)</h1>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm mb-4 border-b border-black pb-2">
          <div>
            <label className="font-semibold">ชื่อ-สกุล:</label>
            <input type="text" className="border-b border-black w-full" />
          </div>
          <div>
            <label className="font-semibold">HN:</label>
            <input type="text" className="border-b border-black w-full" />
          </div>
          <div>
            <label className="font-semibold">PID:</label>
            <input type="text" className="border-b border-black w-full" />
          </div>
          <div>
            <label className="font-semibold">วันที่ตรวจ:</label>
            <input type="date" className="border-b border-black w-full" />
          </div>
        </div>
        
        <div className="mb-4 border-b border-black pb-2">
          <h2 className="font-bold">ประเภทผู้ป่วย:</h2>
          <div className="flex gap-8">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" /> ผู้ป่วยทั่วไป
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="form-checkbox" /> ผู้ป่วยเรื้อรัง
            </label>
          </div>
        </div>

        <table className="w-full border border-black text-sm text-center">
          <thead>
            <tr className="bg-gray-200 border border-black">
              <th className="border border-black p-2 w-12">No</th>
              <th className="border border-black p-2">หัวข้อ</th>
              <th className="border border-black p-2 w-12">NA</th>
              <th className="border border-black p-2 w-12">ไม่มี</th>
            </tr>
          </thead>
          <tbody>
            {[
              "ข้อมูลผู้ป่วย",
              "ประวัติผู้ป่วย",
              "การตรวจร่างกาย",
              "การวินิจฉัยโรค",
              "การรักษา",
              "การติดตามผล",
              "บันทึกการผ่าตัด",
              "การให้คำยินยอม",
            ].map((item, index) => (
              <tr key={index}>
                <td className="border border-black p-2">{index + 1}</td>
                <td className="border border-black p-2 text-left">{item}</td>
                <td className="border border-black p-2">
                  <input type="checkbox" />
                </td>
                <td className="border border-black p-2">
                  <input type="checkbox" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-4 border-t border-black pt-2">
          <label className="font-semibold">ผู้ตรวจสอบ:</label>
          <input type="text" className="border-b border-black w-full" />
        </div>
        <div className="mt-2">
          <label className="font-semibold">วันที่ตรวจสอบ:</label>
          <input type="date" className="border-b border-black w-full" />
        </div>
      </div>
    </div>
  );
}
