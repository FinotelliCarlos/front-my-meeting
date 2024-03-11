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
import { useRef } from "react";

const CreateRoom = () => {
  const roomKey = useRef<HTMLInputElement>(null);

  return (
    <Card className="bg-slate-900">
      <CardHeader>
        <CardTitle>Crei agora sua nova reunião:</CardTitle>
        <CardDescription>
          Criando uma nova reunião será gerado o ID da sua sala!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="roomKey">
            Crie uma chave para entrar nessa reunião:
          </Label>
          <Input id="roomKey" type="password" ref={roomKey} autoFocus />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full uppercase" variant="default">
          Criar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateRoom;
