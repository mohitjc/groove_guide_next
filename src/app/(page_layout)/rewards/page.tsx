import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import PageContent from "./PageContent";

export const metadata: Metadata = {
  title: `${APP_NAME} - Reward`,
  description: APP_DESCRIPTION,
};

export default function Home() {
  return (
   <>
   <PageContent/>
   </>
  );
}
