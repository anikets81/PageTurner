import { Flex, Image, Text } from "@chakra-ui/react";
import notfound from "../img/notfound.svg";
import React from "react";
// import

const NotFound = () => {
  return (
    <Flex
      width={"full"}
      alignItems={"center"}
      justifyContent={"center"}
      direction={"column"}
    >
      <Image src={notfound} width={600} />
      <Text fontSize={40} fontWeight={"semibold"} fontFamily={"cursive"}>
        NotFound
      </Text>
    </Flex>
  );
};

export default NotFound;
