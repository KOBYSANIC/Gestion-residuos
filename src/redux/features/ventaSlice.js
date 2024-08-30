// redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// config
import { db } from "../../firebase/config";

// firebase
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

// toast
import toast from "react-hot-toast";

import { statusText } from "../../Utils/functions";
import ExcelJS from "exceljs";
import moment from "moment";
// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (ventasCollection, search, sort = "desc") => {
  return query(
    ventasCollection,
    where("active", "==", true),
    orderBy("fecha_recoleccion", sort),
    limit(10)
  );
};

const parceDate = (date, fecha_fin = false) => {
  if (fecha_fin) {
    return date + " " + "23:59:59";
  } else {
  }
  return date + " " + "00:00:00";
};

const getQueryFilter = (ventasCollection, search, filter, sort = "desc") => {
  const q = search
    ? query(
        ventasCollection,
        where("numero_orden", ">=", search.toLowerCase()),
        where("numero_orden", "<=", search.toLowerCase() + "\uf8ff"),
        filter?.order_state && filter?.order_state?.value !== ""
          ? where("estado", "==", filter?.order_state?.value)
          : where("active", "==", true),
        filter?.id_user !== "" && filter?.id_user?.id !== ""
          ? where("usuario.uid", "==", filter?.id_user?.id)
          : where("active", "==", true),
        orderBy("numero_orden", sort),
        limit(10)
      )
    : query(
        ventasCollection,
        where("active", "==", true),
        filter?.order_state && filter?.order_state?.value !== ""
          ? where("estado", "==", filter.order_state.value)
          : where("active", "==", true),
        filter?.fecha_inicio !== ""
          ? where("fecha_recoleccion", ">=", filter?.fecha_inicio)
          : where("active", "==", true),
        filter?.fecha_fin !== ""
          ? where("fecha_recoleccion", "<=", filter?.fecha_fin)
          : where("active", "==", true),
        orderBy("fecha_recoleccion", sort),
        limit(10)
      );

  return q;
};

