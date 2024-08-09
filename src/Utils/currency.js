export const formatCurrency = (value) => {
  // Crear formateador
  const formatter = new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value); //$2,500.00
};
