import { AnyCaaRecord } from 'node:dns';
import React, { useState, useRef } from 'react';

const VideoRecorder = ({result=(e:any)=>{}}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<any>(null);
  const [err, setErr] = useState('');
  const videoRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const recordedChunksRef = useRef<any>([]);

  const startRecording = async () => {
    setVideoUrl(null)
    result({
        type:'start',
        blob:null
      })
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    }).catch(err=>{
        console.log("err",err)
        setErr(String(err))
    });

    // console.log("stream",stream)
    if(!stream){
        return
    }

    videoRef.current.srcObject = stream;
    videoRef.current.play();

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event:any) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));
    //   console.log("blob",blob)
    //   console.log("URL.createObjectURL(blob)",URL.createObjectURL(blob))

      result({
        type:'result',
        blob:blob
      })
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach((track:any) => track.stop());
    videoRef.current.srcObject = null;
    setIsRecording(false);
  };

  return (
    <div>
      {err?<>
      <div className='text-red-500 mt-3'>{err}</div>
      </>:<></>}
      <video ref={videoRef} className={`w-full h-[200px] mt-3 ${!isRecording?'hidden':''}`} autoPlay muted />
      {isRecording?<>
      <div className='mt-3 text-center text-green-500'>Recording Started</div>
      </>:<></>}
      {!videoUrl?<>
        <div className='mt-3 flex flex-col items-center bg-gray-100 p-4 rounded-lg'>
        {isRecording ? (
          <button type='button' className='btn btn-primary' onClick={stopRecording}>Stop Recording</button>
        ) : (
          <button type='button' className='btn btn-primary' onClick={startRecording}>Start Video Recording</button>
        )}
      </div>
      </>:<></>}
     
      {videoUrl && !isRecording ?(
        <div>
          <h2 className='mt-3'>Recording Preview:</h2>
          <video src={videoUrl} controls className='w-full h-[200px] mt-3' />
          <button type='button' className='btn btn-primary mt-3' onClick={startRecording}>Record Again</button>
        </div>
      ):<></>}
    </div>
  );
};

export default VideoRecorder;
