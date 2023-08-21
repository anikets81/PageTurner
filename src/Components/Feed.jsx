import React, { useEffect, useState } from "react";

import { firebaseApp } from "../firebase-config";
import { getFirestore } from "firebase/firestore";

import { categoryFeeds, getAllFeeds } from "../utils/fetchData";
import Spinner from "../Components/Spinner";
import { Box, Flex, Grid, GridItem, SimpleGrid } from "@chakra-ui/react";
import StoryPin from "./StoryPin";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

const Feed = ({ FilterBooks }) => {
  const fireStoreDb = getFirestore(firebaseApp);
  const [feeds, setfeeds] = useState(null);
  const [loading, setloading] = useState(false);

  const { categoryId } = useParams();
  useEffect(() => {
    setloading(true);
    if (categoryId) {
      categoryFeeds(fireStoreDb, categoryId).then((data) => {
        setfeeds(data);
        setloading(false);
      });
    } else {
      getAllFeeds(fireStoreDb).then((data) => {
        setfeeds(data);
        setloading(false);
      });
    }
  }, [categoryId]);

  if (loading) return <Spinner msg={"loading your Feeds"} />;

  if (feeds && feeds.length === 0) return <NotFound />;

  return (
    <SimpleGrid
      minChildWidth="300px"
      spacing="15px"
      width={"full"}
      autoColumns={"max-content"}
      px={"2px"}
      overflow={"hidden"}
    >
      {FilterBooks?.length > 0
        ? FilterBooks?.map((data) => (
            <StoryPin
              key={data.id}
              maxWidth={"420px"}
              height={"80px"}
              data={data}
            />
          ))
        : feeds?.map((data) => (
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

export default Feed;
