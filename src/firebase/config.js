import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";

import { v4 } from "uuid";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhtMoxGh3IuNxaHN0mruDFXlruy9HUpvQ",
  authDomain: "plataforma-de-residuos.firebaseapp.com",
  projectId: "plataforma-de-residuos",
  storageBucket: "plataforma-de-residuos.appspot.com",
  messagingSenderId: "250839218774",
  appId: "1:250839218774:web:8f94871729b864910719f7",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

const uploadFiles = async (files = [], folder_name = "", isUpdate = false) => {
  return Promise.all(
    files.map(async (image) => {
      // verify if the image is a string or a file
      if (typeof image === "string") return image;

      const storageRef = ref(storage, `${folder_name}/${v4()}`);
      const uploadTask = uploadBytes(storageRef, image);
      const snapshot = await uploadTask;
      const url = await getDownloadURL(snapshot.ref);

      return url;
    })
  );
};

const deleteFiles = async (files = [], folder_name = "") => {
  return Promise.all(
    files.map(async (image) => {
      // verify if the image is a string or a file
      if (typeof image === "string") {
        try {
          const storageRef = ref(storage, image);
          await deleteObject(storageRef);
          return image;
        } catch (error) {
          // if the image not exist in the storage, so do not delete
          console.log(error);
          return null;
        }
      }
    })
  );
};

export {
  app,
  db,
  auth,
  storage,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  uploadFiles,
  deleteFiles,
};
