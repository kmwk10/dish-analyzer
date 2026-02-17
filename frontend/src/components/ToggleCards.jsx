import { Flex, Card, CardBody, Text } from "@chakra-ui/react";

export default function ToggleCards({ size="md", option1, option2, value, onChange }) {
  const style = {
    height: size === "md" ? "3rem" : "2.5rem",
    fontSize: size === "md" ? "xl" : "md"
  };

  const handleClick = (option) => {
    if (onChange) onChange(option);
  };

  return (
    <Flex width="100%" height={style.height} margin="3vh 0">
      <Card
        flex="1"
        cursor="pointer"
        backgroundColor={value === option1 ? "purple.500" : "white"}
        color={value === option1 ? "white" : "black"}
        borderTopRightRadius="0"
        borderBottomRightRadius="0"
        justifyContent="center"
        onClick={() => handleClick(option1)}
      >
        <CardBody>
          <Text fontSize={style.fontSize}>{option1}</Text>
        </CardBody>
      </Card>

      <Card
        flex="1"
        cursor="pointer"
        backgroundColor={value === option2 ? "purple.500" : "white"}
        color={value === option2 ? "white" : "black"}
        borderTopLeftRadius="0"
        borderBottomLeftRadius="0"
        justifyContent="center"
        onClick={() => handleClick(option2)}
      >
        <CardBody>
          <Text fontSize={style.fontSize}>{option2}</Text>
        </CardBody>
      </Card>
    </Flex>
  );
}
