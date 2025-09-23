import React, { useState, useRef } from 'react';

const AudioRecorder = ({ result = (e:any) => {} }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<any>(null);
  const [err, setErr] = useState('');
  const audioRef = useRef<any>(null);
  const mediaRecorderRef = useRef<any>(null);
  const recordedChunksRef = useRef<any>([]);

  const startRecording = async () => {
    setAudioUrl(null);
    result({
      type: 'start',
      blob: null,
    });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    }).catch((err) => {
      console.log('err', err);
      setErr(String(err));
    });

    if (!stream) {
      return;
    }

    audioRef.current.srcObject = stream;

    recordedChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
      setAudioUrl(URL.createObjectURL(blob));

      result({
        type: 'result',
        blob: blob,
      });
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    const tracks = audioRef.current.srcObject.getTracks();
    tracks.forEach((track:any) => track.stop());
    audioRef.current.srcObject = null;
    setIsRecording(false);
  };

  return (
    <div>
      {err ? (
        <div className="text-red-500 mt-3">{err}</div>
      ) : null}
      <audio ref={audioRef} className={`mt-3 ${!isRecording ? 'hidden' : ''}`} autoPlay muted />
      {isRecording ? (
        <div className="mt-3 text-center text-green-500">Recording Started</div>
      ) : null}
      {!audioUrl ? (
        <div className='mt-3 flex flex-col items-center bg-gray-100 p-4 rounded-lg'>
          {isRecording ? (
            <button type="button" className="btn btn-primary" onClick={stopRecording}>
              Stop Recording
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={startRecording}>
              Start Audio Recording
            </button>
          )}
        </div>
      ) : null}

      {audioUrl && !isRecording ? (
        <div>
          <h2 className="mt-3">Recording Preview:</h2>
          <audio src={audioUrl} controls className="w-full mt-3" />
          <button type="button" className="btn btn-primary mt-3" onClick={startRecording}>
            Record Again
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default AudioRecorder;
