import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import MenuPage from "./MenuPage";

export const metadata: Metadata = {
  title: `${APP_NAME} - Menu`,
  description: APP_DESCRIPTION,
};

export default function Home() {
  return (
   <>
   <MenuPage/>
   </>
  );
}
