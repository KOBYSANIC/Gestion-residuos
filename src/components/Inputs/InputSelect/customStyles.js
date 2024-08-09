import { theme } from "../../../theme";

export const customStyles = (error) => {
  if (error) {
    console.log();
  }

  const error_color = theme.colors.brand.error;
  const secondary_color = theme.colors.brand.secondary;
  const primary_color = theme.colors.brand.primary;
  const white = theme.colors.brand.white;
  const black = theme.colors.brand.black;
  const black_light = theme.colors.brand.black_light;
  const disabled_color = theme.colors.brand.gray_semilight;
  const gray_light = theme.colors.brand.gray_light;
  const gray_semilight = theme.colors.brand.gray_semilight;
  const border_color = error ? error_color : secondary_color;

  return {
    // menu
    menu: (base) => ({
      ...base,
      zIndex: 2,
    }),

    // menu list
    menuList: (styles) => ({
      ...styles,
      background: black_light,
      border: `1px solid ${gray_semilight}`,
      borderRadius: "4px",
    }),

    // option
    option: (provided, state) => {
      return {
        ...provided,
        color: state.isFocused ? black : white,
        backgroundColor: state.isFocused ? secondary_color : black_light,
        minHeight: "48px",
        paddingTop: "13px",
        ":active": {
          backgroundColor: primary_color,
        },
      };
    },

    // control
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isDisabled ? disabled_color : black_light,

      borderWidth: "1px",
      borderColor: state.isFocused || error ? border_color : gray_light,
      outline: state.isFocused || error ? `1px solid ${border_color}` : "none",
      minHeight: 48,
      minWidth: 300,
      boxShadow: "none",
      ":hover": {
        borderColor: state.isFocused || error ? border_color : gray_light,
      },
      transition: "all 0.2s",
    }),

    // multivalue
    multiValue: (styles, { data }) => {
      return {
        ...styles,

        backgroundColor: secondary_color, // the bg color behind icon
        color: black_light, // the text color
      };
    },
    multiValueLabel: (styles) => ({
      ...styles,
      color: black, // lable text color
      background: white, // lable bg behined selected
    }),
    multiValueRemove: (styles) => ({
      ...styles,
      ":hover": {
        backgroundColor: "#14bb5b", // on hover x bg color
        color: black, // on hover x icon color
      },
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = "opacity 300ms";
      const color = white;
      return { ...provided, opacity, transition, color };
    },
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: gray_light,
      };
    },
  };
};
