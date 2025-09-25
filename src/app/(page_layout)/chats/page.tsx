"use client";
import { useEffect, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { Tab } from "@headlessui/react";
import Chats from "./Chats";
import MessagesChats from "@/components/Messages/Chats";
import shared from "./shared";
import methodModel from "@/utils/methodModel";

function classNames(...classes:any) {
    return classes.filter(Boolean).join(" ");
}

const CommonChatPages = () => {
    const [chatRoomId, setChatRoomId] = useState("");
    const [openTab, setOpenTab] = useState("chats");
    const [search, setSearch] = useState("");
    const [chatRooms, setChatRooms] = useState();

    const {get}=ApiClientB()

    const getChatRoomsList = (p = {}) => {
        let f = { ...p };
        if (search) {
            f = { search: search, ...p };
        }
        // loader(true);
        get("chat/room-members", f).then((res) => {
            if (res.success) {
                setChatRooms(res.data.data);
            }
            // loader(false);
        });
    };
    useEffect(() => {
        if (methodModel.getPrams('type')) {
            try {
                const doc:any=document
                doc.getElementById('ClickTab').click()
            } catch {

            }
            getChatRoomsList({ quickChat: true });
            setChatRoomId("");
            setOpenTab("messages");
        }
    }, [methodModel.getPrams('type')])
    return (
        <>

            <div className="pt-[20px] md:pt-[40px] lg:pt-[50px] xl:pt-[60px]  px-4 lg:px-10 2xl:px-16">
                <div className="flex flex-wrap justify-between items-center gap-y-4 mb-3">
                    <div>
                        <h3 className="text-2xl font-semibold text-[#111827]">
                            {" "}
                            {shared.title}
                        </h3>
                        <p className="text-sm font-normal text-[#75757A]">
                            Here you can see all about your {shared.title}
                        </p>
                    </div>
                </div>

                <Tab.Group defaultIndex={methodModel.getPrams('type') ? 1 : 0}>
                    <div className="inline-flex bg-[#3a3a3a] rounded-xl  py-3 px-4">
                        <Tab.List className="flex gap-2 text-white font-semibold text-[16px]">
                            <Tab
                                onClick={() => {
                                    getChatRoomsList({ quickChat: false });
                                    setChatRoomId("");
                                    setOpenTab("chats");
                                }}
                                className={({ selected }) =>
                                    classNames(
                                        "border-r border-white/40 pr-2 focus:outline-none",
                                        "",
                                        selected ? "text-white" : "text-[#d5d5d5]"
                                    )
                                }
                            >
                                Quick Chats
                            </Tab>
                            <Tab
                                id='ClickTab'
                                onClick={() => {
                                    getChatRoomsList({ quickChat: true });
                                    setChatRoomId("");
                                    setOpenTab("messages");
                                }}
                                className={({ selected }) =>
                                    classNames(
                                        " focus:outline-none",
                                        "",
                                        selected ? " text-white" : "text-[#d5d5d5]"
                                    )
                                }
                            >
                                Messages
                            </Tab>
                        </Tab.List>
                    </div>
                    <Tab.Panels className=" pt-6 pb-6">
                        <Tab.Panel>
                            <Chats />
                        </Tab.Panel>
                        <Tab.Panel>
                            <MessagesChats />
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
            </div>
        </>
    );
};

export default CommonChatPages;
