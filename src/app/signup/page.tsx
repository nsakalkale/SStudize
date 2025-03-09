"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import Cookies from "js-cookie";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, role } = formData;

    if (!firstName || !lastName || !email || !password) {
      return toast.error("Please fill all fields");
    }

    try {
      const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Signup failed");

      const user = await res.json();
      Cookies.set("authToken", user.token, { expires: 7 });

      toast.success("Signup successful");
      router.push(
        role === "student" ? "/student/dashboard" : "/teacher/dashboard"
      );
    } catch (err) {
      toast.error("Signup failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-black">Sstudize</h1>
          <p className="mt-2 text-sm text-black">
            Create an account to access the platform
          </p>
        </div>

        <form onSubmit={handleSignup} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4 justify-center">
              {["student", "teacher"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleChange(role)}
                  className={`flex-1 py-2 px-4 rounded-md ${
                    formData.role === role
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-black"
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>

            {["firstName", "lastName", "email", "password"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-black mb-1">
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <Input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md text-black"
                  placeholder={`Enter your ${field
                    .replace(/([A-Z])/g, " $1")
                    .toLowerCase()}`}
                />
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}
