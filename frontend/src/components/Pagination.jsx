import { Flex, IconButton, Tag } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

export default function Pagination({ page, setPage, itemsLength, limit }) {
  const isFirst = page === 1;
  const isLast = itemsLength < limit;

  return (
    <Flex justify="center" mt={4} gap={2}>
      <IconButton
        icon={<ArrowBackIcon />}
        disabled={isFirst}
        onClick={() => setPage(page - 1)}
      />
      <Tag
        w="2.5rem"
        h="2.5rem"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="md"
      >
        {page}
      </Tag>
      <IconButton
        icon={<ArrowForwardIcon />}
        disabled={isLast}
        onClick={() => setPage(page + 1)}
      />
    </Flex>
  );
}
