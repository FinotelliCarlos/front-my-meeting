"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useRef } from "react";

const JoinRoom = () => {
  const userName = useRef<HTMLInputElement>(null);
  const roomId = useRef<HTMLInputElement>(null);
  const roomKey = useRef<HTMLInputElement>(null);

  const handleJoinRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      userName.current?.value &&
      userName.current.value !== "" &&
      roomId.current?.value &&
      roomId.current.value !== ""
    ) {
      typeof window !== "undefined" &&
        sessionStorage.setItem("userName", userName.current.value);

      window.location.href = `/room/${roomId.current.value}`;
    }
  };

  return (
    <Card className="bg-slate-900">
      <CardHeader>
        <CardTitle>Ingresse na reunião:</CardTitle>
        <CardDescription>Entrar em uma reunião existente.</CardDescription>
      </CardHeader>
      <form onSubmit={(e) => handleJoinRoom(e)}>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="userName">Informe seu nome:</Label>
            <Input
              id="userName"
              type="text"
              ref={userName}
              placeholder="John Wick"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="roomId">Id da sala:</Label>
            <Input
              id="roomId"
              type="text"
              placeholder="xxxxx-xxxxx-xxxxx-xxxxx"
              ref={roomId}
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="roomKey">
              Chave de entrada: (somente se a sala tiver senha)
            </Label>
            <Input
              id="roomKey"
              type="password"
              placeholder="xxxxx"
              ref={roomKey}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full uppercase" variant="default" type="submit">
            Entrar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JoinRoom;
