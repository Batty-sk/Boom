import { createContext } from "react";
type MediaStreamContextType = {
    stream: MediaStream | null;
    setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  };
  
  // Create the context
  const MediaStreamContext = createContext<MediaStreamContextType | undefined>(undefined);

  export default MediaStreamContext
  