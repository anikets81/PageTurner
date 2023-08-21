import React, { useEffect, useState } from "react";
// prettier-ignore
import {  Navbar,  Category,  Feed, Search,  StoryPin,  StoryDetail,  UserProfile,} from "../Components";

import Create2 from "../Components/Create2";

import { Flex } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import { categories } from "../data";

const Home = ({ user }) => {
  const [FilterBooks, setFilterBooks] = useState([]);
  return (
    <>
      <Navbar user={user} setFilterBooks={setFilterBooks} />

      <Flex width={"100vw"}>
        <Flex
          direction="column"
          justifyContent="start"
          alignItems="center"
          width="5%"
        >
          {categories &&
            categories.map((data) => <Category key={data.id} data={data} />)}
        </Flex>

        <Flex
          width="95%"
          px={4}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Routes>
            <Route path="/" element={<Feed FilterBooks={FilterBooks} />} />
            <Route path="/category/:categoryId" element={<Feed />} />
            <Route path="/create" element={<Create2 />} />
            <Route path="/storyDetail/:storyId" element={<StoryDetail />} />
            <Route path="/userDetail/:userId" element={<UserProfile />} />
          </Routes>
        </Flex>
      </Flex>
    </>
  );
};

export default Home;
