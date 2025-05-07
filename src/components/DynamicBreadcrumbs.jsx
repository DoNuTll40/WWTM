import { Breadcrumbs, Typography } from '@material-tailwind/react';
import { useLocation, Link as RouterLink } from 'react-router-dom';

export function DynamicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // ตรวจสอบว่า path ปัจจุบันคือ root ("/") หรือ home ("/home")
  const isHome = location.pathname === '/' || location.pathname === '/home';

  return (
    <Breadcrumbs className='h-11 ml-8 select-none hidden md:flex'>
      {/* แสดง "Home" เป็นลิงก์แรกเสมอ */}
      <RouterLink to="/" className="opacity-60">
        home
      </RouterLink>

      {/* หากเป็นหน้า home ไม่ต้องแสดง path อื่น */}
      {!isHome &&
        pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          return last ? (
            <Typography key={to}>{value}</Typography>
          ) : (
            <RouterLink to={to} key={to} className="opacity-60">
              {value}
            </RouterLink>
          );
        })}
    </Breadcrumbs>
  );
}