//prettier-ignore
import {Flex,Image,Img,Text,useColorMode,useColorModeValue} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserInfo } from "../utils/fetchData";
import user from "../img/user.png";
import { firebaseApp } from "../firebase-config";
import { getFirestore } from "firebase/firestore";

const StoryPin = ({ data }) => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("blackAlpha.700", "gray.900");
  const textColor = useColorModeValue("gray.100", "gray.100");

  const fireStoreDb = getFirestore(firebaseApp);

  const [userId, setuserId] = useState(null);
  const [userInfo, setuserInfo] = useState(null);

  useEffect(() => {
    if (data) setuserId(data.userId);
    if (userId)
      getUserInfo(fireStoreDb, userId).then((data) => {
        setuserInfo(data);
      });
  }, [userId]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      cursor={"pointer"}
      shadow={"lg"}
      _hover={{ shadow: "xl" }}
      rounded={"md"}
      overflow={"hidden"}
      position={"relative"}
      maxWidth={"300px"}
      height={"full"}
    >
      <Link to={`/storyDetail/${data?.id}`}>
        <Img src={data.imageUrl} />
      </Link>
      <Flex
        position={"absolute"}
        bottom={0}
        left={0}
        p={2}
        bg={bg}
        width={"full"}
        direction={"column"}
      >
        <Flex
          width={"full"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Text color={textColor} isTruncated fontSize={"20px"}>
            {data.title}
          </Text>
          <Link to={`/userDetail/${userId}`}>
            <Image
              src={userInfo?.photoURL ? userInfo?.photoURL : user}
              rounded={"full"}
              width={"50px"}
              height={"50px"}
              border={"2px"}
              borderColor={bg}
              mt={-10}
              minHeight={"60px"}
              minWidth={"60px"}
            />
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default StoryPin;
