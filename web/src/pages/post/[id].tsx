import { Box, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { EditDeletePostButtons } from "../../components/EditDeletePostButtons";
import { Layout } from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useGetPostfromUrl } from "../../utils/useGetPostFromUrl";

interface PostProps {}

export const Post: React.FC<PostProps> = ({}) => {
  const [{ data, fetching }] = useGetPostfromUrl();

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

  if (fetching)
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  const relativeTime = getRelativeTime(parseInt(data.post.createdAt));

  return (
    <Layout>
      <Heading fontSize="175%" fontWeight="600" mb={3}>
        {data.post.title}
      </Heading>
      <Text mb={10} color="gray.300">
        by {data.post.creator.username} &middot; {relativeTime}
        {data.post.createdAt !== data.post.updatedAt ? " · (edited)" : null}
      </Text>

      {data.post.text}

      <Box mt={10}>
        <EditDeletePostButtons
          id={data.post.id}
          creatorId={data.post.creator.id}
        />
      </Box>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
