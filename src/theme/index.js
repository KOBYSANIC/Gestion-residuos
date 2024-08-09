import { extendTheme } from "@chakra-ui/react";
import { Button } from "./components/button";
import { StepsTheme } from "chakra-ui-steps";

const CustomSteps = {
  ...StepsTheme,
  baseStyle: (props) => {
    return {
      ...StepsTheme.baseStyle(props),
      icon: {
        ...StepsTheme.baseStyle(props).icon,
      },
    };
  },
};

export const theme = extendTheme({
  colors: {
    brand: {
      black: "#161716",
      black_light: "#1B1C1B",
      primary: "#f5e619",
      secondary: "#19F575",
      error: "#F41213",
      white: "#fffdff",
      white_night: "#e0e0e0",
      gray: "#2b2b2b",
      gray_semilight: "#4c4c4c",
      gray_light: "#a9a9a9",
      gray2: "#DADADA",
      gray3: "#bfbfbf",
      warning: "#FFA113",
      success: "#18DF44",
      disabled: "#F4F4F4",
    },
    primary: {
      50: "#FFF6CE",
      100: "#FFEFA8",
      200: "#FFEA8A",
      300: "#FFE467",
      400: "#FFDE47",
      500: "#FBD62E",
      600: "#F2CD23",
      700: "#E9C315",
      800: "#D6AA0D",
      900: "#B98708",
    },
    secondary: {
      50: "#c1ffc8",
      100: "#a3dea9",
      200: "#3fff8f",
      300: "#19F575",
      400: "#14bb5b",
      500: "#032913",
    },
  },
  fonts: {
    heading: "font-family: 'Roboto', sans-serif;",
    body: "font-family: 'Roboto', sans-serif;",
  },
  components: {
    Button,
    Steps: CustomSteps,
  },

  shadows: {
    sidebar: "-5px 0px 20px 10px rgba(0, 0, 0, 0.05);",
    card: "0px 20px 50px 15px rgba(0, 0, 0, 0.05);",
    table: "0px 2px 10px 3px rgba(0, 0, 0, 0.04);",
    tab: "0px -10px 50px 15px rgba(0, 0, 0, 0.06);",
  },

  // custom padding
  space: {
    "2xl": "14.5rem",
    "3xl": "15.5rem",
  },

  // custom breakpoints
  breakpoints: {
    "2xl": "1536px",
    "3xl": "1800px",
  },
  styles: {
    global: {
      // html: {
      //   fontFamily: "sans-serif",
      // },
      body: {
        bg: "#161716",
        color: "#fffdff",
      },
    },
  },
});

export const margin_layout = {
  base: 5,
  lg: 16,
  xl: 20,
  "2xl": "2xl",
  "3xl": "3xl",
};
