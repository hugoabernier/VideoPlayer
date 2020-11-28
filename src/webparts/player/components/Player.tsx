import * as React from 'react';
import styles from './Player.module.scss';
import { IPlayerProps } from './IPlayerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { useEffect, useRef, useState } from "react";

import "@pnp/polyfill-ie11"; // IE browser Support
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';

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
  const videoRef = useRef<HTMLVideoElement>(undefined);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(localStorage.getItem('@Player'));
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    console.log("Use Effect", videoRef);
    if (videoRef) {
      videoRef.current.load();
      videoRef.current.onplay = (event: any) => {
        setPlaying(() => true);
      };

      videoRef.current.onpause = (event: any) => {
        if (event && event.target && event.target.duration && event.target.currentTime) {
          localStorage.setItem(
            "@Player",
            JSON.stringify({
              position: event.target.currentTime,
              duration: event.target.duration
            })

          );
          setPlaying(() => false);
        }
      };

      videoRef.current.ontimeupdate = (event: any) => {
        console.log("OnTimeUpdated", event);
        if (event && event.target && event.target.duration && event.target.currentTime) {
          setDuration(() => event.target.duration);
          setPosition(() => event.target.currentTime);
        }

      };

      SetRememberedTime();
    }
  }, [videoRef]);

  React.useEffect(() => {
    console.log("Setting the position", position);
    localStorage.setItem('@Player', position);
  }, [position]);


  function PausePlayer() {
    console.log("Pause", videoRef);
    videoRef.current.pause();
  }

  function ResumePlayer() {
    console.log("Resume", videoRef);
    videoRef.current.play();
  }

  function SetRememberedTime() {
    console.log("Set Remembered Time", videoRef);
    // let item = await localStorage.getItem("@Player");
    // if (item) {
    //   let itemJson = JSON.parse(item);

    //   if (itemJson.duration && itemJson.position) {
    //     setDuration(() => itemJson.duration);
    //     setPosition(() => itemJson.position);
        videoRef.current.currentTime = +position;
    //   }
    // }
  }

  const videoUrl: string = "https://media.w3.org/2010/05/sintel/trailer_hd.mp4";
  //const videoUrl: string = "https://codrz.sharepoint.com/:v:/s/LMS/EWD68MK7MH1Om2LHpxn1rmMBPvjHCQx3bs1IL7muCmXQIQ?e=YPw9Wa";

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: 400, height: 400 }}
        src={videoUrl}
        controls
        >
      </video>

      {/* <button onClick={() => SetRememberedTime()}>Set Remembered Time</button>
      <button onClick={() => videoRef && videoRef.current && videoRef.current.play()}>Play Video</button> */}
      <button onClick={() => (playing ? PausePlayer() : ResumePlayer())}>{playing ? "Pause" : "Play"}</button>

      <div>
        {(+position).toFixed(2)}/{duration.toFixed(2)}
      </div>

      {/* <input
        type="range"
        min={0}
        max={duration}
        value={position}
        style={{ width: 300 }}
      /> */}
    </div>
  );
}

export default Login;
