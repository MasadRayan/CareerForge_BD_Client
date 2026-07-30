import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthProvider';
import userIcon from '../../assets/user.png';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get(`/api/users/me/${user.email}`)
      .then((res) => {
        if (res.data.success) {
          setProfile(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch profile:", err);
      })
      .finally(() => setLoadingProfile(false));
  }, [user?.email, axiosSecure]);

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        Please login to view your profile.
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="text-center mt-20 text-xl text-base-content/60">
        Loading profile...
      </div>
    );
  }

  const handleUpdateProfile = () => {
    navigate('/dashboard/updateprofile');
  };

  const displayName = profile?.name || user?.displayName || "User";
  const displayPhoto = profile?.photoURL || user?.photoURL || userIcon;
  const displayEmail = profile?.email || user?.email || "Not provided";

  return (
    <div className="max-w-md mx-auto bg-base-300 shadow-md p-6 mt-10 rounded-xl text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
        Welcome, {displayName}!
      </h2>

      <div className="flex justify-center mb-4">
        <img
          src={displayPhoto}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-primary"
        />
      </div>

      <div className="text-left space-y-2 text-base-content">
        <p><strong>Name:</strong> {displayName}</p>
        <p><strong>Email:</strong> {displayEmail}</p>
        <p><strong>Role:</strong> {profile?.role || "free_user"}</p>
        <p><strong>Target Role:</strong> {profile?.target_role || "Not set"}</p>
        <p><strong>Experience Level:</strong> {profile?.experience_level || "Not set"}</p>
      </div>

      <button
        onClick={handleUpdateProfile}
        className="mt-6 btn btn-primary w-full sm:w-auto"
      >
        Update Profile
      </button>
    </div>
  );
};

export default Profile;
