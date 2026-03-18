import {
  Button,
  HStack,
  Select,
  Spacer,
  Text,
} from "@chakra-ui/react";

type Props = {
  page: number;
  pageCount: number;
  total: number;
  count: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function SlidesPagination({
  page,
  pageCount,
  total,
  count,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const start = total === 0 ? 0 : page * pageSize + 1;
  const end = total === 0 ? 0 : start + count - 1;

  return (
    <HStack spacing={4} px={6} py={4} borderTopWidth="1px">
      <HStack spacing={2}>
        <Text fontSize="sm" color="gray.600">
          Rows per page
        </Text>
        <Select
          value={pageSize}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          w="5.5rem"
          size="sm"
        >
          {[5, 10, 25, 50].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </Select>
      </HStack>
      <Text fontSize="sm" color="gray.600">
        Showing {start}-{end} of {total}
      </Text>
      <Spacer />
      <HStack>
        <Button size="sm" onClick={() => onPageChange(page - 1)} isDisabled={page === 0}>
          Previous
        </Button>
        <Text fontSize="sm" minW="6rem" textAlign="center">
          Page {page + 1} / {pageCount}
        </Text>
        <Button
          size="sm"
          onClick={() => onPageChange(page + 1)}
          isDisabled={page + 1 >= pageCount}
        >
          Next
        </Button>
      </HStack>
    </HStack>
  );
}
