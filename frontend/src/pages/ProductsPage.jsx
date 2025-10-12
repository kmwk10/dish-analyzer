import { Card, CardBody, Box } from "@chakra-ui/react";
import { useState } from "react";
import ToggleCards from "../components/ToggleCards";

export default function ProductsPage() {
  const [selected, setSelected] = useState("Мои продукты");

  return (
    <Box margin="2vh 10vw">
      <ToggleCards option1={"Мои продукты"} option2={"Все продукты"} onChange={setSelected}/>
      <Card>
        <CardBody>
          Products Page. Выбрано: {selected}
        </CardBody>
      </Card>
    </Box>
  );
}
