import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
      },
    },
  },
  fonts: {
    heading: "'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
  },
  colors: {
    brand: {
      50: "#eef4ff",
      100: "#d6e4ff",
      200: "#adc9ff",
      300: "#84adff",
      400: "#5b92ff",
      500: "#326fff",
      600: "#1f57db",
      700: "#153fa7",
      800: "#0e2b73",
      900: "#081740",
    },
  },
});

export default theme;
