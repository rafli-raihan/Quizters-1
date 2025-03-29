import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

module {
    public class IdGenerator() {
        public func randomId(whatId : Text) : async Text {
            var timeSecs = Time.now() / 1_000_000_000;
            var timeMscs = Time.now() / 1_000_000;
            var timeStamp = timeSecs + timeMscs;

            return whatId # "-" # Int.toText(timeStamp);
        };
    };
};