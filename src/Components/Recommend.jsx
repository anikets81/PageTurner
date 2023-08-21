import { SimpleGrid } from "@chakra-ui/react";
import React from "react";
import StoryPin from "./StoryPin";

const Recommend = ({ feeds }) => {
  return (
    <SimpleGrid
      minChildWidth="300px"
      spacing="15px"
      width={"full"}
      autoColumns={"max-content"}
      px={"2px"}
      overflow={"hidden"}
    >
      {feeds &&
        feeds.map((data) => (
          <StoryPin
            key={data.id}
            maxWidth={"420px"}
            height={"80px"}
            data={data}
          />
        ))}
    </SimpleGrid>
  );
};

export default Recommend;
