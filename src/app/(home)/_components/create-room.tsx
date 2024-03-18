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
import { useRouter } from "next/navigation";
import { FormEvent, useRef } from "react";

const CreateRoom = () => {
  const router = useRouter();
  const userName = useRef<HTMLInputElement>(null);
  const roomKey = useRef<HTMLInputElement>(null);

  const handleCreateRoom = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (userName.current?.value && userName.current.value !== "") {
      typeof window !== "undefined" &&
        sessionStorage.setItem("userName", userName.current.value);

      const roomId = generateRamdomString();

      router.push(`/room/${roomId}`);
    }
  };

  const generateRamdomString = () => {
    const randomString = Math.random().toString(36).substring(2, 7);

    return randomString;
  };

  return (
    <Card className="bg-slate-900">
      <CardHeader>
        <CardTitle>Crei agora sua nova reunião:</CardTitle>
        <CardDescription>
          Criando uma nova reunião será gerado o ID da sua sala!
        </CardDescription>
      </CardHeader>
      <form onSubmit={(e) => handleCreateRoom(e)}>
        <CardContent className="space-y-2">
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
            <Label htmlFor="roomKey">
              Crie uma chave para entrar nessa reunião:
            </Label>
            <Input
              id="roomKey"
              type="password"
              ref={roomKey}
              autoFocus
              placeholder="xxxxxxxxxxx"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full uppercase" variant="default" type="submit">
            Criar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default CreateRoom;
