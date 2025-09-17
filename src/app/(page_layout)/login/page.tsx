import { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/utils/shared";
import HomeComponent from "@/app/home";
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
