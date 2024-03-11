import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";

const Chat = () => {
  return (
    <div className="w-full md:max-w-[400px] md:min-w-[400px]">
      <div className="max-h-[20vh] overflow-y-auto p-2">
        {/* minha mensagem */}
        <div className="w-full flex flex-col">
          <div className="space-x-2 text-left ">
            <span className="text-zinc-400 font-bold text-sm">
              Carlos Finotelli
            </span>
            <span className="text-zinc-500 font-sans text-[0.6rem]">10:32</span>
          </div>

          <div className="text-left">
            <span className="text-primary text-xs">
              Hoje gostaria de pedir uma pizza!
            </span>
          </div>
        </div>

        {/* outra pessoa */}
        <div className="w-full flex flex-col">
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
        </div>
      </div>

      <Separator className="my-2 bg-primary-foreground" />

      <form className="w-full p-2">
        <div className="flex items-center gap-3 w-full">
          <Input className="w-full h-10" />
          <Button type="submit" className="h-10">
            <Send />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
