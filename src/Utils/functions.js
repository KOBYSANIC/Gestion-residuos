export const convertStatus = (status) => {
  const statusOrder = {
    0: { name: "Generado", color: "blue" },
    1: { name: "Pago Confirmado", color: "cyan" },
    2: { name: "Enviado", color: "purple" },
    3: { name: "Completado", color: "green" },
    4: { name: "Error en el pago", color: "red" },
    5: { name: "Cancelado", color: "pink" },
    6: { name: "Compra fuera de tiempo", color: "orange" },
    7: { name: "Compra duplicada", color: "yellow" },
    8: { name: "Promoción no disponible", color: "orange" },
    9: { name: "Reembolso solicitado", color: "orange" },
    10: { name: "Reembolsado", color: "teal" },
    11: { name: "Reembolso rechazado", color: "red" },
    12: { name: "Artículo no disponible", color: "orange" },
  };

  return statusOrder[status];
};
