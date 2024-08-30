const statusOrder = {
  0: { name: "Generado", color: "blue" },
  1: { name: "Recolectado", color: "purple" },
  2: { name: "Finalizado", color: "green" },
  3: { name: "Cancelado", color: "pink" },
  4: { name: "No recolectado", color: "red" },
};

export const statusText = {
  0: "Generado",
  1: "Recolectado",
  2: "Finalizado",
  3: "Cancelado",
  4: "No recolectado",
};

export const convertStatus = (status) => {
  return statusOrder[status];
};
