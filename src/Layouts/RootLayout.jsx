import { Outlet } from 'react-router-dom';
import Navbar from '../Pages/Home/Navbar'
import Footer from '../Pages/Home/Footer';

const RootLayout = () => {
    return (
            <div className="min-h-screen bg-[#f8fafc] text-slate-900 transition-colors duration-300 dark:bg-[#050816] dark:text-white">

            <Navbar></Navbar>
            <div>
                <Outlet></Outlet>
            </div>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;