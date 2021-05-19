import { Box, Button, Flex, Text } from "@chakra-ui/core";
import { keyframes } from "@emotion/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useIsAuth } from "../utils/useIsAuth";

const CreatePost: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [hasAuthorized, setHasAuthorized] = useState<boolean>(false)
  
  const blinkingAnimation = keyframes`
    from{
      opacity: 0.3;
    }
    50%{
      opacity: 1;
    }
    to{
      opacity: 0.3;
    }
  `
  useIsAuth().then(
    redirected => {
      setHasAuthorized(redirected)
    }
  );
  const [, createPost] = useCreatePostMutation();
  return (
  
  hasAuthorized == true
  ? (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          const { error } = await createPost({ input: values });
          if (!error) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField required name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
                required  
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              create post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
  : 
  (
    <Flex height="100vh">
      <Text fontSize="1.5em" margin="auto" animation=
        {`${blinkingAnimation} 1s ease infinite`}
      >
        checking authorization
      </Text>
    </Flex>
  )
  )
  ;
};

export default withUrqlClient(createUrqlClient)(CreatePost);
