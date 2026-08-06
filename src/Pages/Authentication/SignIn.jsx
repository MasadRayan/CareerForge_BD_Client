import { useContext, useState } from "react";
import google from "../../assets/google.png";
import github from "../../assets/github.png";
import login from "../../assets/login-illustration.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthProvider";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import useAxios from "../../Hooks/useAxios";
import { useTheme } from "../../Context/ThemeProvider";

const SignIn = () => {
  const [firebaseError, setFirebaseError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, googleSignIn, gitHubSignIn, loading } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const axiosInstance = useAxios();
  const { theme } = useTheme();
  const dark = theme === "dark";
  const { 
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const emailValue = watch("email");

  const goToForget = () => {
    navigate("/forgetpassword", { state: { email: emailValue || "" } });
  };

  const handleLogin = (data) => {
    setFirebaseError("");
    const { email, password } = data;
    signIn(email, password)
      .then(() => {
        toast.success("Login successful!");
        navigate(location.state?.from?.pathname || "/");
      })
      .catch((error) => {
        const errorMessage = error.message || "Login failed";

        if (errorMessage.includes("auth/wrong-password")) {
          toast.error("Incorrect password. Try again or use 'Forgot password'.");
        } else if (errorMessage.includes("auth/user-not-found")) {
          toast.error("No user found with this email.");
        } else if (errorMessage.includes("auth/invalid-credential")) {
          toast.error("Invalid email or password.");
        } else {
          toast.error(errorMessage);
        }

        setFirebaseError(errorMessage);
      });
  };

  const handleGoogleSignIn = () => {
    setFirebaseError("");
    googleSignIn()
      .then(async (result) => {
        const { displayName, email, photoURL } = result.user;
        await axiosInstance.post("/api/users/register", {
          name: displayName || "User",
          email,
          photoURL: photoURL || "",
        });

        toast.success("Logged in with Google!");
        navigate(location.state?.from?.pathname || "/");
      })
      .catch((error) => {
        setFirebaseError(error.message);
        toast.error(error.message);
      });
  };

  const handleGithubSignIn = () => {
    setFirebaseError("");
    gitHubSignIn()
      .then(async (result) => {
        const { displayName, email, photoURL } = result.user;
        await axiosInstance.post("/api/users/register", {
          name: displayName || "User",
          email,
          photoURL: photoURL || "",
        });

        toast.success("Logged in with GitHub!");
        navigate(location.state?.from?.pathname || "/");
      })
      .catch((error) => {
        setFirebaseError(error.message);
        toast.error(error.message);
      });
  };

  return (
    <section className={`relative min-h-screen px-4 py-10 transition border border-red-700 duration-500 ${dark?"bg-[#050816]":"bg-gradient-to-br from-slate-50 via-white to-blue-50"}`}>
      
      <div className="relative mx-auto grid max-w-7xl border border-amber-600 grid-cols-1 items-center gap-8 lg:grid-cols-2">

        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="hidden lg:block"
        >
          <div className="relative border border-amber-300 mx-auto max-w-xl">
             <div className="mt-5 max-w-lg">
            <p className="inline-flex items-center rounded-full border border-[#10B981]/20 bg-[#0F172A] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#10B981]">
          Welcome back
        </p>
            <h2 className={`mt-3 text-3xl font-bold tracking-tight mb-4 ${dark?"text-white":"text-slate-900"}
            `}>
                Continue building your dream career with CareerForge BD
              </h2>
            </div>
            <div className="absolute -top-6 -left-6 h-24 w-24 rounded-3xl bg-blue-500/10 blur-2xl" />
            <div className="absolute -bottom-6 right-0 h-28 w-28 rounded-3xl bg-violet-500/10 blur-2xl" />
          <div className={`rounded-4xl border p-5 shadow-xl backdrop-blur-xl ${ dark  ?"border-slate-700 bg-slate-900/70" :"border-white/60 bg-white/70"  }
          `}
          >
              <img
                src={login}
                alt="Login Illustration"
               className={`w-full rounded-3xl transition duration-500 ${ dark ? "brightness-45" : "brightness-100"}`}
        />
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE FORM */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto w-full max-w-xl">
         <div className={` rounded-4xl border p-6 shadow-xl backdrop-blur-2xl sm:p-8 ${ dark ?"border-slate-700 bg-slate-900/70" :"border-white/70 bg-white/80" }
    `}
    >
            {/* heading */}
            <div className="mb-6 text-center">
              <h1 className={`text-3xl font-bold tracking-tight ${dark?"text-white":"text-slate-900"}`}>
                Login to your account
              </h1>
              <p className={`mt-2 text-sm ${dark?"text-white" : "text-slate-500"}`}>
                Welcome back! Please enter your credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
              {/* Firebase error */}
              {firebaseError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {firebaseError}
                </div>
              )}

              {/* Email */}
            <div>
            <label className={`mb-1 block text-sm font-semibold ${ dark ? "text-slate-200" : "text-slate-700"
              }`}
            >
            Email Address
            </label>
        <div className={`flex items-center rounded-2xl border px-4 transition ${errors.email ? "border-red-400 ring-2 ring-red-100": dark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-white"
    }`}
  >
    <Mail className={`h-5 w-5 ${dark ? "text-slate-500" : "text-slate-400"}`} />
    <input
      type="email"
      placeholder="Enter your email"
      className={`w-full rounded-2xl bg-transparent px-3 py-3 outline-none placeholder:text-slate-400 ${
        dark ? "text-white" : "text-slate-800"
      }`}
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
        <label className={`mb-2 block text-sm font-semibold ${ dark ? "text-slate-200" : "text-slate-700"
          }`}
        >
        Password
        </label>
      <div className={`flex items-center rounded-2xl border px-4 transition ${ errors.password ? "border-red-400 ring-2 ring-red-100" : dark ? "border-slate-700 bg-slate-800"  : "border-slate-200 bg-white"
    }`}
   >
    <Lock className={`h-5 w-5 ${dark ? "text-slate-500" : "text-slate-400"}`} />
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      className={`w-full bg-transparent px-3 py-3 outline-none placeholder:text-slate-400 ${
        dark ? "text-white" : "text-slate-800"
      }`}
      {...register("password", {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
      })}
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className={`transition ${
        dark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {showPassword ? (
        <EyeOff className="h-5 w-5" /> ) : (
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
       {/* forgot password */}
        <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={goToForget}
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && (
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>

              {/* register */}
              <p className="pt-1 text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  className="font-semibold text-blue-600 transition hover:text-blue-700"
                  to="/signup"
                >
                  Register
                </Link>
              </p>

              {/* divider */}
             <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <div className={`w-full border-t ${ dark ? "border-slate-700" : "border-slate-200"
              }`}
            />
          </div>
          <div className="relative flex justify-center">
            <span
              className={`px-4 text-sm ${
                dark
                  ? "bg-[#050816] text-slate-400"
                  : "bg-white text-slate-500"
              }`}
            >
              Or continue with
            </span>
        </div>
      </div>

              {/* social login */}
             <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className={`flex items-center justify-center gap-3 rounded-2xl border px-4 py-3 font-medium shadow-sm transition hover:-translate-y-0.5 ${
            dark
              ? "border-slate-700 bg-slate-800 text-white hover:border-slate-600 hover:bg-slate-700"
              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
        <img src={google} alt="Google" className="h-5 w-5" />
        <span>Google</span>
      </button>

      <button
        type="button"
        onClick={handleGithubSignIn}
        className={`flex items-center justify-center gap-3 rounded-2xl border px-4 py-3 font-medium shadow-sm transition hover:-translate-y-0.5 ${
          dark
            ? "border-slate-700 bg-slate-800 text-white hover:border-slate-600 hover:bg-slate-700"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        }`}
        >
          <img src={github} alt="GitHub" className="h-5 w-5" />
          <span>GitHub</span>
         </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default SignIn;