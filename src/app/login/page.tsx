import { Metadata } from "next";
import HomeComponent from "../home";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
export const metadata: Metadata = {
  title: `${APP_NAME} - Login`,
  description: APP_DESCRIPTION,
};

export default function Login() {
  return (
    <>
    <HomeComponent/>
    </>
  );
}
