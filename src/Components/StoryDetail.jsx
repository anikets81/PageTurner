//prettier-ignore
import {Box,Button,ButtonGroup,Flex,Grid,GridItem,Image,Popover,PopoverArrow,PopoverBody,PopoverCloseButton,PopoverContent,PopoverFooter,PopoverHeader,PopoverTrigger,Text,useColorMode,useColorModeValue,} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { IoHome, IoTrash } from "react-icons/io5";
import Spinner from "../Components/Spinner";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import {
  deleteStory,
  getSpecificStory,
  getUserInfo,
  recommended,
} from "../utils/fetchData";
import HTMLReactParser from "html-react-parser";
import user from "../img/user.png";
import { fetchUser } from "../utils/fetchUser";
import Recommend from "./Recommend";
const StoryDetail = () => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.50");

  const { storyId } = useParams();
  const [isLoading, setisLoading] = useState(false);
  const [StoryInfo, setStoryInfo] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const fireStoreDb = getFirestore(firebaseApp);
  const [localUser] = fetchUser();
  const [feeds, setfeeds] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (storyId) {
      setisLoading(true);
      getSpecificStory(fireStoreDb, storyId).then((data) => {
        setStoryInfo(data);

        recommended(fireStoreDb, data.categories, storyId).then((feed) => {
          setfeeds(feed);
        });

        getUserInfo(fireStoreDb, data.userId).then((user) => {
          setUserInfo(user);
        });
        setisLoading(false);
      });
    }
  }, [storyId]);

  const deleteTheVideo = (storyId) => {
    setisLoading(true);
    deleteStory(fireStoreDb, storyId);
    navigate("/", { replace: true });
  };

  if (isLoading) return <Spinner />;

  return (
    <Flex
      width={"full"}
      height={"auto"}
      justifyContent={"center"}
      alignItems={"center"}
      direction={"column"}
      py={2}
      px={4}
    >
      <Flex alignItems={"center"} width={"full"} my={4}>
        <Link to="/">
          <IoHome fontSize={25} />
        </Link>
        <Box width={"1px"} height={"25px"} bg={"gray.500"} mx={2}></Box>
        <Text
          isTruncated
          color={textColor}
          fontWeight={"semibold"}
          width={"100%"}
        >
          {StoryInfo?.categories}
        </Text>
      </Flex>
      <Grid templateColumns={"repeat(3, 1fr)"} gap={2} width={"100%"}>
        <GridItem width={"100%"} colSpan={2} p={2}>
          <Flex
            width={"full"}
            bg={"transparent"}
            position={"relative"}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Image src={StoryInfo?.imageUrl} height={"400"} width={"300px"} />
            <Flex fontSize={"4xl"} fontFamily={"TimesNewRoman"}>
              {StoryInfo?.title}
            </Flex>
          </Flex>
        </GridItem>
        <GridItem width={"100%"} colSpan={1} p={2}>
          {userInfo && (
            <Flex direction={"column"} width={"full"}>
              <Flex alignItems={"center"} width={"full"}>
                <Image
                  src={userInfo?.photoURL ? userInfo?.photoURL : user}
                  rounded={"full"}
                  width={"60px"}
                  height={"60px"}
                  minHeight={"50px"}
                  minWidth={"50px"}
                />

                <Flex direction={"column"} ml={3}>
                  <Flex alignItems={"center"}>
                    <Text isTruncated color={textColor} fontWeight={"semibold"}>
                      {userInfo?.displayName}
                    </Text>
                  </Flex>
                </Flex>
                <Flex justifyContent={"space-around"} mt={6}>
                  {userInfo?.uid === localUser.uid && (
                    <Popover closeOnEsc>
                      <PopoverTrigger>
                        <Button colorScheme="red" ml={"10px"} mb={"20px"}>
                          <IoTrash fontSize={20} color="#fff" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Confirmation!</PopoverHeader>
                        <PopoverBody>
                          Do You Want To Delete This Story?
                        </PopoverBody>
                        <PopoverFooter display="flex" justifyContent="flex-end">
                          <ButtonGroup size="sm">
                            <Button
                              colorScheme="red"
                              onClick={() => deleteTheVideo(storyId)}
                            >
                              Yes
                            </Button>
                          </ButtonGroup>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  )}
                </Flex>
              </Flex>
            </Flex>
          )}
        </GridItem>
      </Grid>
      {StoryInfo?.description && (
        <Flex
          my={6}
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Text my={2} fontSize={25} fontWeight={"semibold"}></Text>
          {HTMLReactParser(StoryInfo?.description)}
        </Flex>
      )}

      {feeds && (
        <Flex direction={"column"} width={"full"} my={6}>
          <Text my={4} fontSize={25} fontWeight={"semibold"}>
            Recommended Stories
          </Text>
          <Recommend feeds={feeds} />
        </Flex>
      )}
    </Flex>
  );
};

export default StoryDetail;
