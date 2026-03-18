import { Box, Container } from "@chakra-ui/react";
import { SlidesTablePage } from "./components/SlidesTablePage";

export default function App() {
  return (
    <Box minH="100vh" bg="gray.50" py={{ base: 6, md: 10 }}>
      <Container maxW="90rem">
        <SlidesTablePage />
      </Container>
    </Box>
  );
}
