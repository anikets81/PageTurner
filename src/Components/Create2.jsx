//prettier-ignore
import { Button, Flex, Text, Input, Menu, MenuButton, MenuItem, MenuList, useColorMode, useColorModeValue, InputGroup, InputLeftAddon, InputLeftElement, Box, FormLabel, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { SlNote } from "react-icons/sl";
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

const Create2 = () => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.900", "gray.50");

  const [title, setTitle] = useState("Empty");
  const [category, setCategory] = useState("Categories");
  const [language, setlanguage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState();
  const [description, setDescription] = useState("");
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [alertIcon, setAlertIcon] = useState(null);

  const [userInfo] = fetchUser();
  const navigate = useNavigate();
  const storage = getStorage(firebaseApp);
  const fireStoreDb = getFirestore(firebaseApp);

  const uploadImage = (e) => {
    setLoading(true);
    const imageFile = e.target.files[0];
    const storageRef = ref(storage, `Images/${Date.now()}-${imageFile.name}`);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const uploadProgress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(uploadProgress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImage(downloadURL);
          setLoading(false);
          setAlert(true);
          setAlertIcon(<IoCheckmark fontSize={25} />);
          setAlertMsg("Image Uploaded Successfully");
          setTimeout(() => {
            setAlert(false);
          }, 4000);
        });
      }
    );
  };

  const deleteImage = () => {
    const deleteRef = ref(storage, image);
    deleteObject(deleteRef)
      .then(() => {
        setImage(null);
        setAlert(true);
        setAlertIcon(<IoWarning fontSize={25} />);
        setAlertMsg("Image removed ");
        setTimeout(() => {
          setAlert(false);
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
      if (!title || !category || !image) {
        setAlert(true);
        setAlertIcon(<IoWarning fontSize={25} />);
        setAlertMsg("Required Fields are missing");
        setTimeout(() => {
          setAlert(false);
        }, 4000);
      } else {
        // setLoading(true);
        const data = {
          id: `${Date.now()}`,
          title: title,
          userId: userInfo?.uid,
          categories: category,
          language: language,
          imageUrl: image,
          description: description,
        };
        await setDoc(doc(fireStoreDb, "Images", `${Date.now()}`), data);
        setLoading(false);
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

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
        {alert && <AlertMsg msg={alertMsg} icon={alertIcon} />}
        <Input
          variant={"flushed"}
          placeholder="Title"
          focusBorderColor="gray.400"
          isRequired
          errorBorderColor="red"
          type={"text"}
          _placeholder={{ color: "gray.500" }}
          fontSize={"20"}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Flex
          justifyContent={{ base: "center", md: "space-between" }}
          flexDirection={{ base: "column", md: "row" }}
          alignItems={{ base: "center", md: "flex-start" }}
          gap={{ base: 4, md: 0 }}
          my={4}
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
                    onClick={() => setCategory(data.name)}
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
              children={<SlNote />}
              fontSize={"20"}
              color={`${colorMode === "dark" ? "#f1f1f1" : "#111"}`}
            />

            <Input
              variant={"flushed"}
              placeholder="Language"
              focusBorderColor="gray.400"
              isRequired
              errorBorderColor="red"
              type={"text"}
              _placeholder={{ color: "gray.500" }}
              fontSize={"20"}
              value={language}
              onChange={(e) => setlanguage(e.target.value)}
            />
          </InputGroup>
        </Flex>

        <Flex
          border={"1px"}
          borderColor={"gray.500"}
          height={"300px"}
          borderStyle={"dashed"}
          width={"full"}
          borderRadius={"md"}
          overflow={"hidden"}
          position={"relative"}
        >
          {!image ? (
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
                        Upload Cover Image
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
              <Image src={image} style={{ height: "100%", width: "100%" }} />
            </Flex>
          )}
        </Flex>

        <Box height={"400px"} mb={"50px"}>
          <TextEditor onChange={handleTextEditorChange} height={"400px"} />
        </Box>
        <Flex justifyContent={"center"}>
          <Button
            isLoading={loading}
            loadingText="uploading"
            colorScheme="linkedin"
            variant={`${loading ? "outline" : "solid"}`}
            width={"52"}
            _hover={{ shadow: "lg" }}
            fontSize={20}
            onClick={() => uploadDetails()}
          >
            Upload
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Create2;
