
import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const data = {
      email: formData.email,
      password: formData.password,
    };

    const response = await axios.post("/api/user/login", data);

    localStorage.setItem("userInfo", JSON.stringify(response.data));

    toast.success(response.data.message);

    navigate("/chats");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Something went wrong"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.35,
      }}
      className="space-y-4"
    >

      {/* =========================================
                         EMAIL
      ========================================== */}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Email Address
        </label>

        <div className="relative group">

          <Mail
            size={16}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-600
              group-focus-within:text-blue-500
              transition-colors
            "
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="
              w-full
              pl-10
              pr-4
              py-2.5
              bg-gray-950/70
              border
              border-gray-800
              rounded-xl
              text-sm
              text-white
              placeholder-gray-600
              outline-none
              transition-all
              hover:border-gray-700
              focus:border-blue-500/60
              focus:ring-2
              focus:ring-blue-500/10
            "
          />

        </div>
      </div>

      {/* =========================================
                       PASSWORD
      ========================================== */}

      <div>
        <div className="flex items-center justify-between mb-1.5">

          <label className="block text-xs font-medium text-gray-400">
            Password
          </label>

        </div>

        <div className="relative group">

          <Lock
            size={16}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-600
              group-focus-within:text-blue-500
              transition-colors
            "
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            className="
              w-full
              pl-10
              pr-11
              py-2.5
              bg-gray-950/70
              border
              border-gray-800
              rounded-xl
              text-sm
              text-white
              placeholder-gray-600
              outline-none
              transition-all
              hover:border-gray-700
              focus:border-blue-500/60
              focus:ring-2
              focus:ring-blue-500/10
            "
          />

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              text-gray-600
              hover:text-gray-300
              transition-colors
            "
          >
            {showPassword ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </motion.button>

        </div>
      </div>


      {/* =========================================
                         LOGIN
      ========================================== */}

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{
          scale: loading ? 1 : 1.01,
        }}
        whileTap={{
          scale: loading ? 1 : 0.98,
        }}
        className="
          relative
          w-full
          py-2.5
          mt-2
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          text-white
          text-sm
          font-semibold
          shadow-[0_8px_25px_rgba(37,99,235,0.2)]
          hover:shadow-[0_8px_35px_rgba(37,99,235,0.35)]
          transition-shadow
          disabled:opacity-70
          disabled:cursor-not-allowed
        "
      >

        <span className="flex items-center justify-center gap-2">

          {loading ? (
            <>
              <Loader2
                size={15}
                className="animate-spin"
              />

              Signing in...
            </>
          ) : (
            <>
              Login

              <motion.span
                animate={{
                  x: [0, 3, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <ArrowRight size={15} />
              </motion.span>
            </>
          )}

        </span>

      </motion.button>

      {/* =========================================
                         SECURITY
      ========================================== */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="
          flex
          items-center
          justify-center
          gap-1.5
          pt-1
          text-[10px]
          text-gray-700
        "
      >
        <Lock size={10} />

        <span>
          Your login is protected
        </span>
      </motion.div>

    </motion.form>
  );
};

export default Login;