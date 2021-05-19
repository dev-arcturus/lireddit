import { Button } from "@chakra-ui/core";
import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { EditDeletePostButtons } from "../components/EditDeletePostButtons";
import { Layout } from "../components/Layout";
import UpdootSection from "../components/UpdootSection";
import { useMeQuery, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
const Index = () => {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: null as string | null,
  });
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [{ data: meData }] = useMeQuery();
  const [{ data, error, fetching }] = usePostsQuery({
    variables,
  });

  useEffect(() => {
    setInterval(() => {
      setIsConnected(window.navigator.onLine);
    }, 1000);
  });

  const getRelativeTime = (ts: number) => {
    const now = new Date().getTime();
    const difference = now - ts;

    const inSeconds = Math.round(difference / 1000);
    const inMinutes = Math.round(inSeconds / 60);
    const inHours = Math.round(inMinutes / 60);
    const inDays = Math.round(inHours / 24);
    const inWeeks = Math.round(inDays / 7);
    const inMonths = Math.round(inWeeks / 4);
    const inYears = Math.round(inMonths / 12);

    if (inYears) return `${inYears}y`;
    else if (inMonths) return `${inMonths}mo`;
    else if (inWeeks) return `${inWeeks}w`;
    else if (inDays) return `${inDays}d`;
    else if (inHours) return `${inHours}h`;
    else if (inMinutes) return `${inMinutes}m`;
    else return "just now";
  };

  return (
    <Layout>
      <Flex align="center">
        <Text fontSize="1.75em" fontWeight="bold">
          Posts
        </Text>
        <Flex ml={"auto"} align="center">
          <NextLink href={isConnected ? "/create-post" : ""}>
            <Link
              cursor={!isConnected ? "not-allowed" : "pointer"}
              opacity={!isConnected ? 0.5 : 1}
              _hover={{
                textDecoration: isConnected ? "underline" : "none!important",
              }}
            >
              create post
            </Link>
          </NextLink>
        </Flex>
      </Flex>
      <br />
      {fetching && !data ? (
        <Flex mx="auto">
          <Button isDisabled isLoading variant="link" size="lg">
            {" "}
          </Button>
        </Flex>
      ) : !fetching && data ? (
        data.posts.posts ? (
          data.posts.posts.map((p) =>
            !p ? null : (
              <Box
                border="1px #f7f7f7 solid"
                padding="10px 15px"
                marginBottom="10px"
                key={p.id}
                transition="ease-in-out all .15s"
                borderRadius="10px"
                _hover={{
                  background: "#fcfcfc",
                  cursor: "pointer",
                }}
              >
                <Flex>
                  <UpdootSection post={p} />
                  <Box width="-webkit-fill-available">
                    <Flex>
                      <Box flex={1}>
                        <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                          <Text mb={0} fontSize="1.15em" fontWeight={600}>
                            <Link
                              _hover={{
                                textDecoration: "underline",
                              }}
                            >
                              {p.title}
                            </Link>
                          </Text>
                        </NextLink>
                        <Text mb={10} color="gray.300">
                          by {p.creator.username} &middot;{" "}
                          {getRelativeTime(parseInt(p.createdAt))}
                          {p.createdAt !== p.updatedAt ? " · (edited)" : null}
                        </Text>
                      </Box>
                      {meData?.me?.id !== p.creator.id ? null : (
                        <EditDeletePostButtons
                          id={p.id}
                          creatorId={p.creator.id}
                        />
                      )}
                    </Flex>
                    <p>
                      {p.textSnippet.length > 250 ? (
                        <Text>
                          {p.textSnippet}
                          <NextLink href="/post/[id]" as={`/post/${p.id}`}>
                            <Link
                              _hover={{
                                textDecoration: "underline",
                              }}
                              color="#3e8bf1"
                            >
                              read more
                            </Link>
                          </NextLink>
                        </Text>
                      ) : (
                        p.textSnippet
                      )}
                    </p>
                  </Box>
                </Flex>
              </Box>
            )
          )
        ) : (
          <p>theres's nothing here lol, get some friends loser</p>
        )
      ) : (
        <Box>
          <p>something went wrong...</p>
          <Text textColor="red">{error?.message}</Text>
        </Box>
      )}
      {data && data.posts.hasMore ? (
        <Flex my={25}>
          <Button
            // isLoading={fetching}
            m="auto"
            _focus={{
              boxShadow: "0 0 0 5px rgb(185 185 185 / 60%)",
              border: "1px solid #000",
            }}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            load more
          </Button>
        </Flex>
      ) : !fetching && data ? (
        <Text align="center" my={25}>
          and before then there was silence
        </Text>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
