import { Card, CloseButton, CardHeader, Heading, CardBody } from "@chakra-ui/react";

export default function WelcomeCard({ onClick }) {
  return (
    <Card width="34vw" padding="1.5rem" position="relative">
      <CloseButton
        position="absolute"
        top="2"
        right="2"
        size="lg"
        onClick={onClick}
      />

      <CardHeader  padding="0">
        <Heading fontSize="1.5rem" letterSpacing="widest" textAlign="center">КБЖУшка</Heading>
      </CardHeader>

      <CardBody lineHeight="1.25rem">
        КБЖУшка — это твой удобный помощник для подсчёта калорий и составления блюд.<br />
        <br />
        Забудь про скучные таблицы и вечные калькуляторы: у нас всё просто и красиво.<br />
        <br />
        Добавляй продукты, комбинируй их в блюда и сразу получай точный расчёт калорийности, белков, жиров и углеводов.<br />
        <br />
        Веди свой личный аккаунт, храни любимые рецепты и контролируй питание так, как удобно именно тебе.<br />
        <br />
        С КБЖУшкой ты сможешь есть вкусно и осознанно, не тратя время на лишние подсчёты.
      </CardBody>
    </Card>
  );
}
