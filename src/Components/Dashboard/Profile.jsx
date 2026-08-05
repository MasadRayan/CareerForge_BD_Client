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
    <div className="max-w-md mx-auto bg-base-200 shadow-xl p-6 mt-10 rounded-2xl border border-base-300">
      <h2 className="text-3xl font-bold text-primary text-center mb-5">
        Welcome, {displayName}!
      </h2>

      <div className="flex justify-center mb-5">
        <img
          src={displayPhoto}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-4 border-primary shadow-md"
        />
      </div>

      <div className="space-y-3 text-base-content">
        <p className="bg-base-300 p-3 rounded-lg">
          <strong>Name:</strong> {displayName}
        </p>
        <p className="bg-base-300 p-3 rounded-lg">
          <strong>Email:</strong> {displayEmail}
        </p>
        <p className="bg-base-300 p-3 rounded-lg">
          <strong>Role:</strong> {profile?.role || "free_user"}
        </p>
        <p className="bg-base-300 p-3 rounded-lg">
          <strong>Target Role:</strong> {profile?.target_role || "Not set"}
        </p>
        <p className="bg-base-300 p-3 rounded-lg">
          <strong>Experience Level:</strong> {profile?.experience_level || "Not set"}
        </p>
        <div className="bg-base-300 p-3 rounded-lg">
          <p className="mb-2"><strong>Skills:</strong></p>
          {profile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span key={index} className="badge badge-primary badge-outline">
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-base-content/60">Not set</p>
          )}
        </div>
      </div>
      <button
        onClick={handleUpdateProfile}
        className="mt-6 btn btn-primary w-full rounded-xl"
      >
        Update Profile
      </button>
    </div>
  );
};

export default Profile;