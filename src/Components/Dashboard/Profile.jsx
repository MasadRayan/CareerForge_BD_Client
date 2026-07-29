import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthProvider';
import userIcon from '../../assets/user.png';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center mt-20 text-xl text-red-500">
        Please login to view your profile.
      </div>
    );
  }

  const handleUpdateProfile = () => {
    navigate('/updateprofile');
  };

  return (
    <div className="max-w-md mx-auto bg-gray-700 shadow-md p-6 mt-10 rounded-xl text-center">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-4">
        Welcome, {user.displayName || "User"}!
      </h2>

      <div className="flex justify-center mb-4">
        <img
          src={user.photoURL || userIcon}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
        />
      </div>

      <div className="text-left space-y-2">
        <p><strong>Name:</strong> {user.displayName || "Not provided"}</p>
        <p><strong>Email:</strong> {user.email || "Not provided"}</p>
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