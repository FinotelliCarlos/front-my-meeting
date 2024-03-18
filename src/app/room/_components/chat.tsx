"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useSocket from "@/context/socket-context";
import { Send } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

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

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currMessage !== "") {
      const messageToSend = {
        message: currMessage,
        userName:
          (typeof window !== "undefined" &&
            sessionStorage.getItem("userName")) ||
          "",
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
    <div className="w-full md:max-w-[400px] md:min-w-[400px] h-max flex flex-col">
      <div className="overflow-y-auto p-2 max-h-[70vh]">
        {/* minha mensagem */}
        {chat.length !== 0 ? (
          chat.map((chatMessage, index) => {
            return (
              <div key={`MSG:${index}`} className="w-full flex flex-col">
                <div className="space-x-2 text-left ">
                  <span className="text-zinc-400 font-bold text-sm">
                    {chatMessage.userName}
                  </span>
                  <span className="text-zinc-500 font-sans text-[0.6rem]">
                    {chatMessage.time}
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-primary text-xs">
                    {chatMessage.message}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex w-full">
            <span className="text-center w-full text-slate-500">
              Inicie a conversa! 👍💭 ...
            </span>
          </div>
        )}

        {/* outra pessoa */}
        {/* <div className="w-full flex flex-col">
          <div className="text-right space-x-2">
            <span className="text-zinc-500 font-sans text-[0.6rem]">10:32</span>
            <span className="text-zinc-400 font-bold text-sm text-right">
              Carlos Finotelli
            </span>
          </div>

          <div className="text-right">
            <span className="text-primary text-xs">
              Hoje gostaria de pedir uma pizza!
            </span>
          </div>
        </div> */}
      </div>

      <Separator className="my-2 bg-primary-foreground" />

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
          <Button type="submit" size="icon" variant="ghost">
            <Send size={18} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
