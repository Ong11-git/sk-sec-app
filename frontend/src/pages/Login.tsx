import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Shield,
  Building2,
  Users,
  CheckCircle,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Login failed");
      }

      const data = await response.json();
      sessionStorage.setItem("token", data.token);

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    tap: { scale: 0.98 },
  };

  const features = [
    { icon: Shield, text: "256-bit Encryption" },
    { icon: Users, text: "Role-based Access" },
    { icon: Building2, text: "Centralized Management" },
    { icon: CheckCircle, text: "Audit Logs" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#061E47]/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-[#061E47]/5 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-4xl"
      >
        <motion.div
          variants={itemVariants}
          className="card bg-white shadow-2xl border border-gray-200 overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Left Side - Government Portal Info */}
            <div className="lg:w-5/12 bg-gradient-to-br from-[#061E47] to-[#0A2E6E] text-white p-8 lg:p-10">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <motion.div
                    initial={{ rotate: 0, scale: 0 }}
                    animate={{ rotate: 360, scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="mb-6"
                  >
                    <Shield className="w-12 h-12" />
                  </motion.div>

                  <h1 className="text-3xl font-bold mb-3">Government Portal</h1>
                  <p className="text-blue-100 opacity-90 text-lg mb-8">
                    Secure Access Dashboard
                  </p>

                  <div className="space-y-4 mb-8">
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <feature.icon className="w-5 h-5 text-blue-300" />
                        <span className="text-blue-100">{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-blue-700/50">
                  <div className="flex items-center space-x-2 text-sm text-blue-200">
                    <Lock className="w-4 h-4" />
                    <span>Protected Government System v2.1</span>
                  </div>
                  <p className="text-xs text-blue-300/80 mt-2">
                    Authorized personnel only. All activities are monitored and
                    logged.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-7/12 p-8 lg:p-10">
              <div className="h-full flex flex-col">
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  Secure Login
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-gray-600 mb-8"
                >
                  Enter your credentials to access government services
                </motion.p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="alert alert-error shadow-lg mb-6"
                  >
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current flex-shrink-0 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="ml-2">{error}</span>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
                  <motion.div variants={itemVariants}>
                    <label className="label">
                      <span className="label-text text-gray-700 font-medium">
                        Email Address
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        className="input input-bordered w-full pl-10 focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 transition-all duration-300"
                        placeholder="government.official@domain.gov"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <label className="label">
                      <span className="label-text text-gray-700 font-medium">
                        Password
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="input input-bordered w-full pl-10 pr-10 focus:border-[#061E47] focus:ring-2 focus:ring-[#061E47]/20 transition-all duration-300"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                        )}
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs"
                          id="remember"
                        />
                        <label
                          htmlFor="remember"
                          className="label-text text-gray-600 ml-2 cursor-pointer"
                        >
                          Remember me
                        </label>
                      </div>
                      <a
                        href="#"
                        className="label-text-alt text-[#061E47] hover:text-[#061E47]/80 transition-colors font-medium"
                      >
                        Forgot password?
                      </a>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="mt-auto">
                    <motion.button
                      variants={buttonVariants}
                      initial="initial"
                      whileHover="hover"
                      whileTap="tap"
                      type="submit"
                      disabled={isLoading}
                      className="btn w-full bg-[#061E47] hover:bg-[#061E47]/90 border-none text-white font-semibold shadow-lg py-3"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Authenticating...
                        </span>
                      ) : (
                        "Access Portal"
                      )}
                    </motion.button>
                  </motion.div>
                </form>

                <motion.div
                  variants={itemVariants}
                  className="mt-6 pt-4 border-t border-gray-200"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>Secure Connection • TLS 1.3</span>
                    </div>
                    <div className="text-center">
                      <span className="text-gray-600 font-medium">
                        Need help?
                      </span>
                      <span className="mx-2">•</span>
                      <a
                        href="#"
                        className="text-[#061E47] hover:text-[#061E47]/80 transition-colors"
                      >
                        Contact Support
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.95); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        /* Adjust card height for different screens */
        @media (max-height: 700px) {
          .min-h-\[500px\] {
            min-height: 450px;
          }
        }
        
        @media (max-height: 600px) {
          .min-h-\[500px\] {
            min-height: 400px;
          }
        }
      `}</style>
    </div>
  );
}
