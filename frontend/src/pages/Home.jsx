
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Zap,
  Users,
  Heart,
} from "lucide-react";

import Login from "../components/Login";
import Signup from "../components/Signup";

const floatingMessages = [
  {
    text: "Hey!",
    x: "7%",
    y: "22%",
    rotate: -8,
    delay: 0,
  },
  {
    text: "What's up?",
    x: "82%",
    y: "18%",
    rotate: 7,
    delay: 1.5,
  },
  {
    text: "Let's chat",
    x: "5%",
    y: "68%",
    rotate: 6,
    delay: 2,
  },
  {
    text: "Hey there!",
    x: "84%",
    y: "70%",
    rotate: -6,
    delay: 0.8,
  },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] flex items-center justify-center p-4">

      {/* =====================================================
                         BACKGROUND GLOWS
      ====================================================== */}

      <motion.div
        className="absolute -top-[35%] -left-[15%] w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-[160px]"
        animate={{
          x: [0, 250, 100, 0],
          y: [0, 150, -50, 0],
          scale: [1, 1.3, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-[35%] -right-[15%] w-[700px] h-[700px] rounded-full bg-indigo-600/20 blur-[160px]"
        animate={{
          x: [0, -200, -50, 0],
          y: [0, -150, 50, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Center glow */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[130px]"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
        }}
      />

      {/* =====================================================
                           GRID
      ====================================================== */}

      <div
        className="
          absolute inset-0
          opacity-[0.035]
          bg-[linear-gradient(rgba(59,130,246,1)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,1)_1px,transparent_1px)]
          bg-[size:65px_65px]
        "
      />

      {/* =====================================================
                        NETWORK LINES
      ====================================================== */}

      <svg
        className="absolute inset-0 w-full h-full opacity-[0.13]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M0 180 C250 80 400 400 650 230 S1100 100 1500 280"
          fill="none"
          stroke="currentColor"
          className="text-blue-500"
          strokeWidth="1"
          strokeDasharray="8 14"
          animate={{
            strokeDashoffset: [0, -200],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        <motion.path
          d="M-100 680 C200 500 400 750 700 600 S1100 450 1600 700"
          fill="none"
          stroke="currentColor"
          className="text-indigo-500"
          strokeWidth="1"
          strokeDasharray="5 18"
          animate={{
            strokeDashoffset: [0, 250],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </svg>

      {/* =====================================================
                       FLOATING CHAT BUBBLES
      ====================================================== */}

      {floatingMessages.map((item, index) => (
        <motion.div
          key={index}
          className="
            absolute hidden lg:flex
            items-center gap-2
            px-4 py-2.5
            rounded-2xl
            bg-gray-900/50
            border border-blue-500/10
            backdrop-blur-md
            text-gray-400
            text-sm
            shadow-2xl
          "
          style={{
            left: item.x,
            top: item.y,
            rotate: item.rotate,
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [
              item.rotate,
              item.rotate + 3,
              item.rotate,
            ],
            opacity: [0.35, 0.8, 0.35],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: item.delay,
            ease: "easeInOut",
          }}
        >
          <MessageCircle
            size={14}
            className="text-blue-500"
          />

          {item.text}
        </motion.div>
      ))}

      {/* =====================================================
                           PARTICLES
      ====================================================== */}

      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] h-[2px] rounded-full bg-blue-400/50"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* =====================================================
                            CENTER
      ====================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 25,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-[360px]"
      >

        {/* Small brand */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center mb-5"
        >

          <motion.div
            className="
              w-12 h-12
              rounded-2xl
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              flex items-center justify-center
              shadow-[0_10px_35px_rgba(37,99,235,0.3)]
            "
            animate={{
              y: [0, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          >
            <MessageCircle size={23} />
          </motion.div>

          <h1 className="text-2xl font-bold text-white mt-3">
            Chatt<span className="text-blue-500">ify</span>
          </h1>

          <p className="text-gray-600 text-xs mt-1">
            Connect. Chat. Share.
          </p>

        </motion.div>

        {/* =================================================
                           SMALL CARD
        ================================================== */}

        <motion.div
          className="relative"
          whileHover={{ y: -2 }}
        >

          {/* Glow behind card */}
          <motion.div
            className="
              absolute
              -inset-2
              rounded-[25px]
              bg-blue-500/10
              blur-xl
            "
            animate={{
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
          />

          <div
            className="
              relative
              bg-gray-900/75
              backdrop-blur-2xl
              border border-gray-800
              rounded-[22px]
              p-2
              shadow-[0_25px_70px_rgba(0,0,0,0.65)]
            "
          >

            {/* =================================================
                              TABS
            ================================================== */}

            <div className="relative flex bg-gray-950/80 rounded-xl p-1">

              <motion.div
                className="
                  absolute
                  top-1 bottom-1
                  rounded-lg
                  bg-blue-600
                  shadow-[0_4px_20px_rgba(37,99,235,0.3)]
                "
                animate={{
                  left:
                    activeTab === "login"
                      ? "4px"
                      : "50%",
                  width: "calc(50% - 4px)",
                }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                }}
              />

              <button
                onClick={() => setActiveTab("login")}
                className={`
                  relative z-10
                  w-1/2
                  py-2
                  rounded-lg
                  text-xs
                  font-semibold
                  ${
                    activeTab === "login"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }
                `}
              >
                Login
              </button>

              <button
                onClick={() => setActiveTab("signup")}
                className={`
                  relative z-10
                  w-1/2
                  py-2
                  rounded-lg
                  text-xs
                  font-semibold
                  ${
                    activeTab === "signup"
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }
                `}
              >
                Sign Up
              </button>

            </div>

            {/* =================================================
                           FORM TITLE
            ================================================== */}

            <AnimatePresence mode="wait">

              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="text-center mt-5 mb-4"
              >

                <h2 className="text-xl font-bold text-white">
                  {activeTab === "login"
                    ? "Welcome back"
                    : "Create account"}
                </h2>

                <p className="text-gray-600 text-xs mt-1">
                  {activeTab === "login"
                    ? "Good to see you again."
                    : "Start chatting with your friends."}
                </p>

              </motion.div>

            </AnimatePresence>

            {/* =================================================
                             FORM
            ================================================== */}

            <AnimatePresence mode="wait">

              <motion.div
                key={activeTab}
                initial={{
                  opacity: 0,
                  x: activeTab === "login"
                    ? -12
                    : 12,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: activeTab === "login"
                    ? 12
                    : -12,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="px-2 pb-2"
              >
                {activeTab === "login" ? (
                  <Login />
                ) : (
                  <Signup />
                )}
              </motion.div>

            </AnimatePresence>

          </div>

        </motion.div>

        {/* =================================================
                         BOTTOM FEATURES
        ================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center gap-6 mt-5"
        >

          <MiniFeature
            icon={<Zap size={12} />}
            text="Fast"
          />

          <MiniFeature
            icon={<Users size={12} />}
            text="Connect"
          />

          <MiniFeature
            icon={<Heart size={12} />}
            text="Share"
          />

        </motion.div>

        <p className="text-center text-gray-700 text-[10px] mt-4">
          © 2026 Chattify
        </p>

      </motion.div>

    </div>
  );
};

const MiniFeature = ({ icon, text }) => {
  return (
    <motion.div
      whileHover={{
        y: -2,
        scale: 1.05,
      }}
      className="flex items-center gap-1.5 text-gray-600 text-xs"
    >
      <span className="text-blue-500">
        {icon}
      </span>

      {text}
    </motion.div>
  );
};

export default Home;
