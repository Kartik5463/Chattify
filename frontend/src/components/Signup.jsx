import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Upload,
  Check,
  Loader2,
} from "lucide-react";
import uploadToCloudinary from "../config/uploadToCloudinary";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const getPasswordStrength = () => {
    const password = formData.password;

    if (!password) return 0;
    if (password.length < 6) return 1;
    if (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    ) {
      return 3;
    }

    return 2;
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    try {
      setLoading(true);

      let imageUrl;

      // Upload image first
      if (formData.pic) {
        imageUrl = await uploadToCloudinary(formData.pic);
      }
      const data = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      // Add pic only if user uploaded one
      if (imageUrl) {
        data.pic = imageUrl;
      }

      const response = await axios.post("/api/user", data);
      localStorage.setItem("userInfo",JSON.stringify(response.data));
      toast.success(response.data.message);
      navigate('/chats');
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3.5"
    >
      {/* =================================================
                         NAME
      ================================================= */}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Full Name
        </label>

        <div className="relative group">
          <User
            size={16}
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              text-gray-600
              group-focus-within:text-blue-500
              transition-colors
            "
          />

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="
              w-full
              pl-10 pr-4 py-2.5
              bg-gray-950/70
              border border-gray-800
              rounded-xl
              text-sm text-white
              placeholder-gray-600
              outline-none
              transition-all
              focus:border-blue-500/60
              focus:ring-2
              focus:ring-blue-500/10
              hover:border-gray-700
            "
          />
        </div>
      </div>

      {/* =================================================
                         EMAIL
      ================================================= */}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Email Address
        </label>

        <div className="relative group">
          <Mail
            size={16}
            className="
              absolute left-3 top-1/2 -translate-y-1/2
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
            autoComplete="email"
            required
            className="
              w-full
              pl-10 pr-4 py-2.5
              bg-gray-950/70
              border border-gray-800
              rounded-xl
              text-sm text-white
              placeholder-gray-600
              outline-none
              transition-all
              focus:border-blue-500/60
              focus:ring-2
              focus:ring-blue-500/10
              hover:border-gray-700
            "
          />
        </div>
      </div>

      {/* =================================================
                        PASSWORD
      ================================================= */}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Password
        </label>

        <div className="relative group">
          <Lock
            size={16}
            className="
              absolute left-3 top-1/2 -translate-y-1/2
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
            placeholder="Create a password"
            autoComplete="new-password"
            required
            className="
              w-full
              pl-10 pr-11 py-2.5
              bg-gray-950/70
              border border-gray-800
              rounded-xl
              text-sm text-white
              placeholder-gray-600
              outline-none
              transition-all
              focus:border-blue-500/60
              focus:ring-2
              focus:ring-blue-500/10
              hover:border-gray-700
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-3 top-1/2
              -translate-y-1/2
              text-gray-600
              hover:text-gray-300
              transition
            "
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {/* Password strength */}
        {formData.password && (
          <div className="mt-1.5">
            <div className="flex gap-1">
              {[1, 2, 3].map((level) => (
                <motion.div
                  key={level}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className={`h-1 flex-1 rounded-full ${
                    level <= strength ? "bg-blue-500" : "bg-gray-800"
                  }`}
                />
              ))}
            </div>

            <p className="text-[10px] text-gray-600 mt-1">
              {strength === 1
                ? "Weak password"
                : strength === 2
                  ? "Good password"
                  : "Strong password"}
            </p>
          </div>
        )}
      </div>

      {/* =================================================
                    CONFIRM PASSWORD
      ================================================= */}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Confirm Password
        </label>

        <div className="relative group">
          <Lock
            size={16}
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              text-gray-600
              group-focus-within:text-blue-500
              transition-colors
            "
          />

          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            autoComplete="new-password"
            required
            className="
              w-full
              pl-10 pr-11 py-2.5
              bg-gray-950/70
              border border-gray-800
              rounded-xl
              text-sm text-white
              placeholder-gray-600
              outline-none
              transition-all
              focus:border-blue-500/60
              focus:ring-2
              focus:ring-blue-500/10
              hover:border-gray-700
            "
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="
              absolute right-3 top-1/2
              -translate-y-1/2
              text-gray-600
              hover:text-gray-300
              transition
            "
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {formData.confirmPassword && (
          <p
            className={`text-[10px] mt-1 ${
              formData.password === formData.confirmPassword
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {formData.password === formData.confirmPassword
              ? "Passwords match"
              : "Passwords do not match"}
          </p>
        )}
      </div>

      {/* =================================================
                       PROFILE PICTURE
      ================================================= */}

      <div>
        <label className="block text-xs font-medium text-gray-400 mb-1.5">
          Profile Picture
          <span className="text-gray-700 ml-1">(optional)</span>
        </label>

        <label
          className="
            flex items-center gap-3
            w-full
            px-3 py-2.5
            rounded-xl
            border border-dashed
            border-gray-800
            bg-gray-950/40
            cursor-pointer
            hover:border-blue-500/40
            hover:bg-blue-500/[0.02]
            transition-all
          "
        >
          <div
            className="
              w-9 h-9
              rounded-lg
              bg-gray-900
              border border-gray-800
              flex items-center justify-center
              text-gray-500
            "
          >
            {formData.pic ? (
              <Check size={17} className="text-green-500" />
            ) : (
              <Camera size={17} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-300 truncate">
              {formData.pic ? formData.pic.name : "Upload your picture"}
            </p>

            <p className="text-[10px] text-gray-600">JPG, PNG or WEBP</p>
          </div>

          <Upload size={15} className="text-gray-600" />

          <input
            type="file"
            name="pic"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
      </div>

      {/* =================================================
                       SUBMIT
      ================================================= */}

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
          mt-1
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
              <Loader2 size={15} className="animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <SparkleArrow />
            </>
          )}
        </span>
      </motion.button>
    </motion.form>
  );
};

const SparkleArrow = () => {
  return (
    <motion.span
      animate={{
        x: [0, 3, 0],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
      }}
    >
      →
    </motion.span>
  );
};

export default Signup;
