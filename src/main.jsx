// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "@material-tailwind/react";
import { AppContextProvider } from "./contexts/AppContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { UserContextProvider } from "./contexts/UserContext.jsx";
import { SidebarContextProvider } from "./contexts/SidebarContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <UserContextProvider>
    <AppContextProvider>
      <SidebarContextProvider>
        <ToastContainer className={"select-none"} closeOnClick={true} theme="colored"/>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </SidebarContextProvider>
    </AppContextProvider>
  </UserContextProvider>
  // </StrictMode>
);
