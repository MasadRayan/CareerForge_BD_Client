import { useState, useContext } from "react";
import Registeri from "../../assets/SignUp.png";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, ImageIcon, ArrowRight } from "lucide-react";
import useAxios from "../../Hooks/useAxios";

const SignUp = () => {
  const { createUser, setUser, updateUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const [firebaseError, setFirebaseError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const passwordValue = watch("password");

  const handleRegister = (data) => {
    setFirebaseError("");

    const { name, photo, email, password } = data;

    createUser(email, password)
      .then((result) => {
        const user = result.user;

        updateUser({
          displayName: name,
          photoURL: photo,
        })
          .then(() => {
            setUser({
              ...user,
              displayName: name,
              photoURL: photo,
            });

            axiosInstance.post("/api/users/register", {
              name,
              email,
              photoURL: photo,
            });

            toast.success("Account created successfully!");
            reset();
            navigate("/");
          })
          .catch((error) => {
            console.error(error);
            setUser(user);
            toast.success("Account created, but profile update failed.");
            navigate("/");
          });
      })
      .catch((error) => {
        const errorMessage = error.message || "Registration failed";

        if (errorMessage.includes("auth/email-already-in-use")) {
          toast.error("This email is already registered.");
        } else if (errorMessage.includes("auth/invalid-email")) {
          toast.error("Invalid email address.");
        } else if (errorMessage.includes("auth/weak-password")) {
          toast.error("Password is too weak.");
        } else {
          toast.error(errorMessage);
        }

        setFirebaseError(errorMessage);
      });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-br from-slate-50 via-white to-blue-50 px-4 py-10 sm:px-6 lg:px-8">
      {/* background blur */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-violet-200/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block"
        >
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-3xl bg-blue-500/10 blur-2xl" />
            <div className="absolute -bottom-6 right-0 h-28 w-28 rounded-3xl bg-violet-500/10 blur-2xl" />

            <div className="rounded-4xl border border-white/60 bg-white/70 p-5 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <img
                src={Registeri}
                alt="Register Illustration"
                className="w-full rounded-3xl object-cover"
              />
            </div>

            <div className="mt-5 max-w-lg">
              <p className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                Join CareerForge BD
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Start your career journey with a smarter AI-powered platform
              </h2>
              <p className="mt-3 leading-7 text-slate-600">
                Create your account to unlock ATS CV analysis, personalized career
                roadmaps, interview preparation, and more — all in one place.
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE FORM */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto w-full max-w-xl"
        >
          <div className="rounded-4xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8">
            {/* heading */}
            <div className="mb-6 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Register your account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Create your account and start building your future with confidence.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleRegister)} className="space-y-5">
              {/* Firebase Error */}
              {firebaseError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {firebaseError}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>
                <div
                  className={`flex items-center rounded-2xl border bg-white px-4 transition ${
                    errors.name
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-slate-200"
                  }`}
                >
                  <User className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent px-3 py-3 text-slate-800 outline-none placeholder:text-slate-400"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 5,
                        message: "Name should be at least 5 characters",
                      },
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Photo URL */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Photo URL
                </label>
                <div
                  className={`flex items-center rounded-2xl border bg-white px-4 transition ${
                    errors.photo
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-slate-200"
                  }`}
                >
                  <ImageIcon className="h-5 w-5 text-slate-400" />
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    className="w-full bg-transparent px-3 py-3 text-slate-800 outline-none placeholder:text-slate-400"
                    {...register("photo", {
                      required: "Photo URL is required",
                      pattern: {
                        value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i,
                        message: "Please enter a valid image URL",
                      },
                    })}
                  />
                </div>
                {errors.photo && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.photo.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>
                <div
                  className={`flex items-center rounded-2xl border bg-white px-4 transition ${
                    errors.email
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-slate-200"
                  }`}
                >
                  <Mail className="h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent px-3 py-3 text-slate-800 outline-none placeholder:text-slate-400"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+\.\S+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div
                  className={`flex items-center rounded-2xl border bg-white px-4 transition ${
                    errors.password
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-slate-200"
                  }`}
                >
                  <Lock className="h-5 w-5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full bg-transparent px-3 py-3 text-slate-800 outline-none placeholder:text-slate-400"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                      validate: {
                        hasUppercase: (value) =>
                          /[A-Z]/.test(value) ||
                          "Password must contain at least one uppercase letter",
                        hasLowercase: (value) =>
                          /[a-z]/.test(value) ||
                          "Password must contain at least one lowercase letter",
                      },
                    })}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Confirm Password
                </label>
                <div
                  className={`flex items-center rounded-2xl border bg-white px-4 transition ${
                    errors.confirmPassword
                      ? "border-red-400 ring-2 ring-red-100"
                      : "border-slate-200"
                  }`}
                >
                  <Lock className="h-5 w-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="w-full bg-transparent px-3 py-3 text-slate-800 outline-none placeholder:text-slate-400"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === passwordValue || "Passwords do not match",
                    })}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="text-slate-500 transition hover:text-slate-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm font-medium text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating account..." : "Register"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>

              {/* Login Link */}
              <p className="pt-1 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                  to="/signin"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SignUp;