import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Types "types";
import IdGenerator "id_generator";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Error "mo:base/Error";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

module {
    public class QuestionsManager(idGenerator : IdGenerator.IdGenerator) {
        private var questions = HashMap.HashMap<Text, Types.Question>(0, Text.equal, Text.hash); 

        public func getQuestion(questionId : Text) : ?Types.Question {
            return questions.get(questionId);
        };
        public func getQuizQuestions(quizId : Text) : [Types.Question] {
            return Iter.toArray(
                Iter.filter(
                    questions.vals(),
                    func(q : Types.Question) : Bool {
                        return q.quizId == quizId;
                    }
                )
            );
        };
    };
};