import moment from "moment/moment";
import AppHook from "../hooks/AppHook"
import "moment/locale/th"

moment.locale('th')

export default function Footer() {

  const { system } = AppHook();
  const year = moment(system?.create_at).format("YYYY");
  const yearUpdate = moment(system?.update_at).format("YYYY");
  const footer = system?.footer || "waiting for login page"
  const version = system?.version || "x.x.x"
  const updateAt = system?.update_at || new Date();

  return (
    <div className="sticky mx-auto left-0 right-0 bottom-0 opacity-60">
      <div className="fixed bottom-0 right-0 bg-white truncate">
      <div className="w-fit hidden md:flex justify-center items-center text-xs select-none">
        <p className="pl-3 h-6 pr-5 line-clamp-1">Copyright &copy; {year === yearUpdate ? `${year}` : `${year} - ${yearUpdate}` } {footer} | เวอร์ชั่น v {version} | อัพเดทล่าสุด {moment(updateAt).add(543, 'year').format("DD/MMM/YY")}</p>
      </div>
      </div>
    </div>
  )
}
