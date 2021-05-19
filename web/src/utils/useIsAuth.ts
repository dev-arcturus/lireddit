import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useIsAuth = ():Promise<boolean> => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  return new Promise ((res) => {
    useEffect(() => {
      if (!fetching && !data?.me) {
        router.replace("/login?next=" + router.pathname);
        res(false)
      }
      res(true)
    }, [fetching, data, router]);
  })
};
