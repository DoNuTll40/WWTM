import AppHook from "../hooks/AppHook";

/* eslint-disable react/prop-types */
export default function Background({ children }) {

  const { system } = AppHook();

  const color = system?.color

  return <div className={`w-full min-h-screen bg-${color}-800 md:bg-white`}>
      {children} {/* ใช้ props.children */}
    </div>;
  }