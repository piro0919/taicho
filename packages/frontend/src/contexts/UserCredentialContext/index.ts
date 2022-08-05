import { InitAuth } from "next-firebase-authentication";
import { createContext } from "react";

export type UserCredentialValue = {
  userCredential?: InitAuth["userCredential"];
};

const UserCredentialContext = createContext<UserCredentialValue>({
  userCredential: undefined,
});

export default UserCredentialContext;
