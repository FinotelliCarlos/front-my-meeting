import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateRoom from "./create-room";
import JoinRoom from "./join-room";

const FormWrapper = () => {
  return (
    <Tabs defaultValue="join" className="max-w-[580px] w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="join">Ingressar</TabsTrigger>
        <TabsTrigger value="create">Nova reunião</TabsTrigger>
      </TabsList>
      <TabsContent value="join">
        <JoinRoom />
      </TabsContent>
      <TabsContent value="create">
        <CreateRoom />
      </TabsContent>
    </Tabs>
  );
};

export default FormWrapper;
