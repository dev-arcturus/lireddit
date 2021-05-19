import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  PostSnippetFragment,
  useMeQuery,
  useVoteMutation,
} from "../generated/graphql";

interface UpdootSectionProps {
  post: PostSnippetFragment;
}

const UpdootSection: React.FC<UpdootSectionProps> = ({ post: p }) => {
  const [loadingState, setLoadingState] = useState<
    "updoot-loading" | "downdoot-loading" | "not-loading"
  >("not-loading");

  const [{ data }] = useMeQuery();
  const [, vote] = useVoteMutation();
  const isNotLoggedIn = !data?.me;

  return (
    <Flex direction="column" textAlign="center" pt={5} mr="15px">
      <IconButton
        onClick={async () => {
          setLoadingState("updoot-loading");
          await vote({
            postId: p.id,
            value: 1,
          });
          setLoadingState("not-loading");
        }}
        isLoading={loadingState === "updoot-loading"}
        aria-label="updoot"
        icon={<ChevronUpIcon />}
        size="24px"
        opacity={isNotLoggedIn ? ".5" : "1"}
        cursor={isNotLoggedIn ? "not-allowed" : undefined}
        padding={5}
        borderRadius="5px"
        border={`0.5px solid ${p.voteStatus === 1 ? "transparent" : "#eee"}`}
        background={`${p.voteStatus === 1 ? "#FF6700" : undefined}`}
        color={`${p.voteStatus === 1 ? "#FFF" : undefined}`}
      />
      {p.points}
      <IconButton
        onClick={
          isNotLoggedIn
            ? () => {}
            : async () => {
                setLoadingState("downdoot-loading");
                await vote({
                  postId: p.id,
                  value: -1,
                });
                setLoadingState("not-loading");
              }
        }
        isLoading={loadingState === "downdoot-loading"}
        aria-label="downdoot"
        icon={<ChevronDownIcon />}
        size="24px"
        opacity={isNotLoggedIn ? ".5" : "1"}
        cursor={isNotLoggedIn ? "not-allowed" : undefined}
        padding={5}
        borderRadius="5px"
        border={`0.5px solid ${p.voteStatus === -1 ? "transparent" : "#eee"}`}
        background={`${p.voteStatus === -1 ? "#8A2BE2" : undefined}`}
        color={`${p.voteStatus === -1 ? "#FFF" : undefined}`}
      />
    </Flex>
  );
};

export default UpdootSection;
