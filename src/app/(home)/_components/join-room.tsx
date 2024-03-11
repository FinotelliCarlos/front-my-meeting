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

const JoinRoom = () => {
  const roomId = useRef<HTMLInputElement>(null);
  const roomKey = useRef<HTMLInputElement>(null);

  return (
    <Card className="bg-slate-900">
      <CardHeader>
        <CardTitle>Ingresse na reunião:</CardTitle>
        <CardDescription>Entrar em uma reunião existente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
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
          <Label htmlFor="roomKey">Chave de entrada:</Label>
          <Input
            id="roomKey"
            type="password"
            placeholder="xxxxx"
            ref={roomKey}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full uppercase" variant="default">
          Entrar
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JoinRoom;
