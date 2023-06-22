//Thirdparty imports
import { Outlet } from 'react-router-dom';

//Project Importd
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <>
      <div className="page">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </>
  );
};

export default Layout;
