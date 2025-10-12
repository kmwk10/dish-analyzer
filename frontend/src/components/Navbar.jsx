import { Card, Flex, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const links = [
    { to: "/dishes", label: "Блюда" },
    { to: "/products", label: "Продукты" },
    { to: "/settings", label: "Настройки" }
  ];

  return (
    <Card.Root height="8vh" fontSize="1.5rem">
      <Flex flex="1" align="center" margin="0 10vw">
        {links.map((link) => (
          <Link
            key={link.to}
            as={NavLink}
            to={link.to}
            marginEnd="18vw"
            outline="none"
            _hover={{ textDecoration: "underline" }}
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal"
            })}
          >
            {link.label}
          </Link>
        ))}
      </Flex>
    </Card.Root>
  );
}
