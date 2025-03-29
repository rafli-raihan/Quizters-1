import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Types "types";
import IdGenerator "id_generator";
import Text "mo:base/Text";

module {
    public class ScoreManager(idGenerator : IdGenerator.IdGenerator) {
        private var scores = HashMap.HashMap<Text, Types.UserQuizScore>(0, Text.equal, Text.hash);
        public func submitScore(userId : Principal, quizId : Text, score : Int) : async Text {
            let scoreId = await idGenerator.randomId("rte");

            let s : Types.UserQuizScore = {
                id = scoreId;
                userId = userId; 
                quizId = quizId;
                score = score;
                createdAt = Time.now();
                updatedAt = Time.now();
            };
            scores.put(scoreId, s);
            return scoreId;
        };
        public func getUserScore(userId : Principal, quizId : Text) : ?Types.UserQuizScore {
            for ((_, s) in scores.entries()) {
                if (s.userId == userId and s.quizId == quizId) {
                    return ?s;
                };
            };
            return null;
        };
        public func getAllScores() : [Types.UserQuizScore] {
            return Iter.toArray(scores.vals());
        };
    };
};