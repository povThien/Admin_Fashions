"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUserFromCookie } from "@/app/redux/authSlice";

export default function AppWrapper({ children }: { children: any }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      try {
        const user = JSON.parse(userCookie);
        // Kiểm tra vai_tro, chỉ lưu nếu là admin
        if (user.vai_tro === "admin") {
          dispatch(setUserFromCookie(user));
        } else {
          // Nếu không phải admin, xóa cookie
          Cookies.remove("user");
        }
      } catch (error) {
        console.error("Cookie parse failed", error);
        Cookies.remove("user"); // Xóa cookie nếu parse thất bại
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}