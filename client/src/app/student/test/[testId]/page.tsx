"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import type { QuestionType, TestConfig, TestSession, User, UserAnswer } from "@/types"
import { Button } from "@/components/ui/button"

const MAX_TAB_SWITCHES = 3 
const WARNING_MESSAGE = "Warning: Switching tabs is not allowed! Your test may be auto-submitted."

export default function TestInterface({ params }: { params: Promise<{ testId: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [test, setTest] = useState<TestConfig | null>(null)
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [session, setSession] = useState<TestSession | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [selectedSubject, setSelectedSubject] = useState<string>("Physics")
  const [tabSwitchWarningShown, setTabSwitchWarningShown] = useState(false)

  const { testId } = use(params)

  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject)
    const firstQuestionIndex = questions.findIndex(q => q.subject === subject)
    if (firstQuestionIndex !== -1) {
      setCurrentQuestionIndex(firstQuestionIndex)
    }
  }

  useEffect(() => {
    const storedTests = localStorage.getItem('tests')
    const storedQuestions = localStorage.getItem('questions')
    const storedUser = localStorage.getItem('currentUser')

    if (!storedTests || !storedQuestions || !storedUser) {
      router.push('/')
      return
    }

    const tests: TestConfig[] = JSON.parse(storedTests)
    const allQuestions: QuestionType[] = JSON.parse(storedQuestions)
    const user: User = JSON.parse(storedUser)

    const currentTest = tests.find(t => t.id === testId)
    if (!currentTest) {
      router.push('/student/dashboard')
      return
    }

    const savedSession = localStorage.getItem(`test_session_${testId}`)
    if (savedSession) {
      const parsedSession: TestSession = JSON.parse(savedSession)
      if (!parsedSession.completed) {
        setSession(parsedSession)
        setTimeLeft(parsedSession.remainingTime)
        const questionIndex = allQuestions.findIndex(q => q.id === parsedSession.currentQuestionId)
        setCurrentQuestionIndex(questionIndex !== -1 ? questionIndex : 0)
        if (questionIndex !== -1) {
          setSelectedSubject(allQuestions[questionIndex].subject)
        }
        setQuestions(allQuestions.filter(q => currentTest.questionIds.includes(q.id)))
        setTest(currentTest)
        setLoading(false)
        return
      }
    }

    const testSession: TestSession = {
      id: `session_${Date.now()}`,
      userId: user.id,
      testId: currentTest.id,
      startTime: Date.now(),
      remainingTime: currentTest.duration,
      currentQuestionId: currentTest.questionIds[0],
      answers: {},
      tabSwitchCount: 0,
      completed: false
    }

    currentTest.questionIds.forEach(qId => {
      testSession.answers[qId] = {
        questionId: qId,
        selectedOption: null,
        markedForReview: false,
        timeSpent: 0,
        visited: false
      }
    })

    setTest(currentTest)
    setQuestions(allQuestions.filter(q => currentTest.questionIds.includes(q.id)))
    setSession(testSession)
    setTimeLeft(currentTest.duration)
    setLoading(false)
  }, [testId, router])

  useEffect(() => {
    if (!timeLeft || !session) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, session])

  useEffect(() => {
    if (!session || !test || session.completed) return

    const autoSaveInterval = setInterval(() => {
      const updatedSession = {
        ...session,
        remainingTime: timeLeft,
        currentQuestionId: questions[currentQuestionIndex].id
      }
      localStorage.setItem(`test_session_${testId}`, JSON.stringify(updatedSession))
    }, 5000)

    return () => clearInterval(autoSaveInterval)
  }, [session, test, timeLeft, currentQuestionIndex, questions, testId])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!session || session.completed) return

      if (document.hidden) {
        const updatedSession = {
          ...session,
          tabSwitchCount: session.tabSwitchCount + 1
        }
        setSession(updatedSession)
        localStorage.setItem(`test_session_${testId}`, JSON.stringify(updatedSession))

        if (updatedSession.tabSwitchCount >= MAX_TAB_SWITCHES) {
          handleSubmit()
        } else {
          setTabSwitchWarningShown(true)
          alert(WARNING_MESSAGE)
          setTimeout(() => setTabSwitchWarningShown(false), 3000)
        }
      }
    }

    const preventDefaultActions = (e: Event) => {
      e.preventDefault()
      return false
    }

    const preventKeyboardCopy = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase()
        if (key === 'c' || key === 'v' || key === 'x') {
          e.preventDefault()
          return false
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('contextmenu', preventDefaultActions)
    document.addEventListener('copy', preventDefaultActions)
    document.addEventListener('paste', preventDefaultActions)
    document.addEventListener('cut', preventDefaultActions)
    document.addEventListener('keydown', preventKeyboardCopy)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('contextmenu', preventDefaultActions)
      document.removeEventListener('copy', preventDefaultActions)
      document.removeEventListener('paste', preventDefaultActions)
      document.removeEventListener('cut', preventDefaultActions)
      document.removeEventListener('keydown', preventKeyboardCopy)
    }
  }, [session, testId])

  const handleOptionSelect = (optionIndex: number) => {
    if (!session || !test) return

    const currentQuestion = questions[currentQuestionIndex]
    const updatedSession = {
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: {
          ...session.answers[currentQuestion.id],
          selectedOption: optionIndex,
          visited: true
        }
      },
      currentQuestionId: currentQuestion.id,
      remainingTime: timeLeft
    }
    setSession(updatedSession)
    localStorage.setItem(`test_session_${testId}`, JSON.stringify(updatedSession))
  }

  const handleMarkForReview = () => {
    if (!session || !test) return

    const currentQuestion = questions[currentQuestionIndex]
    const updatedSession = {
      ...session,
      answers: {
        ...session.answers,
        [currentQuestion.id]: {
          ...session.answers[currentQuestion.id],
          markedForReview: !session.answers[currentQuestion.id].markedForReview
        }
      },
      currentQuestionId: currentQuestion.id,
      remainingTime: timeLeft
    }
    setSession(updatedSession)
    localStorage.setItem(`test_session_${testId}`, JSON.stringify(updatedSession))
  }

  const handleSubmit = () => {
    if (!session || !test) return

    const updatedSession = {
      ...session,
      completed: true,
      remainingTime: timeLeft
    }
    localStorage.setItem(`test_session_${testId}`, JSON.stringify(updatedSession))

    const stats = questions.reduce((acc, question) => {
      const answer = session.answers[question.id]
      if (answer.markedForReview) {
        acc.markedForReview++
      }
      if (answer.selectedOption !== null) {
        if (answer.selectedOption === question.correctAnswer) {
          acc.correctAnswers++
        } else {
          acc.incorrectAnswers++
        }
      } else {
        acc.unattempted++
      }
      return acc
    }, {
      correctAnswers: 0,
      incorrectAnswers: 0,
      unattempted: 0,
      markedForReview: 0
    })

    const results = {
      testId: test.id,
      userId: session.userId,
      score: stats.correctAnswers, 
      totalQuestions: questions.length,
      correctAnswers: stats.correctAnswers,
      incorrectAnswers: stats.incorrectAnswers,
      unattempted: stats.unattempted,
      markedForReview: stats.markedForReview,
      timeTaken: test.duration - timeLeft,
      submittedAt: Date.now(),
      questionStats: questions.map(q => ({
        questionId: q.id,
        timeSpent: 0, 
        isCorrect: session.answers[q.id].selectedOption === q.correctAnswer,
        attempted: session.answers[q.id].selectedOption !== null
      }))
    }

    const testResults = JSON.parse(localStorage.getItem('testResults') || '{}')
    testResults[`${test.id}_${session.userId}`] = results
    localStorage.setItem('testResults', JSON.stringify(testResults))

    router.push(`/student/results/${test.id}`)
  }

  if (loading) {
    return <div>Loading test...</div>
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = session?.answers[currentQuestion.id]
  const subjectQuestions = questions.filter(q => q.subject === selectedSubject)
  const subjectStartIndex = questions.findIndex(q => q.subject === selectedSubject)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black">{test?.title}</h1>
            <div className="flex items-center gap-6">
              <div className="text-black font-semibold">
                Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
              <Button 
                onClick={handleSubmit}
                className="bg-red-500 hover:bg-red-600"
              >
                End Test
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col-reverse md:flex-row gap-4">
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-black mb-2">Question {currentQuestionIndex + 1}</h2>
                  <p className="text-black mb-4">{currentQuestion.text}</p>

                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          currentAnswer?.selectedOption === index
                            ? 'bg-blue-100 border-blue-500'
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleOptionSelect(index)}
                      >
                        <span className="text-black">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    Previous
                  </Button>

                  <Button
                    onClick={() => handleMarkForReview()}
                    className={currentAnswer?.markedForReview ? 'bg-yellow-500' : 'bg-gray-500'}
                  >
                    {currentAnswer?.markedForReview ? 'Marked for Review' : 'Mark for Review'}
                  </Button>

                  {currentQuestionIndex === questions.length - 1 ? (
                    <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-600">
                      Submit Test
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Next
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
                <h3 className="text-lg font-semibold text-black mb-4">Question Palette</h3>
                
                <div className="flex space-x-2 mb-4">
                  {test?.subjects.map((subject) => (
                    <Button
                      key={subject}
                      onClick={() => handleSubjectChange(subject)}
                      className={`${
                        selectedSubject === subject
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-black hover:bg-gray-300'
                      }`}
                    >
                      {subject}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <span className="text-sm text-black">Not Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span className="text-sm text-black">Visited</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                    <span className="text-sm text-black">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span className="text-sm text-black">Marked for Review</span>
                  </div>
                </div>

                <div className="grid grid-cols-8 md:grid-cols-6 lg:grid-cols-10 gap-2">
                  {subjectQuestions.map((question, index) => {
                    const answer = session?.answers[question.id]
                    let bgColor = 'bg-gray-200'
                    if (answer?.visited) bgColor = 'bg-red-200'
                    if (answer?.selectedOption !== null) bgColor = 'bg-green-200'
                    if (answer?.markedForReview) bgColor = 'bg-yellow-200'

                    return (
                      <div
                        key={question.id}
                        className={`${bgColor} w-8 h-8 flex items-center justify-center rounded cursor-pointer ${
                          currentQuestionIndex === index + subjectStartIndex ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => setCurrentQuestionIndex(index + subjectStartIndex)}
                      >
                        <span className="text-black">{index + 1}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center text-sm text-black">
            <div>
              Questions Attempted: {Object.values(session?.answers || {}).filter(a => a.selectedOption !== null).length} / {questions.length}
            </div>
            <div>
              Marked for Review: {Object.values(session?.answers || {}).filter(a => a.markedForReview).length}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 