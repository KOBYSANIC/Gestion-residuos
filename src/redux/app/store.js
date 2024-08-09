import { configureStore } from "@reduxjs/toolkit";

import sidebarReducer from "../features/sidebarSlice";
import eventReducer from "../features/eventSlice";
import modalEventSlice from "../features/modalEventSlice";
import categoryReducer from "../features/categorySlice";
import brandReducer from "../features/brandSlice";
import variantReducer from "../features/variantSlice";
import productReducer from "../features/productSlice";
import orderSlice from "../features/orderSlice";
import modalOrderSlice from "../features/modalOrderSlice";

// 
import productoSlice from "../features/productoSlice";
import categoriaSlice from "../features/categoriaSlice";
import marcaSlice from "../features/marcaSlice";
import plataformaSlice from "../features/plataformaSlice";
import monedaSlice from "../features/monedaSlice";
import bancoSlice from "../features/bancoSlice";
import ventaSlice from "../features/ventaSlice";
import tokenSlice from "../features/tokenSlice";
import codigoSlice from "../features/codigoSlice";
import carruselSlice from "../features/carruselSlice";
import preguntaSlice from "../features/preguntaSlice";
import userReducer from "../features/userSlice";
import metodosPagoSlice from "../features/metodosPagoSlice";
import solicitudReducer from "../features/solicitudSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    event: eventReducer,
    modalEvent: modalEventSlice,
    modalOrder: modalOrderSlice,
    category: categoryReducer,
    brand: brandReducer,
    variant: variantReducer,
    product: productReducer,
    order: orderSlice,

    // 
    producto: productoSlice,
    marca: marcaSlice,
    categoria: categoriaSlice,
    moneda: monedaSlice,
    banco: bancoSlice,
    venta: ventaSlice,
    token: tokenSlice,
    codigo: codigoSlice,
    carrusel: carruselSlice,
    pregunta: preguntaSlice,
    user: userReducer,
    solicitud: solicitudReducer,
    plataforma: plataformaSlice,
    metodosPago: metodosPagoSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
