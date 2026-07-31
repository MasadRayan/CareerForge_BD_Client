import { AuthContext } from '../Context/AuthProvider';
import { Navigate, useLocation } from 'react-router';
import { use } from 'react';

const PrivateRoute = ({ children }) => {

    const { user, loading } = use(AuthContext);
    const location = useLocation();

    if (user)
        return children;

    if (loading)
        return <Loading />

    return <Navigate to="/signin" state={{ from: location }} replace />;
};

export default PrivateRoute;

export const Loading = () => {

    return (
        <>

            <div className='min-h-screen flex justify-center items-center'>
                <span className="loading loading-spinner loading-xl "></span>
            </div>
        </>
    );
};