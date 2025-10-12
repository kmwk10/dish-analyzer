import { Card, CardBody, Box } from "@chakra-ui/react";
import { useState } from "react";
import ToggleCards from "../components/ToggleCards";

export default function DishesPage() {
  const [selected, setSelected] = useState("Мои блюда");

  return (
    <Box margin="2vh 10vw">
      <ToggleCards option1={"Мои блюда"} option2={"Все блюда"} onChange={setSelected}/>
      <Card>
        <CardBody>
          Dishes Page. Выбрано: {selected}
        </CardBody>
      </Card>
    </Box>
  );
}
