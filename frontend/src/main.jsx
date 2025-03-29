import React, { useState, useEffect } from "react";
import { backend } from "declarations/backend";
import ReactDOM from "react-dom/client"
import Authentication from "./Authentication";
import QuizList from "./QuizList";
import QuizTaker from "./QuizTaker";
import QuizCreator from "./QuizCreator";
import Header from "./Header";
import '/index.css';
 function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("auth"); 
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const allQuizzes = await backend.getAllQuizzes();
      setQuizzes(allQuizzes);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch quizzes");
      setLoading(false);
      console.error(err);
    }
  };
  const checkAuthentication = async () => {
    try {
      const principal = localStorage.getItem("userPrincipal");
      if (principal) {
        const userData = await backend.getUser(principal);
        if (userData) {
          setUser(userData);
          setView("quizList");
        }
      }
    } catch (err) {
      console.error("Authentication check failed:", err);
    }
  };
  useEffect(() => {
    checkAuthentication();
    fetchQuizzes();
  }, []);
  const handleAuthentication = async (username) => {
    try {
      setLoading(true);
      const principal = await backend.createUser(username);
      const userData = await backend.getUser(principal);
      setUser(userData);
      localStorage.setItem("userPrincipal", principal.toString());
      setView("quizList");
      setLoading(false);
    } catch (err) {
      setError("Authentication failed");
      setLoading(false);
      console.error(err);
    }
  };
  const handleSelectQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setView("takeQuiz");
  };
  const handleSubmitQuiz = async (quizId, score) => {
    try {
      setLoading(true);
      await backend.submitScore(quizId, score);
      setLoading(false);
      setView("quizList");
      fetchQuizzes();
    } catch (err) {
      setError("Failed to submit quiz");
      setLoading(false);
      console.error(err);
    }
  };
  const handleCreateQuiz = async (quizData, questions) => {
    try {
      setLoading(true);
      const { title, description, maxScore } = quizData;
      const quizId = await backend.createQuiz(title, description, maxScore);  
      for (const q of questions) {
        await backend.addQuestion(quizId, q.question, q.choices, q.rightAnswer);
      }
      setLoading(false);
      setView("quizList");
      fetchQuizzes();
    } catch (err) {
      setError("Failed to create quiz");
      setLoading(false);
      console.error(err);
    }
  };
  const handleDeleteQuiz = async (quizId) => {
    try {
      if (window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
        setLoading(true);
        await backend.deleteQuizById(quizId);
        setLoading(false);
        fetchQuizzes();
      }
    } catch (err) {
      setError("Failed to delete quiz: " + err.message);
      setLoading(false);
      console.error(err);
    }
  };
  const renderView = () => {
    switch (view) {
      case "auth":
        return <Authentication onAuthenticate={handleAuthentication} />;
      case "quizList":
        return (
          <QuizList 
            quizzes={quizzes} 
            onSelectQuiz={handleSelectQuiz} 
            onCreateQuiz={() => setView("createQuiz")}
            onDeleteQuiz={handleDeleteQuiz}
            user={user}
          />
        );
      case "takeQuiz":
        return (
          <QuizTaker 
            quiz={currentQuiz} 
            onSubmit={handleSubmitQuiz}
            onBack={() => setView("quizList")}
          />
        );
      case "createQuiz":
        return (
          <QuizCreator 
            onSubmit={handleCreateQuiz}
            onCancel={() => setView("quizList")}
          />
        );
      default:
        return <div className="text-black font-bold text-3xl">Invalid view</div>;
    }
  };
  return (
    <div className="max-w-7xl mx-auto p-5 relative">
      <Header 
        user={user} 
        onLogout={() => {
          setUser(null);
          localStorage.removeItem("userPrincipal");
          setView("auth");
        }}
      />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center text-white text-xl z-50">
          Loading...
        </div>
      )}
      {error && (
        <div className="fixed top-5 right-5 bg-red-500 text-white p-4 rounded shadow-lg z-50 flex items-center gap-3">
          {error}
          <button 
            onClick={() => setError(null)}
            className="border border-white text-white text-xs py-1 px-2 rounded hover:bg-red-600"
          >
            Dismiss
          </button>
        </div>
      )}
      {renderView()}
    </div>
  );
}
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);