import global from 'global'
import * as process from "process";
global.process = process;
import { useState, useEffect, useRef } from "react";
import SimplePeer from 'simple-peer';


const StreamPlayer = () => {
  const [streaming, setStreaming] = useState(false);
  const [peer, setPeer] = useState(null);

  const audioRef = useRef(null);

  useEffect(() => {
    const initializePeer = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newPeer = new SimplePeer({ initiator: true, trickle: false, stream: audioStream });
        setPeer(newPeer);

        newPeer.on('signal', signal => {
          console.log('Sending signal to peer:', signal);
        });

        setStreaming(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    if (streaming && !peer) {
      initializePeer();
    }

    return () => {
      if (peer) {
        peer.destroy();
        setPeer(null);
        setStreaming(false);
      }
    };
  }, [streaming, peer]);

  useEffect(() => {
    const handleStream = remoteStream => {
      console.log('Received audio stream from peer:', remoteStream);
      if (audioRef.current) {
        audioRef.current.srcObject = remoteStream;
      }
    };

    if (peer) {
      peer.on('stream', handleStream);
    }

    return () => {
      if (peer) {
        peer.off('stream', handleStream);
      }
    };
  }, [peer]);

  const toggleStreaming = () => {
    if (streaming) {
      if (peer) {
        peer.destroy();
        setPeer(null);
        setStreaming(false);
      }
    } else {
      setStreaming(true);
    }
  };
  
  return (
    <div className="home">      
        <div>
      <button onClick={toggleStreaming}>
        {streaming ? 'Stop Streaming' : 'Start Streaming'}
      </button>
      <audio ref={audioRef} autoPlay/>
    </div>
    </div>
  );
};

export default StreamPlayer;
