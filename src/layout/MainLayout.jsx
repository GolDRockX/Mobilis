import { Outlet, useLocation } from "react-router-dom";
import RelatedServices from "../components/Common/RelatedServices/RelatedServices";

function MainLayout() {
  const location = useLocation();

  // homepage should NOT show related services
  const isHome = location.pathname === "/";

  return (
    <>

      <main>
        <Outlet />
      </main>

      {!isHome && <RelatedServices />}

    </>
  );
}

export default MainLayout;
