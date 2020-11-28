import * as React from 'react';
import styles from './Player.module.scss';
import { IPlayerProps } from './IPlayerProps';
import { useEffect, useRef, useState } from "react";
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { IconButton, IIconProps, initializeIcons } from 'office-ui-fabric-react';

import "@pnp/polyfill-ie11"; // IE browser Support

// Initialize icons in case this example uses them
initializeIcons();

export const Player: React.FunctionComponent<IPlayerProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(undefined);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(localStorage.getItem('@Player'));
  const [videoUrl, setVideoUrl] = useState(localStorage.getItem('@Url'));
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
          // localStorage.setItem(
          //   "@Player",
          //   JSON.stringify({
          //     position: event.target.currentTime,
          //     duration: event.target.duration
          //   })

          // );
          setPlaying(() => false);
        }
      };

      videoRef.current.ontimeupdate = (event: any) => {
        console.log("OnTimeUpdated", event);
        if (event && event.target && event.target.duration && event.target.currentTime) {
          setDuration(() => event.target.duration);
          setPosition(() => event.target.currentTime);
          setVideoUrl(()=> videoRef.current.src);
        }

      };

      // If we're loading the same video, reset the location to the last location
      if (videoUrl === videoRef.current.src) {
        videoRef.current.currentTime = +position;
      } else {
        // Otherwise, start at the beginning
        videoRef.current.currentTime = 0;
      }

    }
  }, [videoRef]);

  React.useEffect(() => {
    console.log("Setting the video URL", videoUrl);
    localStorage.setItem('@Url', videoUrl);
  }, [videoUrl]);

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

  function SetTime(newPosition: number) {
    videoRef.current.currentTime = newPosition;
  }

  function DisplayTime(timePosition: number): string {
    const minutes: number = Math.floor(timePosition/60);
    const seconds: number = timePosition % 60;

    return pad(minutes.toFixed(0),2) + ":" + pad(seconds.toFixed(0),2);
  }

  function pad(num: string, size: number): string {
    var s = "000000000" + num;
    return s.substr(s.length-size);
}

  //const url: string = "https://media.w3.org/2010/05/sintel/trailer_hd.mp4";
  //const url: string = "https://codrz.sharepoint.com/sites/LMS/_layouts/15/download.aspx?SourceUrl=%2Fsites%2FLMS%2FShared%20Documents%2FAzureDevOps%2Emp4";

  const playIcon: IIconProps = { iconName: 'Play' };
  const pauseIcon: IIconProps = { iconName: 'Pause' };


  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: 400, height: 400 }}
        src={props.videoUrl}
        //controls
        >
      </video>

      <Slider
        max={duration}
        value={+position}
        label={`${DisplayTime(+position)}/${DisplayTime(duration)}`}
        onChange={(newTime: number)=>SetTime(newTime)}
        showValue={false}
      />
      <IconButton iconProps={playing ? pauseIcon : playIcon} title={playing ? "Pause": "Play"} ariaLabel={playing ? "Pause": "Play"} onClick={() =>(playing ? PausePlayer() : ResumePlayer()) }  />

    </div>
  );
};
