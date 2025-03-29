import Time "mo:base/Time";
import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Iter "mo:base/Iter";
import Types "types";

module {
    public class UserManager() {
        private var users = HashMap.HashMap<Principal, Types.User>(0, Principal.equal, Principal.hash);

        public func createUser(caller : Principal, username : Text) : async Principal {
            let user : Types.User = {
                id = caller;
                username = username;
                createdAt = Time.now();
                updatedAt = Time.now();
            };
            users.put(caller, user);
            return caller;
        };
        public func getUser(id : Principal) : ?Types.User {
            return users.get(id);
        };
        public func getAllUsers() : [Types.User] {
            return Iter.toArray(users.vals());
        };
    };
};