import { Select, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

export default function ServingSelect({ mode, setMode, currentValue, handleServingInputChange }) {
  return (
    <>
      <Select
        size="sm"
        mb="0.5rem"
        width="fit-content"
        value={mode}
        onChange={(e) => setMode(e.target.value)}>
        <option value='servings'>Количество порций</option>
        <option value='serving_weight'>Вес порции</option>
      </Select>
      <InputGroup size="sm">
        <Input
          value={currentValue}
          onChange={handleServingInputChange}
          placeholder={mode === "servings" ? "Введите количество порций" : "Введите вес порции"}
          mb="1rem"
        />
        {mode === "serving_weight" && (
          <InputRightElement children="г" ml="1rem"/>
        )}
      </InputGroup>
    </>
  );
}
