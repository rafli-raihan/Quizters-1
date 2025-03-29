import Types "types";
import Quizzes "quizzes";
import Questions "questions";
import users "users";
import IdGenerator "id_generator";
import Scores "scores";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Result "mo:base/Result";

actor App {
    let idGenerator = IdGenerator.IdGenerator();
    let quizzesManager = Quizzes.QuizzesManager(idGenerator);
    let questionsManager = Questions.QuestionsManager(idGenerator);
    let scoreManager = Scores.ScoreManager(idGenerator);
    let userManager = users.UserManager();

    public shared ({ caller }) func createUser(username : Text) : async Principal {
        return await userManager.createUser(caller, username);
    };
    public shared ({ caller }) func createQuiz(title : Text, description : Text, maxScore : Int) : async Text {
        return await quizzesManager.createQuiz(title, description, maxScore, caller);
    };
    public shared ({ caller }) func addQuestion(quizId : Text, question : Text, choices : [Text], rightAnswer : Text) : async Text {
        return await quizzesManager.addQuestion(quizId, question, choices, rightAnswer);
    };
    public shared ({ caller }) func submitScore(quizId : Text, score : Nat) : async Text {
        return await scoreManager.submitScore(caller, quizId, score);
    };
    public shared query func getUser(id : Principal) : async ?Types.User {
        return userManager.getUser(id);
    };
    public shared query func getQuiz(quizId : Text) : async ?Types.Quiz {
        return quizzesManager.getQuiz(quizId);
    };
    public shared query func getAllQuizzes() : async [Types.Quiz] {
        return quizzesManager.getAllQuizzes();
    };
    public shared query func getAllUsers() : async [Types.User] {
        return userManager.getAllUsers();
    };
    public shared(msg) func deleteQuizById(quizId : Text) : async Result.Result<(), Text> {
        return await quizzesManager.deleteQuiz(quizId, msg.caller);
    };
};