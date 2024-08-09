import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState, useEffect } from "react";

export default function useGetCollection(collection_name, addLimit = false) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!collection_name) {
          setData([]);
          setLoading(false);
          return;
        }

        const categoriesCollection = collection(db, collection_name);

        const q = addLimit
          ? query(categoriesCollection, where("active", "==", true), limit(10))
          : query(categoriesCollection, where("active", "==", true));

        const categoriesSnapshot = await getDocs(q);

        if (categoriesSnapshot.empty) {
          setData([]);
          return;
        }

        const collectionData = categoriesSnapshot.docs.map((doc) => ({
          conversion: doc.data().conversion,
          nombre_moneda_conversion: doc.data().nombre_moneda_conversion,
          siglas_moneda_conversion: doc.data().siglas_moneda_conversion,
        }));

        setData(collectionData);
      } catch (error) {
        console.error("Error in useGetCollection:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collection_name, addLimit]);

  return { dataCollection: data, loading };
}
