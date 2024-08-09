import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, deleteFiles, uploadFiles } from "../firebase/config";

/*
    nameCollection: nombre de la coleccion
    fieldCollection: campo de la coleccion
    newValue: nuevo valor del campo
    id: id del documento
*/
export const checkDuplicateValue = async (
  nameCollection,
  fieldCollection,
  newValue,
  id
) => {
  const productosQuery = query(
    collection(db, nameCollection),
    where(fieldCollection, "==", newValue),
    where("active", "==", true)
  );

  const productosSnapshot = await getDocs(productosQuery);

  return id
    ? productosSnapshot.docs.some(
        (doc) => doc[fieldCollection] !== newValue && doc.id !== id
      )
    : productosSnapshot.docs.some((doc) => doc[fieldCollection] !== newValue);
};

/*
    id: id del documento
    imageProduct: imagen del producto
    fieldCollection: campo de la coleccion
    collection: nombre de la coleccion
  */
export const validateImage = async (
  id,
  imageProduct,
  fieldCollection,
  collection
) => {
  const docRef = doc(db, collection, id);
  const docSnap = await getDoc(docRef);

  const currentImages = docSnap.data()[fieldCollection];

  const images_url = await uploadFiles(imageProduct, collection);

  if (images_url[0] != currentImages[0]) {
    await deleteFiles(currentImages, collection);
  }

  return images_url;
};
