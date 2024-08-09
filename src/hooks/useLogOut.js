import { doc, getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { auth, db, onAuthStateChanged } from "../firebase/config";
import { login, logout, selectUser } from "../redux/features/userSlice";

export const useLogOut = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const verifiyUser = () => {
    onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        // user is logged in, send the user's details to redux, store the current user in the state
        const docRef = doc(db, "users", userAuth.uid);

        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          if (docSnap.data().active) {
            dispatch(
              login({
                email: userAuth.email,
                uid: userAuth.uid,
                displayName: userAuth.displayName,
                photoUrl: userAuth.photoURL,
                ...docSnap.data(),
                // id: docSnap.id,I
              })
            );
          } else {
            auth.signOut();
            dispatch(logout());
          }
        } else {
          auth.signOut();
          dispatch(logout());
        }
      }
    });
  };

  const logOut = () => {
    // dispatch to the store with the logout action
    dispatch(logout());
    // sign out function from firebase
    auth.signOut();
  };

  return { user, logOut, verifiyUser };
};
