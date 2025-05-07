import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../configs/axios-config";
import { toast } from "react-toastify";

export default function EditSettingPage() {

    const [ data, setData ] = useState([]);

    const { id } = useParams();

    let token = sessionStorage.getItem("token");

    const getData = useCallback( async () => {

        const toastLoading = toast.loading("กำลังโหลดข้อมูล...")

        try {
            const rs = await axios.get(`/system/view?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if(rs.status === 200){
                setData(rs.data.result)
                toast.update(toastLoading, {
                    render: rs.data.message,
                    type: "success",
                    isLoading: false,
                    closeOnClick: true,
                    autoClose: 2000,
                })
            }
        }catch(err){
            console.log(err)
        }finally{
            console.log("success!")
        }
    }, [token, id]);

    useEffect(() => {
        if (id && token) {
            getData();
        }
    }, [getData, id, token])

    console.log(id)
  return (
    <div>{JSON.stringify(data)}</div>
  )
}
