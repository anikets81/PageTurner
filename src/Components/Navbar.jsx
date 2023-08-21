import React, { useEffect, useState } from "react";
import logo from "../img/logo.png";
import logo_dark from "../img/logo_dark.png";
import { Link, useNavigate } from "react-router-dom";

//prettier-ignore
import {  Flex,  Image,  useColorMode,  useColorModeValue,  InputGroup,  InputLeftElement,  Input,  Menu,  MenuButton,  MenuList,  MenuItem,} from "@chakra-ui/react";

import { IoAdd, IoLogOut, IoMoon, IoSearch, IoSunny } from "react-icons/io5";
import { color, filterProps } from "framer-motion";
import { getAllFeeds } from "../utils/fetchData";
import { firebaseApp } from "../firebase-config";
import { getFirestore } from "firebase/firestore";

const Navbar = ({ user, setFilterBooks }) => {
  const fireStoreDb = getFirestore(firebaseApp);
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.600", "gray.300");
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [listOfBooks, setListofBooks] = useState([]);

  useEffect(() => {
    getAllFeeds(fireStoreDb).then((data) => {
      setListofBooks(data);
    });
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const searchList = listOfBooks.filter((res) =>
        res.title.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilterBooks(searchList);
    }
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      width="100vw"
      p="4"
    >
      <Link to={"/"}>
        <Image
          src={colorMode === "light" ? logo_dark : logo}
          width="180px"
        ></Image>
      </Link>
      <InputGroup mx={6} width="60vw">
        <InputLeftElement
          pointerEvents="none"
          children={<IoSearch fontSize={25} />}
        ></InputLeftElement>
        <Input
          type="text"
          placeholder="Search..."
          fontSize="18"
          fontWeight="medium"
          variant="filled"
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
      </InputGroup>

      <Flex justifyContent="center" alignItems="center">
        <Flex
          width="40px"
          height="40px"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          borderRadius="5px"
          onClick={toggleColorMode}
        >
          {colorMode === "light" ? (
            <IoMoon fontSize={25} />
          ) : (
            <IoSunny fontSize={25} />
          )}
        </Flex>

        <Link to="/create">
          <Flex
            justifyContent="center"
            alignItems="center"
            bg={bg}
            height={"40px"}
            width={"40px"}
            borderRadius={"5px"}
            mx={6}
            cursor={"pointer"}
            _hover={{ shadow: "md" }}
            transition="ease-in-out"
            transitionDuration={"0.3s"}
          >
            <IoAdd
              fontSize={25}
              color={colorMode === "dark" ? "#111" : "#f1f1f1"}
            />
          </Flex>
        </Link>
        <Menu>
          <MenuButton>
            <Image
              src={user?.photoURL}
              width={"40px"}
              height={"40px"}
              rounded={"full"}
            />
          </MenuButton>
          <MenuList shadow={"lg"}>
            <Link to={`/userDetail/${user?.uid}`}>
              <MenuItem>My Account</MenuItem>
            </Link>
            <MenuItem
              flexDirection={"row"}
              alignItems={"center"}
              gap={"4"}
              onClick={() => {
                localStorage.clear();
                navigate("/login", { replace: true });
              }}
            >
              Logout <IoLogOut fontSize={"20"} />
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