// Funcion para obtener todos los ventas de la base de datos
export const getVentas = createAsyncThunk(
  "venta/getVentas",
  async (
    { isNextPage, isPrevPage, search = "", filter = {} },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const ventas = [];

      const ventasCollection = collection(db, "residuos");
      const { lastVisible, firstVisible, ventas: _ventas } = getState().venta;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q =
          Object.keys(filter).length > 0 && filter
            ? getQueryFilter(ventasCollection, search, filter)
            : getQuery(ventasCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_ventas.length === 0 && isPrevPage) {
        const q =
          Object.keys(filter).length > 0 && filter
            ? getQueryFilter(ventasCollection, search, filter, "desc")
            : getQuery(ventasCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _ventas.length !== 0) {
        const order_by = !isNextPage ? "asc" : "desc";
        // Construct a new query starting at this document,
        // get the next or prev 10 ventas.
        const next =
          Object.keys(filter).length > 0 && filter
            ? query(
                ventasCollection,
                where("active", "==", true),
                filter?.order_state && filter?.order_state.value
                  ? where("status", "==", filter.order_state.value)
                  : where("active", "==", true),
                filter?.id_user !== "" && filter?.id_user?.id !== ""
                  ? where("usuario.uid", "==", filter.id_user.id)
                  : where("active", "==", true),
                filter?.fecha_inicio
                  ? where("created_at", ">=", parceDate(filter?.fecha_inicio))
                  : where("active", "==", true),
                filter?.fecha_fin
                  ? where(
                      "created_at",
                      "<=",
                      parceDate(filter?.fecha_fin, true)
                    )
                  : where("active", "==", true),
                orderBy("created_at", order_by),
                startAfter(isNextPage ? lastVisible : firstVisible),
                limit(10)
              )
            : query(
                ventasCollection,
                where("active", "==", true),
                orderBy("created_at", order_by),
                startAfter(isNextPage ? lastVisible : firstVisible),
                limit(10)
              );

        querySnapshot = await getDocs(next);
      }

      if (querySnapshot.docs.length > 0) {
        let lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        let firstDoc = querySnapshot.docs[0];

        if (isNextPage || isPrevPage) {
          lastDoc =
            querySnapshot.docs[isNextPage ? querySnapshot.docs.length - 1 : 0];
          firstDoc =
            querySnapshot.docs[isNextPage ? 0 : querySnapshot.docs.length - 1];
        }

        dispatch(setLastVisible(lastDoc));
        dispatch(setFirstVisible(firstDoc));
      }

      if (isPrevPage) querySnapshot = querySnapshot.docs.reverse();

      querySnapshot.forEach((doc) => {
        ventas.push({ ...doc.data(), id: doc.id });
      });
      return ventas;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

const ExcelDownloadButton = async (data) => {
  // Crear un nuevo workbook y una nueva hoja
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("My Sheet");

  // Agregar columnas al worksheet
  worksheet.columns = [
    {
      header: "Fecha de recolección solicitada",
      key: "fecha_recoleccion",
      width: 20,
    },
    {
      header: "Fecha de recolección realizada",
      key: "fecha_recoleccion_realizada",
      width: 20,
    },
    { header: "Comentario cliente", key: "comentario_cliente", width: 30 },
    { header: "Ubicación", key: "ubicacion", width: 30 },
    { header: "Ruta Asignada", key: "ruta", width: 30 },
    { header: "Cantidad", key: "cantidad", width: 5 },
    { header: "Estado", key: "estado", width: 20 },
    {
      header: "Comentario reciclador",
      key: "comentario_reciclador",
      width: 30,
    },
    { header: "Monto cobrado", key: "monto_cobrado", width: 10 },
  ];

  // Agregar filas con datos
  data?.map((venta) => {
    worksheet.addRow({
      fecha_recoleccion: venta?.fecha_recoleccion,
      fecha_recoleccion_realizada: venta?.fecha_recoleccion_reciclador,
      comentario_cliente: venta?.comentario,
      ubicacion: venta?.ubicacion,
      ruta: `${venta?.ruta?.nombre_ruta || ""} - ${
        venta?.ruta?.vehiculo_id?.placa || ""
      }`,
      cantidad: venta?.residuos?.length || 0,
      estado: statusText[venta?.estado],
      comentario_reciclador: venta?.comentario_reciclador,
      monto_cobrado: venta?.monto_cobrado,
    });
  });

  worksheet.getRow(1).font = { bold: true };

  // Generar el archivo Excel
  const buffer = await workbook.xlsx.writeBuffer();

  // Crear un enlace temporal para descargar el archivo
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);

  // Crear un enlace de descarga y hacer clic en él automáticamente
  const link = document.createElement("a");
  link.href = url;
  link.download = `${moment
    .utc()
    .format("YYYY-MM-DD_HH:mm:ss")}_reporte_recolecciones.xlsx`;
  link.click();

  // Limpiar el objeto URL después de descargar
  URL.revokeObjectURL(url);
};
// Funcion para obtener todos los ventas de la base de datos
export const generateExcel = createAsyncThunk(
  "venta/generateExcel",
  async (
    { isNextPage, isPrevPage, search = "", filter = {} },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const ventas = [];

      const ventasCollection = collection(db, "residuos");

      let querySnapshot = null;

      querySnapshot = await getDocs(
        query(
          ventasCollection,
          where("active", "==", true),
          orderBy("fecha_recoleccion", "desc")
        )
      );

      querySnapshot.forEach((doc) => {
        ventas.push({ ...doc.data(), id: doc.id });
      });

      await ExcelDownloadButton(ventas);
      return ventas;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const getOrder = createAsyncThunk(
  "venta/getOrder",
  async (order_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "residuos", order_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró el residuo");
        return rejectWithValue("No se encontró el residuo");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeState = createAsyncThunk(
  "venta/changeState",
  async (
    {
      id,
      status,
      monto_cobrado = 0,
      comentario_reciclador = "",
      fecha_recoleccion_reciclador = "",
      ruta = "",
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const docRef = doc(db, "residuos", id);

      const pregunta = updateDoc(doc(db, "residuos", id), {
        estado: status,
        comentario_reciclador,
        monto_cobrado,
        fecha_recoleccion_reciclador,
        ruta,
      });

      await toast.promise(pregunta, {
        loading: "Actualizando...",
        success: "Estado de la recolección actualizado",
        error: "Error al editar la recolección",
      });

      dispatch(resetPage());
      dispatch(getVentas({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

// -----------------------------------------Slice-----------------------------------------
export const ventaSlice = createSlice({
  name: "venta",
  initialState: {
    ventas: [],
    venta_selected: null,
    error: null,
    loading_venta: false,
    loading_excel: false,
    loading_actions: false,
    firstVisible: null,
    lastVisible: null,
    page: 1,
  },
  reducers: {
    nextPage: (state) => {
      state.page += 1;
    },
    prevPage: (state) => {
      state.page -= 1;
    },

    resetPage: (state) => {
      state.page = 1;
    },

    setFirstVisible: (state, action) => {
      state.firstVisible = action.payload;
    },
    setLastVisible: (state, action) => {
      state.lastVisible = action.payload;
    },
  },

  extraReducers: {
    [getVentas.pending]: (state) => {
      state.loading_venta = true;
    },
    [getVentas.fulfilled]: (state, action) => {
      state.loading_venta = false;
      state.ventas = action.payload;
    },
    [getVentas.rejected]: (state, action) => {
      state.loading_venta = false;
      state.error = action.payload;
    },

    [generateExcel.pending]: (state) => {
      state.loading_excel = true;
    },
    [generateExcel.fulfilled]: (state, action) => {
      state.loading_excel = false;
      // state.ventas = action.payload;
    },
    [generateExcel.rejected]: (state, action) => {
      state.loading_excel = false;
      state.error = action.payload;
    },

    [changeState.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [changeState.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [changeState.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },
    [getOrder.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getOrder.fulfilled]: (state, action) => {
      state.loading_actions = false;
      state.venta_selected = action.payload;
    },
    [getOrder.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  nextPage,
  prevPage,
  resetPage,
  setFirstVisible,
  setLastVisible,
} = ventaSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectVentas = (state) => state.venta.ventas;
export const selectLoadingVentas = (state) => state.venta.loading_venta;
export const selectLoadingExcel = (state) => state.venta.loading_excel;
export const selectPage = (state) => state.venta.page;
export const selectVentaSelected = (state) => state.venta.venta_selected;
export const selectLoadingActions = (state) => state.venta.loading_actions;

export default ventaSlice.reducer;
