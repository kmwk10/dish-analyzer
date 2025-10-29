import { Flex, Card, CardBody, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function ToggleCards({ size="md", option1, option2, onChange }) {
  const [selected, setSelected] = useState(option1);

  const handleClick = (option) => {
    setSelected(option);
    if (onChange) onChange(option);
  };

  const style = {
    height: size === "md" ? "3rem" : "2.5rem",
    fontSize: size === "md" ? "xl" : "md"
  };

  return (
    <Flex width="100%" height={style.height} margin="3vh 0">
      <Card
        flex="1"
        cursor="pointer"
        backgroundColor={selected === option1 ? "purple.500" : "white"}
        color={selected === option1 ? "white" : "black"}
        borderTopRightRadius="0"
        borderBottomRightRadius="0"
        justifyContent="center"
        onClick={() => handleClick(option1)}
      >
        <CardBody>
            <Text fontSize={style.fontSize}>
                {option1}
            </Text>
        </CardBody>
      </Card>

      <Card
        flex="1"
        cursor="pointer"
        colorPalette="purple"
        backgroundColor={selected === option2 ? "purple.500" : "white"}
        color={selected === option2 ? "white" : "black"}
        borderTopLeftRadius="0"
        borderBottomLeftRadius="0"
        justifyContent="center"
        onClick={() => handleClick(option2)}
      >
        <CardBody>
            <Text fontSize={style.fontSize}>
                {option2}
            </Text>
        </CardBody>
      </Card>
    </Flex>
  );
}
