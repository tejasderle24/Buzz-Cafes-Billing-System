import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // 👈 prevent default form submit

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative bg-[url(https://ik.imagekit.io/tejasderlepatil/buzzcafe/background.png)] bg-cover bg-center">

      {/* Overlay for content */}
      <div className="relative z-10 bg-white/40 backdrop-blur-sm shadow-xl rounded-xl p-8 w-full max-w-md mx-4">
        <div className="flex flex-col items-center mb-6">
          <img src="./src/assets/logo2.svg" alt="Buzz Cafe" className="w-20 h-20 mb-2" />
          <h2 className="text-2xl font-semibold text-orange-700 text-center font-primery">Welcome Back</h2>
          <p className="text-black text-sm text-center font-secondry">Login in with your email and password</p>
        </div>
        <form className="space-y-6 font-secondry" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email Id"
            value={form.email}
            onChange={handleChange}
            className="w-full border-b border-gray-800 py-2 focus:outline-none focus:border-orange-500"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full border-b border-gray-800 py-2 focus:outline-none focus:border-orange-500"
            required
          />
          {/* <div className="text-right text-sm text-gray-600">Forget password ?</div> */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-white font-semibold py-2 rounded-full shadow-md hover:bg-yellow-500"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
