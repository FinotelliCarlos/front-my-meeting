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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@radix-ui/react-label";

const FormWrapper = () => {
  return (
    <Tabs defaultValue="join" className="max-w-[580px] w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="join">Ingressar</TabsTrigger>
        <TabsTrigger value="create">Nova reunião</TabsTrigger>
      </TabsList>
      <TabsContent value="join">
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
                autoFocus
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="roomKey">Chave de entrada:</Label>
              <Input id="roomKey" type="password" placeholder="xxxxx" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full uppercase" variant="default">
              Entrar
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="create">
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
              <Input id="roomKey" type="password" autoFocus />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button className="w-full uppercase" variant="default">
              Criar
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FormWrapper;
