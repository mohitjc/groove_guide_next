import { getRandomCode } from "@/utils/shared";
import speechModel from "@/utils/speech.model";
import { useState } from "react";

type Props={
  text:string;
  setText:(_:any)=>void;
  inputId?:string
}

export default function SpeachToText({text='',setText=(e:any)=>{console.log(e);
},inputId='voicemessage'}:Props){
      const [speachStart, setSpeachStart] = useState(false);
      const stop = () => {
        const recognition = speechModel.recognition;
        recognition.stop();
        setSpeachStart(false);
      };

      const id=getRandomCode(7)
    
    const voice = () => {
        const voiceBtn = document.getElementById(`voiceBtn_${id}`);
        if (speachStart) {
          stop();
          return;
        }
    
        setSpeachStart(true);
        const recognition = speechModel.recognition;
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = true;
    
        recognition.onresult = async (event:any) => {
          const transcript = Array.from(event.results)
            .map((result:any) => result[0])
            .map((result) => result.transcript)
            .join("\n");
    
          const el:any = document.getElementById(inputId);
    
          let message = text;
    
          message = `${message}\n${transcript}`;
          setText(message);
    
          if (el) {
            el.value = `\n${transcript}`;
          }
        };
    
        recognition.start();
        recognition.onspeechend = () => {
          // recognition.stop();
          setSpeachStart(false);
          voiceBtn?.classList.remove("glowing");
        };
      };
    return <>
    <button
                          type="button"
                          onClick={voice}
                          className={`btn btn-outline-dark px-3 mb-3 btnmi ${speachStart ? "glowing" : ""
                            }`}
                          id={`voiceBtn_${id}`}
                        >
                          <i className="fa fa-microphone mr-1"></i> Type
                          or Speak
                        </button>
    </>
}