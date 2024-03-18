"use client";

import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";

interface ISocketContext {
  socket: Socket | null;
}

interface ISocketProvider {
  children: ReactNode;
}

export const SocketContext = createContext({} as ISocketContext);

export const SocketProvider = ({ children }: ISocketProvider) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  const ctxValue: ISocketContext = useMemo(() => {
    return { socket };
  }, [socket]);

  const handleCreateSocket = useCallback((): void => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_URL}/streams`, {
      transports: ["websocket"],
    });
    setSocket(newSocket);
  }, []);

  useEffect(() => {
    handleCreateSocket();
  }, [handleCreateSocket]);

  return (
    <SocketContext.Provider value={ctxValue}>{children}</SocketContext.Provider>
  );
};

export default function useSocket() {
  return useContext(SocketContext);
}
