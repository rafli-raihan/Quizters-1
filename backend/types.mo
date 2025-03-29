import HashMap "mo:base/HashMap";
import Time "mo:base/Time";
import Principal "mo:base/Principal";

module {
    public type User = {
        id : Principal;
        username : Text;
        createdAt : Time.Time;
        updatedAt : Time.Time;
    };
    public type Quiz = {
        id : Text;
        title : Text;
        description : Text;
        owner : Principal;
        questions : [Question]; 
        maxScore : Int;
        createdAt : Time.Time;
        updatedAt : Time.Time;
    };
    public type Question = {
        id : Text;
        quizId : Text;
        question : Text;
        choices : [Text]; 
        rightAnswer : Text;
        createdAt : Time.Time;
        updatedAt : Time.Time;
    };
    public type UserQuizScore = {
        id : Text;
        userId : Principal;
        quizId : Text;
        score : Int;
        createdAt : Time.Time;
        updatedAt : Time.Time;
    };
};