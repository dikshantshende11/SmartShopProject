import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";

function MainLayout() {

  return (
    <>
      <Navbar />

      <Outlet />

      <Footer />

      <ScrollToTop />
    </>
  );
}

export default MainLayout;