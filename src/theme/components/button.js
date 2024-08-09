// You can also use the more specific type for
// a single part component: ComponentSingleStyleConfig
export const Button = {
  // The styles all button have in common
  baseStyle: {
    // fontWeight: "bold",
    // textTransform: "uppercase",
    borderRadius: "6px", // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "sm",
      px: 4,
      py: 3, // <-- py is short for paddingTop and paddingBottom
    },
    md: {
      fontSize: "md",
      px: 6,
      py: 4, // <-- these values are tokens from the design system
    },
  },
  // Two variants: outline and solid
  // variants: {
  //   outline: {
  //     border: "2px solid",
  //     borderColor: "purple.500",
  //     color: "blue",
  //   },
  //   solid: {
  //     bg: "brand.primary",
  //     color: "white",
  //   },
  // },
  // The default size and variant values
  // defaultProps: {
  //   size: "md",
  //   variant: "outline",
  // },
};
