import React, { useState } from "react";
import { Box, Link, Flex, Button, Text } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [hasScrolled, setHasScrolled] = useState(false);

  let body = null;

  useEffect(() => {
    setInterval(() => {
      setIsConnected(window.navigator.onLine);
    }, 1000);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const handleScroll = () => {
    if (window.scrollY > 20) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  };

  // data is loading
  if (fetching || isConnected === null) {
    body = (
      <>
        <Button isDisabled isLoading variant="link">
          {""}
        </Button>
      </>
    );
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          isLoading={logoutFetching}
          variant="link"
          fontWeight="normal"
          color="#f00"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      background="#fff"
      borderBottom={hasScrolled ? "1px solid #f7f7f7" : "1px solid transparent"}
      p={hasScrolled ? 2 : 4}
      transition="cubic-bezier(.5,-0.75,.50,1.25) all .4s"
      px={hasScrolled ? "17.5%" : "25%"}
    >
      <NextLink href="/">
        <Link>
          <Text fontSize="2em" fontWeight="bold">
            LiReddit
          </Text>
        </Link>
      </NextLink>

      <Flex ml={"auto"} align="center">
        {isConnected !== false ? (
          body
        ) : (
          <Text color="#f00">You are offline</Text>
        )}
      </Flex>
    </Flex>
  );
};
