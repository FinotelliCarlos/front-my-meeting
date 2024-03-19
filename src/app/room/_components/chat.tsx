"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import useSocket from "@/context/socket-context";
import { MessageCircle, SendIcon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface ChatProps {
  roomId: string;
}

interface IMessages {
  message: string;
  userName: string;
  roomId: string;
  time: string;
}

const Chat = ({ roomId }: ChatProps) => {
  const { socket } = useSocket();
  const [currMessage, setCurrMessage] = useState<string>("");
  const [chat, setChat] = useState<IMessages[]>([]);

  const userName =
    (typeof window !== "undefined" && sessionStorage.getItem("userName")) || "";

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currMessage !== "") {
      const messageToSend = {
        message: currMessage,
        userName,
        roomId,
        time: new Date().toLocaleTimeString(),
      };

      socket?.emit("chat", messageToSend);
      setChat((prev) => {
        return [...prev, messageToSend];
      });

      setCurrMessage("");
    }
  };

  useEffect(() => {
    socket?.on("chat", (data) => {
      setChat((prev) => {
        return [...prev, data];
      });
    });
  }, [socket]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <MessageCircle size={26} />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-0 flex flex-col justify-between md:w-[500px] w-full">
        <div className="w-full h-full flex flex-col border-b border-solid border-primary-foreground">
          <SheetHeader className="p-2">
            <SheetTitle>Chat da reunião</SheetTitle>
            <SheetDescription className="text-xs">
              As mensagens somente serão exibidas enquanto ouver alguem nesta
              sala!
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto p-2 pb-4 border-t border-solid border-primary-foreground mt-2 h-full flex flex-col justify-end">
            {/* minha mensagem */}
            {chat.length !== 0 ? (
              chat.map((chatMessage, index) => {
                return (
                  <div key={`MSG:${index}`} className="w-full flex flex-col">
                    <div
                      className={twMerge(
                        chatMessage.userName === userName
                          ? "text-right flex flex-row-reverse"
                          : "text-left flex flex-row",
                        `items-center gap-1`
                      )}
                    >
                      <span
                        className={twMerge(
                          chatMessage.userName === userName
                            ? "text-blue-800"
                            : "text-zinc-400",
                          " font-bold text-sm"
                        )}
                      >
                        {chatMessage.userName}
                      </span>
                      <span className="text-zinc-500 font-sans text-[0.6rem]">
                        {chatMessage.time}
                      </span>
                    </div>

                    <div
                      className={twMerge(
                        chatMessage.userName === userName
                          ? "text-right"
                          : "text-left"
                      )}
                    >
                      <span className="text-primary text-xs">
                        {chatMessage.message}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex w-full p-2">
                <span className="text-center w-full text-slate-500">
                  Inicie a conversa! 👍💭 ...
                </span>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="mt-1">
          <form className="w-full p-2" onSubmit={(e) => handleSendMessage(e)}>
            <div className="flex items-center gap-3 w-full">
              <Input
                className="w-full h-10"
                type="text"
                value={currMessage}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setCurrMessage(value);
                }}
              />

              <Button
                variant="secondary"
                className="w-12 h-10"
                size="icon"
                type="submit"
              >
                <SendIcon size={16} />
              </Button>
            </div>
          </form>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default Chat;
