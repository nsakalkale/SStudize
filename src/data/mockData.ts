import type { QuestionType, TestConfig, User } from "@/types";

export const SUBJECTS = ["Physics", "Chemistry", "Mathematics"] as const;

export const users: User[] = [
  {
    id: "student1",
    name: "John Doe",
    email: "john@example.com",
    role: "student",
  },
  {
    id: "student1",
    name: "Alina",
    email: "alina@example.com",
    role: "student",
  },
  {
    id: "teacher1",
    name: "Dr. Smith",
    email: "smith@example.com",
    role: "teacher",
  },
];

export const questions: QuestionType[] = [
  {
    id: 1,
    subject: "Physics",
    text: "A person standing on an open ground hears the sound of a aeroplane coming from north at an angle 60° with ground level. But he finds the aeroplane right vertically above his position. If v is the speed of sound, speed of the plane is:",
    options: ["v", "v/2", "√3v/2", "2v"],
    correctAnswer: 2,
    explanation:
      "Using the relation between angle of approach and velocity vectors.",
  },
  {
    id: 2,
    subject: "Physics",
    text: "A ball is thrown vertically upward with a velocity of 20 m/s. What is the maximum height reached by the ball? (g = 10 m/s²)",
    options: ["10 m", "20 m", "30 m", "40 m"],
    correctAnswer: 1,
    explanation: "Using the formula h = v²/2g = (20)²/(2×10) = 20 m",
  },
  {
    id: 3,
    subject: "Physics",
    text: "Two identical charged particles are placed at a distance d apart. If the force between them is F, what will be the force if the distance is doubled?",
    options: ["F/4", "F/2", "2F", "4F"],
    correctAnswer: 0,
    explanation:
      "According to Coulomb's law, F ∝ 1/r². So if r becomes 2r, F becomes F/4.",
  },
  {
    id: 4,
    subject: "Physics",
    text: "What is the equivalent resistance between points A and B in a circuit with two 2Ω resistors in parallel?",
    options: ["1Ω", "2Ω", "4Ω", "8Ω"],
    correctAnswer: 0,
    explanation:
      "For parallel resistors, 1/R = 1/R1 + 1/R2. Here, 1/R = 1/2 + 1/2 = 1, so R = 1Ω",
  },
  {
    id: 5,
    subject: "Physics",
    text: "A simple pendulum has a time period of 2s. What will be its time period on the moon where g is 1/6th of that on earth?",
    options: ["√6 s", "2√6 s", "4.9 s", "1.2 s"],
    correctAnswer: 1,
    explanation:
      "Time period T = 2π√(l/g). As l is constant, T ∝ 1/√g. So new T = 2√6 s",
  },
  {
    id: 6,
    subject: "Physics",
    text: "The momentum of a body is doubled. By what factor does its kinetic energy change?",
    options: ["2", "4", "√2", "8"],
    correctAnswer: 1,
    explanation: "KE = p²/2m. If p doubles, KE becomes 4 times.",
  },
  {
    id: 7,
    subject: "Physics",
    text: "A ray of light travels from air to glass. If the angle of incidence is 45°, what is the angle of refraction? (Refractive index of glass = √2)",
    options: ["30°", "60°", "15°", "45°"],
    correctAnswer: 0,
    explanation: "Using Snell's law, sin(45°)/sin(r) = √2. Therefore r = 30°",
  },
  {
    id: 8,
    subject: "Physics",
    text: "What is the wavelength of the first line of the Balmer series for hydrogen atom?",
    options: ["656.3 nm", "486.1 nm", "434.0 nm", "410.2 nm"],
    correctAnswer: 0,
    explanation:
      "The first line (n=3 to n=2) has wavelength 656.3 nm (Hα line)",
  },
  {
    id: 9,
    subject: "Physics",
    text: "A wire of resistance R is cut into two equal parts. The two parts are connected in parallel. What is the equivalent resistance?",
    options: ["R/4", "R/2", "R", "2R"],
    correctAnswer: 0,
    explanation:
      "Each part has resistance R/2. In parallel, total resistance = (R/2 × R/2)/(R/2 + R/2) = R/4",
  },
  {
    id: 10,
    subject: "Physics",
    text: "What is the escape velocity from Earth's surface? (G=6.67×10⁻¹¹ N-m²/kg², M=6×10²⁴ kg, R=6.4×10⁶ m)",
    options: ["11.2 km/s", "8.9 km/s", "7.9 km/s", "6.4 km/s"],
    correctAnswer: 0,
    explanation: "Escape velocity = √(2GM/R) = 11.2 km/s",
  },

  {
    id: 11,
    subject: "Chemistry",
    text: "Which of the following is not an isotope of hydrogen?",
    options: ["Protium", "Deuterium", "Tritium", "Helium"],
    correctAnswer: 3,
    explanation:
      "Helium is a different element with atomic number 2, while all isotopes of hydrogen have atomic number 1.",
  },
  {
    id: 12,
    subject: "Chemistry",
    text: "The pH of a neutral solution at 25°C is:",
    options: ["0", "7", "14", "Depends on the solution"],
    correctAnswer: 1,
    explanation: "At 25°C, the pH of a neutral solution is 7.",
  },
  {
    id: 13,
    subject: "Chemistry",
    text: "Which of the following is a strong electrolyte?",
    options: ["CH₃COOH", "NH₄OH", "HCl", "C₆H₁₂O₆"],
    correctAnswer: 2,
    explanation:
      "HCl completely dissociates in water, making it a strong electrolyte.",
  },
  {
    id: 14,
    subject: "Chemistry",
    text: "What is the hybridization of carbon in benzene?",
    options: ["sp", "sp²", "sp³", "sp³d"],
    correctAnswer: 1,
    explanation:
      "Carbon atoms in benzene are sp² hybridized, forming a planar hexagonal structure.",
  },
  {
    id: 15,
    subject: "Chemistry",
    text: "Which quantum number determines the shape of the orbital?",
    options: ["Principal", "Azimuthal", "Magnetic", "Spin"],
    correctAnswer: 1,
    explanation:
      "The azimuthal quantum number (l) determines the shape of the orbital.",
  },
  {
    id: 16,
    subject: "Chemistry",
    text: "What is the IUPAC name of CH₃-CH₂-CHO?",
    options: ["Propanal", "Propanol", "Propanone", "Propanoic acid"],
    correctAnswer: 0,
    explanation: "The -CHO group indicates an aldehyde, making it propanal.",
  },
  {
    id: 17,
    subject: "Chemistry",
    text: "Which of the following has the highest lattice energy?",
    options: ["NaCl", "MgO", "KCl", "CaO"],
    correctAnswer: 1,
    explanation:
      "MgO has the highest lattice energy due to higher charge and smaller ionic radius.",
  },
  {
    id: 18,
    subject: "Chemistry",
    text: "What is the oxidation state of chromium in K₂Cr₂O₇?",
    options: ["+3", "+4", "+6", "+7"],
    correctAnswer: 2,
    explanation: "In dichromate ion, chromium has an oxidation state of +6.",
  },
  {
    id: 19,
    subject: "Chemistry",
    text: "Which of the following is an example of a coordination compound?",
    options: ["NaCl", "[Cu(NH₃)₄]SO₄", "CH₄", "C₆H₆"],
    correctAnswer: 1,
    explanation:
      "Copper tetraamine sulfate is a coordination compound with Cu²⁺ as central metal ion.",
  },
  {
    id: 20,
    subject: "Chemistry",
    text: "What is the bond order in O₂²⁻?",
    options: ["1", "1.5", "2", "2.5"],
    correctAnswer: 0,
    explanation:
      "O₂²⁻ has 12 valence electrons, giving a bond order of (8-6)/2 = 1.",
  },

  {
    id: 21,
    subject: "Mathematics",
    text: "If f(x) = x² - 3x + 2, then f(2) is:",
    options: ["0", "1", "2", "4"],
    correctAnswer: 0,
    explanation: "f(2) = 2² - 3(2) + 2 = 4 - 6 + 2 = 0",
  },
  {
    id: 22,
    subject: "Mathematics",
    text: "The derivative of sin(x) with respect to x is:",
    options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"],
    correctAnswer: 0,
    explanation: "The derivative of sin(x) is cos(x).",
  },
  {
    id: 23,
    subject: "Mathematics",
    text: "The value of ∫₀¹ x² dx is:",
    options: ["1/2", "1/3", "2/3", "1"],
    correctAnswer: 1,
    explanation: "∫₀¹ x² dx = [x³/3]₀¹ = 1/3 - 0 = 1/3",
  },
  {
    id: 24,
    subject: "Mathematics",
    text: "What is the sum of the series 1 + 1/2 + 1/4 + 1/8 + ... to infinity?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 1,
    explanation:
      "This is a geometric series with a=1 and r=1/2. Sum = a/(1-r) = 1/(1-1/2) = 2",
  },
  {
    id: 25,
    subject: "Mathematics",
    text: "If A and B are independent events with P(A) = 0.3 and P(B) = 0.4, then P(A∩B) is:",
    options: ["0.12", "0.7", "0.3", "0.4"],
    correctAnswer: 0,
    explanation:
      "For independent events, P(A∩B) = P(A) × P(B) = 0.3 × 0.4 = 0.12",
  },
  {
    id: 26,
    subject: "Mathematics",
    text: "The determinant of a 2×2 matrix [[a,b],[c,d]] is:",
    options: ["ac-bd", "ad+bc", "ad-bc", "ab-cd"],
    correctAnswer: 2,
    explanation: "The determinant is ad-bc.",
  },
  {
    id: 27,
    subject: "Mathematics",
    text: "What is the equation of a circle with center (2,3) and radius 4?",
    options: [
      "(x-2)²+(y-3)²=16",
      "(x+2)²+(y+3)²=16",
      "(x-2)²+(y-3)²=4",
      "(x+2)²+(y+3)²=4",
    ],
    correctAnswer: 0,
    explanation:
      "Standard form is (x-h)²+(y-k)²=r², where (h,k) is center and r is radius.",
  },
  {
    id: 28,
    subject: "Mathematics",
    text: "If sin θ = 3/5, what is cos θ?",
    options: ["4/5", "5/3", "3/4", "5/4"],
    correctAnswer: 0,
    explanation: "Using sin²θ + cos²θ = 1, cos θ = √(1-9/25) = 4/5",
  },
  {
    id: 29,
    subject: "Mathematics",
    text: "The domain of the function f(x) = √(x-1) is:",
    options: ["x ≥ 0", "x > 0", "x ≥ 1", "x > 1"],
    correctAnswer: 2,
    explanation:
      "For square root, the expression inside must be non-negative: x-1 ≥ 0, so x ≥ 1",
  },
  {
    id: 30,
    subject: "Mathematics",
    text: "What is the value of lim(x→0) sin(x)/x?",
    options: ["0", "1", "∞", "undefined"],
    correctAnswer: 1,
    explanation:
      "This is a famous limit that equals 1, can be proven using L'Hôpital's rule.",
  },
];

export const tests: TestConfig[] = [
  {
    id: "test1",
    title: "Physics, Chemistry and Mathematics Test",
    description: "Combined test covering all subjects",
    duration: 3600 * 3,
    totalMarks: 100,
    passingMarks: 35,
    subjects: ["Physics", "Chemistry", "Mathematics"],
    questionIds: Array.from({ length: 30 }, (_, i) => i + 1),
    scheduledFor: new Date("2024-03-20T10:00:00Z").getTime(),
    scheduledBy: "admin1",
    assignedTo: ["student1"],
  },
];
