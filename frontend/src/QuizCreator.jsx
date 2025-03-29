
import React, { useState } from "react"

export default function QuizCreator({ onSubmit, onCancel }) {
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    maxScore: 100,
  })
  const [questions, setQuestions] = useState([{ question: "", choices: ["", "", "", ""], rightAnswer: "" }])
  const [currentStep, setCurrentStep] = useState(0) // 0: quiz details, 1: questions
  const [errors, setErrors] = useState({})
  const handleQuizDataChange = (e) => {
    const { name, value } = e.target
    setQuizData({
      ...quizData,
      [name]: name === "maxScore" ? Number.parseInt(value, 10) : value,
    })
  }
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index][field] = value
    setQuestions(updatedQuestions)
  }
  const handleChoiceChange = (questionIndex, choiceIndex, value) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].choices[choiceIndex] = value
    setQuestions(updatedQuestions)
  }
  const handleRightAnswerSelect = (questionIndex, choiceIndex) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].rightAnswer = updatedQuestions[questionIndex].choices[choiceIndex]
    setQuestions(updatedQuestions)
  }
  const addQuestion = () => setQuestions([...questions, { question: "", choices: ["", "", "", ""], rightAnswer: "" }])
  const removeQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions]
      updatedQuestions.splice(index, 1)
      setQuestions(updatedQuestions)
    }
  }
  const validateQuizData = () => {
    const newErrors = {}
    if (!quizData.title.trim()) newErrors.title = "Title is required"
    if (!quizData.description.trim()) newErrors.description = "Description is required"
    if (isNaN(quizData.maxScore) || quizData.maxScore <= 0) newErrors.maxScore = "Max score must be a positive number"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const validateQuestions = () => {
    const newErrors = {}

    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[`question_${index}`] = "Question text is required"
      }

      q.choices.forEach((choice, choiceIndex) => {
        if (!choice.trim()) {
          newErrors[`choice_${index}_${choiceIndex}`] = "Choice cannot be empty"
        }
      })

      if (!q.rightAnswer) {
        newErrors[`rightAnswer_${index}`] = "Please select the correct answer"
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const handleNextStep = () => {
    if (validateQuizData()) setCurrentStep(1)
  }
  const handleSubmit = () => {
    if (validateQuestions())  onSubmit(quizData, questions)
  }
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create New Quiz</h2>

      {currentStep === 0 ? (
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
              Quiz Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={quizData.title}
              onChange={handleQuizDataChange}
              placeholder="Enter quiz title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={quizData.description}
              onChange={handleQuizDataChange}
              placeholder="Enter quiz description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
          </div>

          <div className="mb-8">
            <label htmlFor="maxScore" className="block text-gray-700 font-medium mb-2">
              Maximum Score
            </label>
            <input
              type="number"
              id="maxScore"
              name="maxScore"
              value={quizData.maxScore}
              onChange={handleQuizDataChange}
              min={1}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.maxScore && <div className="text-red-500 text-sm mt-1">{errors.maxScore}</div>}
          </div>
          <div className="flex justify-between">
            <button
              onClick={onCancel}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleNextStep}
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition-colors"
            >
              Next: Add Questions
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Add Questions</h3>
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-gray-50 p-5 rounded-lg mb-6 relative">
              <div className="font-semibold text-blue-500 mb-4">Question {qIndex + 1}</div>
              <div className="mb-4">
                <label htmlFor={`question_${qIndex}`} className="block text-gray-700 font-medium mb-2">
                  Question Text
                </label>
                <input
                  type="text"
                  id={`question_${qIndex}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                  placeholder="Enter question"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors[`question_${qIndex}`] && (
                  <div className="text-red-500 text-sm mt-1">{errors[`question_${qIndex}`]}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">Answer Choices</label>
                {q.choices.map((choice, cIndex) => (
                  <div key={cIndex} className="flex items-center mb-3 gap-3">
                    <input
                      type="text"
                      value={choice}
                      onChange={(e) => handleChoiceChange(qIndex, cIndex, e.target.value)}
                      placeholder={`Choice ${cIndex + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="flex items-center whitespace-nowrap">
                      <input
                        type="radio"
                        name={`rightAnswer_${qIndex}`}
                        checked={q.rightAnswer === choice && choice !== ""}
                        onChange={() => handleRightAnswerSelect(qIndex, cIndex)}
                        disabled={!choice}
                        className="mr-2"
                      />
                      Correct
                    </label>
                    {errors[`choice_${qIndex}_${cIndex}`] && (
                      <div className="text-red-500 text-sm">{errors[`choice_${qIndex}_${cIndex}`]}</div>
                    )}
                  </div>
                ))}
                {errors[`rightAnswer_${qIndex}`] && (
                  <div className="text-red-500 text-sm">{errors[`rightAnswer_${qIndex}`]}</div>
                )}
              </div>
              {questions.length > 1 && (
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="absolute top-3 right-3 bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}
          <button
            onClick={addQuestion}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors mb-8"
          >
            + Add Another Question
          </button>
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(0)}
              className="bg-gray-500 text-white py-2 px-6 rounded-md hover:bg-gray-600 transition-colors"
            >
              Back to Quiz Details
            </button>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition-colors"
            >
              Create Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

