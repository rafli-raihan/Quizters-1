import React from "react";
export default function QuizList({ quizzes, onSelectQuiz, onCreateQuiz, user, onDeleteQuiz }) {
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Quizzes Available</h2>
        <p className="text-gray-600 mb-6">Be the first to create a quiz!</p>
        <button
          onClick={onCreateQuiz}
          className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
        >
          Create Quiz
        </button>
      </div>
    );
  }
  
  const handleDeleteClick = (e, quizId) => {
    e.stopPropagation(); // Prevent triggering the parent onClick
    onDeleteQuiz(quizId);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Quizzes</h2>
        <button
          onClick={onCreateQuiz}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
        >
          Create Quiz
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-gray-50 p-5 rounded-lg shadow-sm cursor-pointer hover:translate-y-[-5px] hover:shadow-md transition-all relative"
            onClick={() => onSelectQuiz(quiz)}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
            <p className="text-gray-600 mb-4">{quiz.description}</p>
            <div className="flex justify-between text-sm text-gray-500">
              <span>{quiz.questions?.length || 0} questions</span>
            </div>
            {user && user.id?.toString() === quiz.owner?.toString() && (
              <div className="absolute top-2 right-2 flex gap-2">
                <div className="bg-blue-500 text-white text-xs py-1 px-2 rounded-full">
                  You created this
                </div>
                <button
                  onClick={(e) => handleDeleteClick(e, quiz.id)}
                  className="bg-red-500 text-white text-xs py-1 px-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}