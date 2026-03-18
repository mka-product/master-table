import {
  Box,
  Divider,
  Flex,
  Tag,
  HStack,
  Text,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Stack,
} from "@chakra-ui/react";
import {
  CheckCircleIcon,
  WarningIcon,
  TimeIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import type { StatusSummary, UiResultStatus } from "../types/slides";

const STATUS_META: Record<
  UiResultStatus,
  {
    label: string;
    colorScheme: "green" | "orange" | "yellow" | "red";
    icon: typeof CheckCircleIcon;
  }
> = {
  success: { label: "Success", colorScheme: "green", icon: CheckCircleIcon },
  processing: { label: "Processing", colorScheme: "orange", icon: TimeIcon },
  pending: { label: "Pending", colorScheme: "yellow", icon: WarningIcon },
  error: { label: "Error", colorScheme: "red", icon: WarningTwoIcon },
};

type Props = {
  summary: StatusSummary;
};

export function StatusSummaryCell({ summary }: Props) {
  return (
    <Flex gap={2} align="center" wrap="nowrap" whiteSpace="nowrap">
      {(Object.keys(STATUS_META) as UiResultStatus[]).map((status) => {
        if (status === "pending") {
          return null;
        }

        const count = summary[status];
        const details = summary.details[status];
        const Icon = STATUS_META[status].icon;

        return (
          <Popover key={status} trigger="hover" placement="top-start" openDelay={150}>
            <PopoverTrigger>
              <Tag
                colorScheme={STATUS_META[status].colorScheme}
                borderRadius="full"
                px={3}
                py={1}
                cursor="default"
              >
                <HStack spacing={1.5}>
                  <Icon boxSize={3.5} />
                  <Text fontSize="sm" fontWeight="semibold">
                    {count}
                  </Text>
                </HStack>
              </Tag>
            </PopoverTrigger>
            <Portal>
              <PopoverContent w="20rem" _focus={{ boxShadow: "lg" }} zIndex={1600}>
                <PopoverArrow />
                <PopoverHeader fontWeight="semibold">
                  {STATUS_META[status].label} analysis
                </PopoverHeader>
                <PopoverBody>
                  {details.length === 0 ? (
                    <Text fontSize="sm" color="gray.500">
                      No matching products
                    </Text>
                  ) : (
                    <Stack spacing={2}>
                      {details.map((detail, index) => (
                        <Box key={`${detail.productName}-${detail.analysisDate ?? index}`}>
                          <Flex justify="space-between" gap={3} align="flex-start">
                            <Text fontSize="sm" fontWeight="medium">
                              {detail.productName}
                            </Text>
                            <Text fontSize="xs" color="gray.500" textAlign="right">
                              {detail.analysisDate ?? "Date unavailable"}
                            </Text>
                          </Flex>
                          {index < details.length - 1 ? <Divider mt={2} /> : null}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </PopoverBody>
              </PopoverContent>
            </Portal>
          </Popover>
        );
      })}
    </Flex>
  );
}
