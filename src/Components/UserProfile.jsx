import { Flex, Image } from "@chakra-ui/react";
import Spinner from "./Spinner";
import React, { useEffect, useState } from "react";
import { getFirestore } from "firebase/firestore";
import { firebaseApp } from "../firebase-config";
import { useParams } from "react-router-dom";
import { getUserInfo, userUploadedStories } from "../utils/fetchData";
import Recommend from "./Recommend";

const randomImage =
  "https://source.unsplash.com/random/900×700/?Books,Academia,Classics,Writers,Stories";

const UserProfile = () => {
  const { userId } = useParams();
  const [isLoading, setisLoading] = useState(false);
  const [userInfo, setuserInfo] = useState(null);
  const [feeds, setfeeds] = useState(null);
  const fireStoreDb = getFirestore(firebaseApp);

  useEffect(() => {
    setisLoading(true);
    if (userId) {
      getUserInfo(fireStoreDb, userId).then((user) => {
        setuserInfo(user);
      });
      userUploadedStories(fireStoreDb, userId).then((feed) => {
        setfeeds(feed);
      });

      setisLoading(false);
    }
  }, [userId]);
  if (isLoading) return <Spinner />;

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      width={"full"}
      height={"auto"}
      p={2}
      direction={"column"}
    >
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        width={"full"}
        position={"relative"}
        direction={"column"}
      >
        <Image
          src={randomImage}
          height={"320px"}
          width={"full"}
          objectFit={"cover"}
          borderRadius={"md"}
        />
        <Image
          src={userInfo?.photoURL}
          border={"2px"}
          borderColor={"gray.100"}
          rounded={"full"}
          shadow={"lg"}
          mt={"-16"}
          width={"120px"}
          objectFit={"cover"}
        />
      </Flex>
      {feeds && (
        <Flex direction={"column"} width={"full"} my={6}>
          <Recommend feeds={feeds} />
        </Flex>
      )}
    </Flex>
  );
};

export default UserProfile;
