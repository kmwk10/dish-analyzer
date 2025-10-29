import { Select, Box, Flex, Text, Input, InputGroup, InputRightElement, IconButton, Tooltip } from "@chakra-ui/react";
import { EditIcon, CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

import { formatNumber } from "../../utils/number";

export default function NutritionSelect({
  mode,
  setMode,
  calories,
  setCalories,
  protein,
  setProtein,
  fat,
  setFat,
  carbs,
  setCarbs,
  weight,
  servings,
}) {
  const [isEditing, setIsEditing] = useState(false);

  const [tempValues, setTempValues] = useState({
    calories: "",
    protein: "",
    fat: "",
    carbs: "",
  });

  useEffect(() => {
    const multiplier = getMultiplier(mode, weight, servings);

    setTempValues({
      calories: formatNumber(parseFloat(calories || 0) * multiplier),
      protein: formatNumber(parseFloat(protein || 0) * multiplier),
      fat: formatNumber(parseFloat(fat || 0) * multiplier),
      carbs: formatNumber(parseFloat(carbs || 0) * multiplier),
    });
  }, [mode, calories, protein, fat, carbs, weight, servings]);

  const getMultiplier = (mode, weight, servings) => {
    const w = parseFloat(weight) || 0;
    const s = parseFloat(servings) || 0;
    if (mode === "per_100g") return 1;
    if (mode === "per_serving" && s) return +(w / s / 100).toFixed(6);
    if (mode === "total" && w) return +(w / 100).toFixed(6);
    return 1;
  };

  const handleChange = (field, value) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    const multiplier = getMultiplier(mode, weight, servings);
    setTempValues({
      calories: formatNumber(parseFloat(calories || 0) * multiplier),
      protein: formatNumber(parseFloat(protein || 0) * multiplier),
      fat: formatNumber(parseFloat(fat || 0) * multiplier),
      carbs: formatNumber(parseFloat(carbs || 0) * multiplier),
    });
    setIsEditing(false);
  };

  const handleSave = () => {
    const multiplier = getMultiplier(mode, weight, servings);
    const divider = multiplier || 1;

    setCalories(String(parseFloat(tempValues.calories.replace(",", ".")) / divider));
    setProtein(String(parseFloat(tempValues.protein.replace(",", ".")) / divider));
    setFat(String(parseFloat(tempValues.fat.replace(",", ".")) / divider));
    setCarbs(String(parseFloat(tempValues.carbs.replace(",", ".")) / divider));

    setIsEditing(false);
  };

  return (
    <>
      <Flex>
        <Select
          size="sm"
          mb="0.5rem"
          width="fit-content"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="per_100g">На 100 грамм</option>
          <option value="per_serving">На порцию</option>
          <option value="total">На всё блюдо</option>
        </Select>

        {isEditing ?
          <Flex ml="auto" >
            <Tooltip label="Отменить" placement="top-end" bg="#ECECEC" color="black">
              <IconButton
                icon={<NotAllowedIcon />}
                size="sm"
                variant="ghost"
                onClick={handleCancel}
              />
            </Tooltip>
            <Tooltip label="Сохранить" placement="top-end" bg="#ECECEC" color="black">
              <IconButton
                icon={<CheckIcon />}
                size="sm"
                variant="ghost"
                onClick={handleSave}
              />
            </Tooltip>
          </Flex>
        :
        <Tooltip label="Редактировать" placement="top-end" bg="#ECECEC" color="black">
          <IconButton
            icon={<EditIcon />}
            size="sm"
            variant="ghost"
            ml="auto"
            onClick={handleEdit}
          />
        </Tooltip>
        }
      </Flex>

      <Box fontSize="sm" m="0 1.5rem" mb="1rem">
        {["calories", "protein", "fat", "carbs"].map((field) => (
          <Flex mb="0.5rem" justifyContent="space-between" key={field}>
            <Text>
              {field === "calories"
                ? "Калорийность"
                : field === "protein"
                ? "Белки"
                : field === "fat"
                ? "Жиры"
                : "Углеводы"}
            </Text>
            <InputGroup size="xs" width="65%">
              <Input
                value={tempValues[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                isDisabled={!isEditing}
                pr="2.5rem"
              />
              <InputRightElement
                children={field === "calories" ? "ккал" : "г"}
                m="0 0.5rem"
              />
            </InputGroup>
          </Flex>
        ))}
      </Box>
    </>
  );
}
