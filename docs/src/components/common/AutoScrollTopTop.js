import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function AutoScrollTopTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]); // Runs when the route changes

  return null;
}