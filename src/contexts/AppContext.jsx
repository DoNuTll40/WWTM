/* eslint-disable react/prop-types */
import axios from "../configs/axios-config";
import { createContext, useEffect, useState } from "react";
import UserHook from "../hooks/UserHook";

const AppContext = createContext();

function AppContextProvider(props) {
  // const [position, setPosition] = useState(null);
  // const [error, setError] = useState("");
  const [system, setSystem] = useState(null)
  const { user } = UserHook();
  
  useEffect(() => {
    let type_web = user ? user?.status === "USER" ? user?.ofw_department_sub_sub_id === 43 ? "INSPAC" : "WWTM" : "ADMIN" : ""

    // if ("geolocation" in navigator) {
    //   navigator.geolocation.getCurrentPosition(
    //     (pos) => {
    //       const { latitude, longitude } = pos.coords;
    //       setPosition({ latitude, longitude });
    //     },
    //     (err) => {
    //       setError(`Error: ${err.message}`);
    //     },
    //     {
    //       enableHighAccuracy: true, // ใช้ตำแหน่งที่แม่นยำ (ถ้ามี)
    //       timeout: 10000, // รอข้อมูลไม่เกิน 10 วินาที
    //       maximumAge: 0, // ห้ามใช้ตำแหน่งเก่าที่แคชไว้
    //     }
    //   );
    // } else {
    //   setError("Geolocation is not supported by this browser.");
    // }

    const getSystem = async () => {
      try {
        const rs = await axios.get(`/system/list/view?webtype=${type_web}`)
        setSystem(rs.data.result)
      }catch(err){
        console.log(err)
      }
    }

    if(user){
      getSystem();
    }
    
  }, [user]);

  const value = { system };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export { AppContextProvider };
export default AppContext;
