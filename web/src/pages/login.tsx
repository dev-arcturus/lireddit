import React from "react";
import { Formik, Form } from "formik";
import { Box, Button, Link, Flex, Text, Tooltip } from "@chakra-ui/core";
import { QuestionIcon } from "@chakra-ui/icons";
import { Wrapper } from "../components/Wrapper";
import { InputField } from "../components/InputField";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from "next/link";
import { useState } from "react";
import { useEffect } from "react";

type loginError = {
  text: string,
  description?: string 
}

const LoginError = ({error}: {error: loginError}) => {
  return (
    <Flex align="center">
        <Text color="#f00" width="100%" my={3} alignContent="center">
          <Flex>
            {error.text}
            {error.description
              ? 
                <Box marginLeft="auto" color="gray.400" >
                  <Tooltip 
                    hasArrow 
                    aria-label={error.description} 
                    label={error.description} 
                    bg="teal.200" 
                    color="black"
                  >
                    <QuestionIcon my="auto" />
                  </Tooltip>
                </Box>

              : null
            }
          </Flex>
        </Text>
      </Flex>
  )
}

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();
  const next = router.query.next ?? null;
  const [error, setError] = useState<loginError | null>(null);
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (next == "/create-post") {
      setError({
        text: "🔐 Not Authorized",
        description: "You need to be logged into an account to create a post. Please login to continue!"
      });
    } 
  }, [next]);
 
  return (
    <Wrapper variant="small">
      { error
      ? 
      ( 
        <>
          <LoginError error={error} />
          <hr style={{
            marginTop: "5px", 
            marginBottom: "15px", 
            borderColor: "#fafafa"
          }} /> 
        </>
      )
      : null }
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof next === "string") {
              router.push(next);
            } else {
              // worked
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>

            <InputField
              name="usernameOrEmail"
              id="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box>
            <Flex>
              <Text 
                onMouseEnter={() => {
                  setShowPassword(true)
                }}
                onMouseLeave={() => {
                  setShowPassword(false)
                }}
                ml="auto"
                cursor="pointer"
                position="relative"
                transform="translateY(25px)"
                zIndex={1}
                >
                  {showPassword ? "👀" : "🙈"}
                </Text>
            </Flex>

              <InputField
                name="password"
                id="password"
                placeholder="password"
                label="Password"
                type={showPassword ? "text" : "password"}
              />
            </Box>
            <Flex mt={2}> 
              <NextLink href="/forgot-password">
                <Link ml="auto">forgot password?</Link>
              </NextLink>
            </Flex>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
