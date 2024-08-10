export const PROCESO = "1";
export const EN_RUTA = "2";
export const FINALIZADO = "3";
export const CANCELADO = "4";

export const PRECIO_BOLSA = 3;

export const ADMINISTRADOR = 1;
export const TRANSPORTISTA = 2;
export const CLIENTE = 3;

export const GENERADO = "1";
export const ENVIADO = "2";
export const ENTREGADO = "3";

export const SI_APILCA = "1";
export const NO_APILCA = "2";

export const GENERADO_RESIDUO = 0;
export const RECOLECTADO_RESIDUO = 1;
export const FINALIZADO_RESIDUO = 2;
export const CANCELADO_RESIDUO = 3;
export const NO_RECOLECTADO_RESIDUO = 4;

export const GENERADO_ORDER = 0;
export const PAGO_CONFIRMADO = 1;
export const ENVIADO_ORDER = 2;
export const COMPLETADO = 3;
export const ERROR_PAGO = 4;
export const CANCELADO_ORDER = 5;
export const COMPRA_FUERA_TIEMPO = 6;
export const COMPRA_DUPLICADA = 7;
export const PROMOCION_NO_DISPONIBLE = 8;
export const REEMBOLSO_SOLICITADO = 9;
export const REEMBOLSO_REALIZADO = 10;
export const REEMBOLSO_RECHAZADO = 11;
export const ARTICULO_NO_DISPONIBLE = 12;

export const status_order = [
  { value: "", label: "Todos" },
  { value: GENERADO_RESIDUO, label: "Generado" },
  { value: RECOLECTADO_RESIDUO, label: "Recolectado" },
  { value: FINALIZADO_RESIDUO, label: "Finalizado" },
  { value: CANCELADO_RESIDUO, label: "Cancelado" },
  { value: NO_RECOLECTADO_RESIDUO, label: "No recolectado" },
];

export const error_order = [
  { value: ERROR_PAGO, label: "Error en el pago" },
  { value: COMPRA_FUERA_TIEMPO, label: "Compra fuera de tiempo" },
  { value: COMPRA_DUPLICADA, label: "Compra duplicada" },
  { value: PROMOCION_NO_DISPONIBLE, label: "Promoción no disponible" },
  { value: ARTICULO_NO_DISPONIBLE, label: "Artículo no disponible" },
];

export const array_error_order = [
  ERROR_PAGO,
  COMPRA_FUERA_TIEMPO,
  COMPRA_DUPLICADA,
  PROMOCION_NO_DISPONIBLE,
  ARTICULO_NO_DISPONIBLE,
];

export const role_name = {
  [ADMINISTRADOR]: "Administrador",
  [TRANSPORTISTA]: "Transportista",
  [CLIENTE]: "Cliente",
};

export const event_states = [
  { value: "1", label: "Proceso" },
  { value: "2", label: "En ruta" },
  { value: "3", label: "Finalizado" },
];

export const event_pay = [
  { value: SI_APILCA, label: "Si Aplica" },
  { value: NO_APILCA, label: "No Aplica" },
];

export const event_state = [
  { value: PROCESO, label: "Proceso" },
  { value: EN_RUTA, label: "En ruta" },
  { value: FINALIZADO, label: "Finalizado" },
  { value: CANCELADO, label: "Cancelado" },
];

export const discount_state = [
  { value: 0, label: "Inactivo" },
  { value: 1, label: "Activo" },
];

export const order_state = [
  { value: GENERADO, label: "Generado" },
  { value: ENVIADO, label: "Enviado" },
  { value: ENTREGADO, label: "Entregado" },
  { value: CANCELADO, label: "Cancelado" },
];

export const document_info = {
  created_at: new Date(),
  updated_at: new Date(),
  active: true,
};

export const user_role = [
  { value: 1, label: "Administrador" },
  { value: 2, label: "Transportista" },
  { value: 3, label: "Cliente" },
];

export const user_role_select = {
  [1]: { value: 1, label: "Administrador" },
  [2]: { value: 2, label: "Transportista" },
  [3]: { value: 3, label: "Cliente" },
};

// user status
export const user_status = [
  { value: true, label: "Activo" },
  { value: false, label: "Inactivo" },
];

// select user status
export const user_status_select = {
  [true]: { value: true, label: "Activo" },
  [false]: { value: false, label: "Inactivo" },
};

// product status
export const product_status = [
  { value: true, label: "Si mostrar" },
  { value: false, label: "No mostrar" },
];

export const show_in_ecomerce = [
  { value: true, label: "Si mostrar" },
  { value: false, label: "No mostrar" },
];
