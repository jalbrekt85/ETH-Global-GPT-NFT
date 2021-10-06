import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const fonts = { mono: `'Menlo', monospace` };

const breakpoints = createBreakpoints({
  sm: "40em",
  md: "52em",
  lg: "64em",
  xl: "80em",
});

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};
// 3. extend the theme
const theme = extendTheme({ config });

export default theme;
