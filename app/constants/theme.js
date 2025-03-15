export const COLORS = {
  primary: "#8dbbb8", //
  secondary: "#eaaeb2",
  background: "#f0e8e1",
  accent: "#32745c",

  //state
  success: "#32745c",
  error: "#e85c5c",
  warning: "#f3a469",

  //TEXT/border
  text: "#444444",
  textLight: "#777777",
  border: "#d3d3d3",

  white: "#ffffff",
  black: "#333333",
  like: "#eaaeb2",
  primaryTransparent: "rgba(141, 187, 184, 0.1)",
  secondaryTransparent: "rgba(234, 174, 178, 0.1)",
};

export const FONTS = {
  regular: {
    fontWeight: "normal",
  },
  medium: {
    fontWeight: "500",
  },
  bold: {
    fontWeight: "bold",
  },
  extraBold: {
    fontWeight: "800",
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 26,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 6,
  },
};

const theme = { COLORS, FONTS, SHADOWS };

export default theme;
