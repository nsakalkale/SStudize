"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import TestCreator from "@/components/teacher/TestCreator";

interface TestConfig {
  id: string;
  title: string;
  description: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  scheduledFor: string;
  duration: number;
  questionIds: string[];
  assignedTo: string[];
}

interface DecodedToken {
  role: string;
  exp: number;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<"tests" | "create">("tests");
  const [tests, setTests] = useState<TestConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.authToken;

    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.role !== "teacher") {
        router.push("/");
        return;
      }

      if (decoded.exp * 1000 < Date.now()) {
        destroyCookie(null, "authToken");
        router.push("/");
        return;
      }

      const storedTests = localStorage.getItem("tests");
      if (storedTests) {
        setTests(JSON.parse(storedTests));
      }

      setLoading(false);
    } catch (error) {
      destroyCookie(null, "authToken");
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    destroyCookie(null, "authToken");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sstudize</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-white border-white hover:bg-blue-800"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-black">Teacher Dashboard</h2>
          <Button
            onClick={() => setActiveView("create")}
            className={`${
              activeView === "create"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-50 text-blue-600 hover:bg-blue-100 border-2 border-dashed border-blue-200"
            }`}
          >
            Create Test
          </Button>
        </div>

        {activeView === "tests" ? (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div
                className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-blue-200 hover:border-blue-400 cursor-pointer"
                onClick={() => setActiveView("create")}
              >
                <h3 className="text-xl font-semibold text-black mb-2">
                  Create New Test
                </h3>
                <p className="text-gray-600">
                  Create a new test with custom questions and assign it to
                  students
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 border-2 border-dashed border-green-200 hover:border-green-400">
                <h3 className="text-xl font-semibold text-black mb-2">
                  Test Analytics Overview
                </h3>
                <p className="text-gray-600 mb-4">
                  View performance analytics across all your tests
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-2 rounded">
                    <div className="font-semibold text-green-700">
                      Total Tests
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {tests.length}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="font-semibold text-blue-700">
                      Active Tests
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {
                        tests.filter(
                          (t) => new Date(t.scheduledFor) > new Date()
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {tests.length > 0 ? (
                tests.map((test) => (
                  <div
                    key={test.id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-black mb-2">
                          {test.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{test.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-black">
                              Scheduled for:{" "}
                            </span>
                            <span className="text-black">
                              {new Date(test.scheduledFor).toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-black">
                              Duration:{" "}
                            </span>
                            <span className="text-black">
                              {test.duration / 60} minutes
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-black">
                              Questions:{" "}
                            </span>
                            <span className="text-black">
                              {test.questionIds.length}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-black">
                              Students:{" "}
                            </span>
                            <span className="text-black">
                              {test.assignedTo.length}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() =>
                          router.push(`/teacher/analytics/${test.id}`)
                        }
                        className="bg-gray-800 hover:bg-gray-900 text-white"
                      >
                        View Analytics
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Tests Created Yet
                  </h3>
                </div>
              )}
            </div>
          </>
        ) : (
          <TestCreator />
        )}
      </main>
    </div>
  );
}
