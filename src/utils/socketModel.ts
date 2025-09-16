import io from "socket.io-client";
import envirnment from "@/envirnment";

const socketModel = io(envirnment.api);
export default socketModel;
