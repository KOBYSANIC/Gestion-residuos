export const convertSnakeToTitle = (snakeCaseText) => {
  const words = snakeCaseText.split("_"); // Divide el texto en palabras separadas por '_'
  const capitalizedFirstWord =
    words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase(); // Capitaliza la primera palabra
  const lowerCaseWords = words.slice(1).map((word) => word.toLowerCase()); // Convierte el resto de las palabras a minúscula
  return [capitalizedFirstWord, ...lowerCaseWords].join(" "); // Une las palabras con un espacio
};
