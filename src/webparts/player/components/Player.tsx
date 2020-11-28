import * as React from 'react';
import styles from './Player.module.scss';
import { IPlayerProps } from './IPlayerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useEffect, useRef, useState } from "react";

import "@pnp/polyfill-ie11"; // IE browser Support
import { DefaultButton, PrimaryButton} from 'office-ui-fabric-react';

/*export default class Player extends React.Component<{},any> {

  public VideoPlayer : React.RefObject<HTMLVideoElement>;

  constructor(props: any)
  {
    super(props);
    this.state = { isPlaying : 'False',};
  }
  

  public PlayVideo()
  {
      this.setState({'isPlaying':false});

      const isPlaying = this.state.isPlaying;

      if(isPlaying)
      {
         this.VideoPlayer.current.pause();
      }
      else
      {
        this.setState({'isPlaying':true});
        this.VideoPlayer.current.play();
      }
  }

  
  
  public render(): React.ReactElement<IPlayerProps> {
    return (
      <div>
        <video ref={function(ref: any) { this.VideoPlayer = ref }.bind(this)}
            width="400"
            height="400" controls
            id="VideoPlayer">
            <source src ="https://codrz.sharepoint.com/:v:/r/sites/LMS/Shared%20Documents/AzureDevOps.mp4"/> 
            </video><br/>
            <PrimaryButton text="Play" onClick={this.PlayVideo.bind(this)}>{isPlaying}</PrimaryButton>>
      </div>
    );
  }
}*/

function Login() {
  const videoRef = useRef<any>(undefined);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (videoRef) {
      videoRef.current.load();
      videoRef.current.onplay = function (event: any) {
        setPlaying(() => true);
      };

      videoRef.current.onpause = function (event: any) {
        localStorage.setItem(
          "@Player",
          JSON.stringify({
            position: event?.target?.currentTime,
            duration: event?.target?.duration
          })
        );
        setPlaying(() => false);
      };

      videoRef.current.ontimeupdate = function (event: any) {
        setDuration(() => event?.target?.duration);
        setPosition(() => event?.target?.currentTime);
      };
    }
  }, [videoRef]);

  function PausePlayer() {
    videoRef.current.pause();
  }

  function ResumePlayer() {
    videoRef.current.play();
  }

  async function SetRememberedTime() {
    let item = await localStorage.getItem("@Player");
    if (item) {
      let itemJson = JSON.parse(item);
      setDuration(() => itemJson.duration);
      setPosition(() => itemJson.position);
      videoRef.current.currentTime = itemJson.position;
    }
  }

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: 400, height: 400 }}
        src={require("https://mercuriusit.sharepoint.com/:v:/r/sites/365Maxlearning/Course%20Content/C2020AZUR11%20-%20Azure%20DevOps%20Concept/AzureDevOps.mp4")}
        controls>
      </video>

      <button onClick={() => SetRememberedTime()}>Set Remembered Time</button>
      <button onClick={() => videoRef && videoRef.current && videoRef.current.play()}>Play Video</button>
      <button onClick={() => (playing ? PausePlayer() : ResumePlayer())}>{playing ? "Pause" : "Resume"}
      </button>

      <div>
        {position.toFixed(2)}/{duration.toFixed(2)}
      </div>

      <input
        type="range"
        min={0}
        max={duration}
        value={position}
        style={{ width: 300 }}
      />
    </div>
  );
}

export default Login;