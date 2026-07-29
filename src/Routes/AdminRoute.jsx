import useUserRole from '../Hooks/useUserRole';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';

const AdminRoute = ({ children }) => {
    const { role, roleLoading } = useUserRole();
    const { user, loading } = useAuth();

    if (loading || roleLoading) {
        return <LoadingSpinner />;
    }

    if (!user || role !== 'admin') {
        return <Navigate to="/forbidden" />;
    }

    return children;
};

export default AdminRoute;
