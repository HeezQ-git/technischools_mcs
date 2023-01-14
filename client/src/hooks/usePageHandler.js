import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const usePageHandler = () => {
  const location = useLocation();
  const [page, setPage] = useState("");
  const getCurrentPage = () => {
    const path = location.pathname.split("/dashboard/")[1];
    if (path) {
      const page = path.split("/")[0];
      setPage(page);
    }
    if (location.pathname === "/") {
      setPage("home");
    }
  };
  useEffect(() => {
    getCurrentPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return { currentPage: page, getCurrentPage };
};
