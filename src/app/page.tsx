"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "teacher">("student");

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      try {
        const decoded: { role: string; id: string } = jwtDecode(token);
        router.push(`/${decoded.role}/dashboard`);
      } catch (err) {
        console.error("Invalid Token:", err);
        Cookies.remove("authToken");
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please fill all fields");

    try {
      const { data } = await axios.post(`/api/auth/signin`, {
        email,
        password,
        role,
      });
      Cookies.set("authToken", data.token, { expires: 7, secure: true });
      toast.success("Login successful");
      router.push(`/${role}/dashboard`);
    } catch (err) {
      console.error("Login Error:", err);
      toast.error(err.response?.data?.error || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-black">Sstudize</h1>
          <p className="mt-2 text-sm text-black">
            Online Test Simulation Platform for Engineering Exam Aspirants
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              {["student", "teacher"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r as "student" | "teacher")}
                  className={`flex-1 py-2 px-4 rounded-md transition-all ${
                    role === r
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-1"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md text-black"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-black mb-1"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md text-black"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
