import global from 'global'
import * as process from "process";
global.process = process;
import { useState, useEffect, useRef } from "react";
import ReactHowler from "react-howler";
import { pictures,hiphop } from "../assets/hiphop";
import SimplePeer from 'simple-peer';
/* global VideoPipe */


const StreamPlayer = () => {
  const [play, setPlay] = useState(true); // Set initial state to true
  const [muted, setMuted] = useState(true); // New state for muting/unmuting
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1); // Initialize nextIndex to 1
  const [index, setIndex] = useState(0);
  const [array, setArray] = useState([])

  const [streaming, setStreaming] = useState(false);
  const [stream, setStream] = useState(null);
  const [peer, setPeer] = useState(null);

  const audioRef = useRef(null);
  const peerRef = useRef(null);

  const image = muted ? pictures[0] : pictures[1]; // Update image based on muted state
  const music = hiphop;

  const toggleAudio = () => {
    setMuted((prevMuted) => !prevMuted); // Toggle muted state
  };


  const handleEnd = () => {
    const randomIndex = Math.floor(Math.random() * music.length);
    setCurrentIndex(nextIndex); // Move to the next song
    setNextIndex((prevIndex) => (prevIndex + 1) % music.length); // Calculate the index of the next song
    setArray((prevArray) => [...prevArray, randomIndex]);
  };

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * music.length);
    setIndex(randomIndex); 
    setCurrentIndex(randomIndex);
  }, []);

  useEffect(() => {
    // Function to initialize the peer connection
    const initializePeer = async () => {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const newPeer = new SimplePeer({ initiator: true, trickle: false, stream: audioStream });
        setPeer(newPeer);

        newPeer.on('signal', signal => {
          console.log('Sending signal to peer:', signal);
        });

        newPeer.on('stream', remoteStream => {
          console.log('Received audio stream from peer:', remoteStream);
          if (audioRef.current) {
            audioRef.current.srcObject = remoteStream;
          }
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

  const song = music[currentIndex] ? ( music[currentIndex] ).title :  "";
  
  return (
    <div className="home">
      
      <div className="player-controls">
      <div className="player">
        <ReactHowler
          key={index}
          src={music[currentIndex]?.url}
          playing={play}
          loop={true} // Set loop to true to continue playing after it finishes
          mute={muted} // Set mute state
          html5={true}
          preload={true}
          onEnd={handleEnd} // Call handleEnd when the current song ends
        />
        <img id="pp-img" onClick={toggleAudio} src={image} alt="Mute/Unmute" />

      </div>  
        <div className="card">
          <h3 className="title">{song}</h3>
        </div>
      </div>
        <img className="giphy" src={pictures[2]} alt="apes" />
      
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
