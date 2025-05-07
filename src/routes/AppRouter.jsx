import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Background from "../components/Background";
import HeaderMobile from "../components/HeaderMobile";
import HeaderPC from "../components/HeaderPC";
import HomeBar from "../components/HomeBar";
import UserHook from "../hooks/UserHook";
import LoadingBar from "../components/LoadingBar";
import SideBar from "../components/SideBar";
import SidebarHook from "../hooks/SidebarHook";
import RealClock from "../components/RealClock";
import Footer from "../components/Footer";

// Lazy-loaded Pages
import SettingMainPages from "../pages/admin/SettingMainPages";
import UpUsersPage from "../pages/admin/UpUsersPage";
import FaceDetection from "../pages/Camera";
import Geolocation from "../pages/Geolocation";
const HomePage = lazy(() => import("../pages/HomePage"));
const RecordPage = lazy(() => import("../pages/RecordPage"));
const ChartPage = lazy(() => import("../pages/ChartPage"));
const LoginPages = lazy(() => import("../pages/LoginPages"));
const RecordEditPage = lazy(() => import("../pages/RecordEditPage"))
const NotFound = lazy(() => import("../pages/NotFound"));
const LogoutPage = lazy(() => import("../pages/LogoutPage"));
const UsersPage = lazy(() => import("../pages/admin/UsersPage"))
const SettingPage = lazy(() => import("../pages/admin/SettingPage"));
const EditSettingPage = lazy(() => import("../pages/admin/EditSettingPage"))

// Layout Component สำหรับจัดการส่วนรวม (Header, Sidebar)
function MainLayout() {
  const { isOpen, isMini } = SidebarHook();

  return (
    <Background>
      {/* Header Mobile No SideBar */}
      <HeaderMobile />
      
      {/* Main Layout */}
      <div className="flex">
        <SideBar />
        <div className={`flex-1 transition-all duration-100 ease-in-out ${isOpen ? (isMini ? "md:ml-14" : "md:ml-64") : "ml-0"}`}>
          <HeaderPC />
          {/* <DynamicBreadcrumbs /> */}
          <RealClock />
          <Outlet />
          <Footer />
        </div>
      </div>
      
      {/* Footer or Bottom Bar */}
      <HomeBar />
    </Background>
  );
}

// Guest Router
const guestRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingBar />}>
        <Outlet />
      </Suspense>
    ),
    children: [
      { index: true, element: <LoginPages /> },
      { path: "login", element: <LoginPages /> },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingBar />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

// Users Router
const usersRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingBar />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "login", element: <LoginPages /> },
      { path: "record", element: <RecordPage /> },
      { path: "record/*", element: <RecordEditPage /> },
      // { path: "users", element: <UsersPage /> },
      { path: "chart", element: <ChartPage /> },
      // { path: "setting", element: <SettingPage /> },
      { path: "logout", element: <LogoutPage /> },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingBar />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

const inspec = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingBar />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "login", element: <LoginPages /> },
      { path: "chart", element: <ChartPage /> },
    ]
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingBar />}>
        <NotFound />
      </Suspense>
    ),
  },
])

// Admin Router
const adminRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<LoadingBar />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: "home", element: <HomePage /> },
      { path: "login", element: <LoginPages /> },
      { path: "record", element: <RecordPage /> },
      { path: "record/*", element: <RecordEditPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "chart", element: <ChartPage /> },
      { path: "setting", element: <SettingMainPages /> },
      { path: "setting/users", element: <UpUsersPage /> },
      { path: "setting/preferences", element: <SettingPage /> },
      { path: "setting/preferences/:id", element: <EditSettingPage /> },
      { path: "logout", element: <LogoutPage /> },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<LoadingBar />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

// App Router
export default function AppRouter() {
  const { user } = UserHook();
  const finalRouter = user?.id_ofw ? user?.status === "ADMIN" ? adminRouter  : user?.ofw_department_sub_sub_id === 43 ? inspec : usersRouter : guestRouter;

  return <RouterProvider router={finalRouter} />;
}
