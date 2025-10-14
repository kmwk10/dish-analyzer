import { Card, Flex, Text, IconButton } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

export default function SettingsItem({ label, user_info }) {
  return (
    <Card marginBottom="1rem">
      <Flex alignItems="center" padding="0.8rem 1.5rem">
        <Text width="22vw">{label}</Text>
        <Text mr="auto">{user_info}</Text>
        <IconButton
          icon={<EditIcon />}
          variant="ghost"
        />
      </Flex>
    </Card>
  );
}
