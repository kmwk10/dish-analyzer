import { Flex, Select, Input, InputGroup, InputRightElement, IconButton, Tooltip } from "@chakra-ui/react";
import { EditIcon, CheckIcon, NotAllowedIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function ServingSelect({ mode, setMode, currentValue, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(currentValue);

  const handleEdit = () => {
    setTempValue(currentValue);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempValue(currentValue);
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave(tempValue);
  };

  return (
    <>
      <Flex>
        <Select
          size="sm"
          mb="0.5rem"
          width="fit-content"
          value={mode}
          onChange={(e) => setMode(e.target.value)}>
          <option value='servings'>Количество порций</option>
          <option value='serving_weight'>Вес порции</option>
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

      <InputGroup size="sm">
        <Input
          value={isEditing ? tempValue : currentValue}
          onChange={(e) => setTempValue(e.target.value)}
          placeholder={mode === "servings" ? "Введите количество порций" : "Введите вес порции"}
          isDisabled={!isEditing}
          mb="1rem"
        />
        {mode === "serving_weight" && (
          <InputRightElement children="г" ml="1rem"/>
        )}
      </InputGroup>
    </>
  );
}
