import { Outlet } from "react-router-dom";
import { LeftSideBar } from "../Components/leftSideBar";




export function Layout() {
  return (
    <>
      <LeftSideBar />
      <Outlet />
    </>
  )
}