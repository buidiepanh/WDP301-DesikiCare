import {
  auth,
  provider as googleProvider,
  facebookProvider,
} from "../config/firebase";
import { signInWithPopup } from "firebase/auth";

export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
};

export const loginWithFacebook = async () => {
  const result = await signInWithPopup(auth, facebookProvider);
  return result.user;
};

export { auth };
