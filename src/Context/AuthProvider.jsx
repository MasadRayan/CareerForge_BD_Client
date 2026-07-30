import { createContext, useContext, useEffect, useState } from "react";
import {
  onIdTokenChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import auth from "../Firebase/firebase.init";
import { AuthContext } from "./AuthContext";

export { AuthContext };
export { default as useAuth } from "../Hooks/useAuth";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const gitHubProvider = new GithubAuthProvider();

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false),
    );
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false),
    );
  };

  const updateUser = (data) => {
    return updateProfile(auth.currentUser, data);
  };

  const googleSignIn =() => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }

    const gitHubSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, gitHubProvider);
    }

  const logOut = () => {
    setLoading(true);
    return signOut(auth).finally(() => setLoading(false));
  };

  const authData = {
    user,
    loading,
    createUser,
    signIn,
    updateUser,
    googleSignIn,
    gitHubSignIn,
    logOut,
    setUser,
    setLoading,
  };

  return <AuthContext value={authData}>{children}</AuthContext>;
};

export default AuthProvider;
