import moment from "moment/moment";
import { useEffect, useState } from "react";
import "moment/locale/th";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { DynamicBreadcrumbs } from "./DynamicBreadcrumbs";

export default function RealClock() {

  const [currentTime, setCurrentTime] = useState(moment().locale('th').format('วันdddd ที่ Do MMMM YYYY เวลา HH:mm:ss น.'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().locale('th').format('วันdddd ที่ Do MMMM YYYY เวลา HH:mm:ss น.'));
    }, 1000); // อัปเดตทุก 1 วินาที

    // Cleanup interval เมื่อ component ถูก unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:flex my-4 text-lg justify-between">
      <DynamicBreadcrumbs />
      <h1 className="font-semibold py-3 mr-10">{currentTime} <FontAwesomeIcon icon={faClock} /></h1>
    </div>
  )
}
