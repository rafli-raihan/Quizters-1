import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Int";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Types "types";
import IdGenerator "id_generator";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Result "mo:base/Result";

module {
    public class QuizzesManager(idGenerator : IdGenerator.IdGenerator) {
        private var quizzes = HashMap.HashMap<Text, Types.Quiz>(0, Text.equal, Text.hash);

        public func createQuiz(title : Text, description : Text, maxScore : Int, owner : Principal) : async Text {
            let quizId = await idGenerator.randomId("qzs");
            let quiz : Types.Quiz = {
                id = quizId;
                title = title;
                description = description;
                owner = owner;
                questions = []; 
                maxScore = maxScore;
                createdAt = Time.now();
                updatedAt = Time.now();
            };
            quizzes.put(quizId, quiz);
            return quizId;
        };
        public func addQuestion(quizId : Text, question : Text, choices : [Text], rightAnswer : Text) : async Text {
            switch (quizzes.get(quizId)) {
                case (?quiz) {
                    let questionId = await idGenerator.randomId("qst");
                    let q : Types.Question = {
                        id = questionId;
                        quizId = quizId;
                        question = question;
                        choices = choices;
                        rightAnswer = rightAnswer;
                        createdAt = Time.now();
                        updatedAt = Time.now();
                    };

                    let updatedQuiz : Types.Quiz = {
                        id = quiz.id;
                        title = quiz.title;
                        description = quiz.description;
                        owner = quiz.owner;
                        questions = Array.append(quiz.questions, [q]);
                        maxScore = quiz.maxScore;
                        createdAt = quiz.createdAt;
                        updatedAt = Time.now();
                    };
                    quizzes.put(quizId, updatedQuiz);
                    return questionId;
                };
                case null { return "Error" };
            };
        };
        public func getQuiz(quizId : Text) : ?Types.Quiz {
            return quizzes.get(quizId);
        };
        public func getAllQuizzes() : [Types.Quiz] {
            return Iter.toArray(quizzes.vals());
        };
        public func deleteQuiz(quizId : Text, caller : Principal) : async Result.Result<(), Text> {
            switch (quizzes.get(quizId)) {
                case (null) {
                    return #err("Quiz not found");
                };
                case (?quiz) {
                    if (Principal.equal(caller, quiz.owner)) {
                        quizzes.delete(quizId);
                        return #ok();
                    } else {
                        return #err("Unauthorized: Only the quiz owner can delete this quiz");
                    };
                };
            };
        };
    };
};