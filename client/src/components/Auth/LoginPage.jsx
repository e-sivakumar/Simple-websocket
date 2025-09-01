import { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function LoginPage({ onSwitch }) {
  const { login } = useContext(AppContext);
  const [form, setForm] = useState({ userName: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    login(form);
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full mb-3 p-2 border rounded"
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Login
        </button>
        <p className="text-sm text-center mt-4">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={onSwitch}
            >
              Sign up
            </span>
          </p>
      </form>
    </div>
  );
}
