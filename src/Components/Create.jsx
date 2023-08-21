//prettier-ignore
import { Button, Flex, Text, Input, Menu, MenuButton, MenuItem, MenuList, useColorMode, useColorModeValue, InputGroup, InputLeftAddon, InputLeftElement, Box, FormLabel, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
//prettier-ignore
import {IoCheckmark,IoChevronDown,IoCloudUpload,IoLocation,IoTrash,IoWarning,} from "react-icons/io5";
import { categories } from "../data";
import Spinner from "./Spinner";
//prettier-ignore
import {getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage"
import { firebaseApp } from "../firebase-config";
import AlertMsg from "../AlertMsg";
import TextEditor from "./TextEditor";
import { fetchUser } from "../utils/fetchUser";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.50");

  const [title, settitle] = useState("");
  const [category, setcategory] = useState("Choose a Category");
  const [location, setlocation] = useState("");
  const [ImageAsset, setImageAsset] = useState(null);
  const [loading, setloading] = useState(false);
  const [progress, setprogress] = useState(1);
  const [alert, setalert] = useState(false);
  const [alertStatus, setalertStatus] = useState("");
  const [alertMsg, setalertMsg] = useState("");
  const [alerticon, setalerticon] = useState(null);
  const [description, setDescription] = useState("");

  const [userInfo] = fetchUser();
  const navigate = useNavigate;
  const storage = getStorage(firebaseApp);
  const fireStoreDb = getFirestore(firebaseApp);

  const uploadImage = (e) => {
    setloading(true);
    // e.preventDefault();
    const imageFile = e.target.files[0];

    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setprogress(uploadProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageAsset(downloadURL);
          setloading(false);
          setalert(true);
          // setalertStatus("Success");
          setalerticon(<IoCheckmark fontSize={25} />);
          setalertMsg("Image Uploaded Successfully");
          setTimeout(() => {
            setalert(false);
          }, 4000);
        });
      }
    );
  };

  const deleteImage = () => {
    const deleteRef = ref(storage, ImageAsset);
    deleteObject(deleteRef)
      .then(() => {
        setImageAsset(null);
        setalert(true);
        // setalertStatus("Error");
        setalerticon(<IoWarning fontSize={25} />);
        setalertMsg("Your Image was removed ");
        setTimeout(() => {
          setalert(false);
        }, 5000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleTextEditorChange = (editorValue) => {
    setDescription(editorValue);
  };

  const uploadDetails = async () => {
    try {
      setloading(true);
      if (!title && !category && !ImageAsset) {
        setalert(true);
        // setalertStatus("error")
        setalerticon(<IoWarning fontSize={25} />);
        setalertMsg("Required Fields are missing");
        setTimeout(() => {
          setalert(false);
        }, 4000);
      } else {
        // isLoading = { loading };
        const data = {
          id: `${Date.now()}`,
          title: title,
          userId: userInfo?.uid,
          categories: categories,
          location: location,
          imageUrl: ImageAsset,
          description: description,
        };
        console.log(data);
        await setDoc(doc(fireStoreDb, "Images", `${Date.now()}`), data);
        setloading(false);
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {}, [title, location, description, categories]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      width={"full"}
      minHeight={"100vh"}
      padding={"10"}
    >
      <Flex
        width={"80%"}
        height={"full"}
        border={"1px"}
        borderColor={"gray.300"}
        borderRadius={"md"}
        p={"4"}
        flexDirection={"column"}
        alignContent={"center"}
        justifyContent={"center"}
        gap={"2"}
      >
        {alert && (
          <AlertMsg status={alertStatus} msg={alertMsg} icon={alerticon} />
        )}
        <Input
          variant={"flushed"}
          placeholder="Title"
          focusBorderColor="gray.400"
          isRequired
          errorBorderColor="red"
          type={"text"}
          _placeholder={{ color: "gray.500" }}
          fontSize={"20"}
          value={title}
          onChange={(e) => settitle(e.target.value)}
        />

        <Flex
          justifyContent={"space-between"}
          width={"full"}
          alignItems={"center"}
          gap={"8"}
          my={"4"}
        >
          <Menu>
            <MenuButton
              width={"full"}
              colorScheme="blue"
              as={Button}
              rightIcon={<IoChevronDown fontSize={"25"} />}
            >
              {category}
            </MenuButton>
            <MenuList zIndex={101} width={"md"} shadow={"xl"}>
              {categories &&
                categories.map((data) => (
                  <MenuItem
                    key={data.id}
                    _hover={{ bg: "blackAlpha.300" }}
                    fontSize={20}
                    px={4}
                    onClick={() => setcategory(data.name)}
                  >
                    {data.iconSrc}{" "}
                    <Text fontSize={18} ml={4}>
                      {data.name}
                    </Text>
                  </MenuItem>
                ))}
            </MenuList>
          </Menu>
          <InputGroup>
            <InputLeftElement
              pointerEvents={"none"}
              children={<IoLocation />}
              fontSize={"20"}
              color={`${colorMode === "dark" ? "#f1f1f1" : "#111"}`}
            />

            <Input
              variant={"flushed"}
              placeholder="Location"
              focusBorderColor="gray.400"
              isRequired
              errorBorderColor="red"
              type={"text"}
              _placeholder={{ color: "gray.500" }}
              fontSize={"20"}
              value={location}
              onChange={(e) => setlocation(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Flex
          border={"1px"}
          borderColor={"gray.500"}
          height={"500px"}
          borderStyle={"dashed"}
          width={"full"}
          borderRadius={"md"}
          overflow={"hidden"}
          position={"relative"}
        >
          {!ImageAsset ? (
            <FormLabel width={"full"}>
              <Flex
                direction={"column"}
                alignItems={"center"}
                justifyContent={"center"}
                height={"full"}
                width={"full"}
              >
                <Flex
                  direction={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                  height={"full"}
                  width={"full"}
                  cursor={"pointer"}
                >
                  {loading ? (
                    <Spinner msg={"Uploading the Image"} progress={progress} />
                  ) : (
                    <>
                      <IoCloudUpload
                        fontSize={"30"}
                        color={`${colorMode === "dark" ? "#f1f1f1" : "#111"}`}
                      />
                      <Text mt={5} fontSize={20} color={textColor}>
                        Click to Upload
                      </Text>
                    </>
                  )}
                </Flex>
              </Flex>
              {!loading && (
                <input
                  type="file"
                  name="Upload Image"
                  onChange={uploadImage}
                  style={{ width: 0, height: 0 }}
                  accept="image/png, image/jpeg"
                />
              )}
            </FormLabel>
          ) : (
            <Flex
              height={"full"}
              width={"full"}
              position={"relative"}
              justifyContent={"center"}
              alignItems={"center"}
              bg={"black"}
            >
              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                width={"40px"}
                height={"40px"}
                rounded={"full"}
                bg={"red"}
                top={5}
                right={5}
                position={"absolute"}
                cursor={"pointer"}
                zIndex={10}
                onClick={deleteImage}
              >
                <IoTrash fontSize={20} color="white" />
              </Flex>
              <Image
                src={ImageAsset}
                style={{ height: "100%", width: "100%" }}
              />
            </Flex>
          )}
        </Flex>
        <Box>
          <TextEditor onChange={handleTextEditorChange} />
        </Box>
        <Button
          isLoading={loading}
          loadingText="uploading"
          colorScheme="linkedin"
          variant={`${loading ? "outline" : "solid"}`}
          width={"xl"}
          _hover={{ shadow: "lg" }}
          fontSize={20}
          onClick={() => uploadDetails()}
        >
          Upload
        </Button>
      </Flex>
    </Flex>
  );
};

export default Create;
