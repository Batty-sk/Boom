import { createContext } from "react";
import Peer from 'peerjs'

type PeerT={
    myPeer:Peer|undefined,
    setmyPeer:React.Dispatch<React.SetStateAction<Peer | undefined>>;
}

const myPeerContext=createContext<PeerT|undefined>(undefined)

export default myPeerContext