import useUserRole from '../Hooks/useUserRole';
import useAuth from '../Hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../Components/LoadingSpinner/LoadingSpinner';

const UserRoute = ({ children }) => {
    const { role, roleLoading } = useUserRole();
    const { user, loading } = useAuth();

    if (loading || roleLoading) {
        return <LoadingSpinner />;
    }

    if (!user || (role !== 'free_user' && role !== 'premium_user')) {
        return <Navigate to="/forbidden" />;
    }

    return children;
};

export default UserRoute;
