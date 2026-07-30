import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

export default function useUserRole() {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const query = useQuery({
        queryKey: ['userRole', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/api/users/me/${user.email}`);
            return response.data.data.role || 'user';
        },
        enabled: !!user?.email && !authLoading,
    });

    return {
        role: query.data || 'user',
        roleLoading: authLoading || query.isPending,
        error: query.error,
    };
}
