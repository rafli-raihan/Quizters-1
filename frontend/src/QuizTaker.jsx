import React, { useState } from "react";
import Timer from "./Timer";

export default function QuizTaker({ quiz, onSubmit, onBack }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  if (!quiz) return <div>No quiz selected</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateScore(newAnswers);
    }
  };

  const handleTimeout = () => {
    handleAnswer(null);
  };

  const calculateScore = (finalAnswers) => {
    let totalScore = 0;
    quiz.questions.forEach((question) => {
      if (finalAnswers[question.id] === question.rightAnswer) {
        if (typeof quiz.maxScore === "bigint") {
          totalScore += Number(quiz.maxScore / BigInt(quiz.questions.length));
        } else {
          totalScore += Math.floor(quiz.maxScore / quiz.questions.length);
        }
      }
    });

    if (typeof quiz.maxScore === "bigint") {
      totalScore =
        Number(totalScore) > Number(quiz.maxScore)
          ? Number(quiz.maxScore)
          : totalScore;
    } else {
      totalScore = Math.min(totalScore, quiz.maxScore);
    }
    setScore(totalScore);
    setQuizCompleted(true);
  };

  const handleSubmitScore = () => {
    onSubmit(quiz.id, score);
  };

  if (quizCompleted) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz Completed!</h2>
        <div className="mb-8">
          <p className="text-lg">
            Your Score: <span className="text-2xl font-bold text-green-500">{score}</span> out of {quiz.maxScore}
          </p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSubmitScore}
            className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
          >
            Submit Score
          </button>
          <button
            onClick={onBack}
            className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
          >
            Return to Quiz List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h2>
        <div className="text-gray-600">
          Question {currentQuestionIndex + 1} of {quiz.questions.length}
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</h3>
        <div className="flex flex-col gap-4">
          {currentQuestion.choices.map((choice, index) => (
            <button
              key={index}
              className="bg-gray-50 border border-gray-200 p-4 text-left rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => handleAnswer(choice)}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="text-sm bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 transition-colors"
        >
          Exit Quiz
        </button>
        <Timer key={currentQuestion.id} initialTime={15} onTimeout={handleTimeout} />
      </div>
    </div>
  );
}