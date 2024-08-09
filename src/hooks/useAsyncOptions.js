import {
  //   addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
// import { isEmpty, isFinite } from "lodash";

import { db } from "../firebase/config";

export default function useAsyncOptions(
  collection_name,
  search_field_name = "name",
  active = true,
  extraOptions = []
) {
  const asyncOptions = async (search) => {
    try {
      if (!collection_name) {
        return [];
      }

      const categoriesCollection = collection(db, collection_name);
      const data = [];
      const q = search
        ? active
          ? query(
              categoriesCollection,
              where("active", "==", true),
              where(search_field_name, ">=", search.toLowerCase()),
              where(search_field_name, "<=", search.toLowerCase() + "\uf8ff"),
              limit(10)
            )
          : query(
              categoriesCollection,
              where(search_field_name, ">=", search.toLowerCase()),
              where(search_field_name, "<=", search.toLowerCase() + "\uf8ff"),
              limit(10)
            )
        : query(categoriesCollection, where("active", "==", true), limit(10));

      const categories = await getDocs(q);

      if (categories.empty) {
        return [];
      }

      categories.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });

      if (extraOptions.length === 0) return data;

      const dataExtraOptions = [
        ...extraOptions.map((option) => option),
        ...data,
      ];

      return dataExtraOptions;

      //   const _data = await api.get(collection_name, _params);
      //   if (_data && _data.results) return _data.results;
    } catch (e) {
      return [];
    }
  };

  return { asyncOptions };
}
