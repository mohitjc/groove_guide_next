// window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// const recognition = new SpeechRecognition();
(window as any).SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
const SpeechRecognition = (window as any).SpeechRecognition;
const recognition = SpeechRecognition ? new SpeechRecognition() : "";

const textToVoice = (text = "") => {
  if ("speechSynthesis" in window) {
    console.log("Speech Synthesis is supported 🎉");
  } else {
    console.log("Speech Synthesis is not Supported 😞");
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = 1;
  utterance.rate = 0.8;
  // utterance.pitch=2
  utterance.lang = "en";
  speechSynthesis.speak(utterance);
};

const removestep = (itm: any) => {
  let label = "";
  const sarr = itm.split(" ");

  if (sarr?.[0]?.toLowerCase() == "step") {
    delete sarr[0];
    delete sarr[1];
  }

  label = sarr.join(" ");
  // itm.split(' ').map((sitm,i)=>{
  //   if(sitm.toLowerCase()=='step' && i==0){
  //   }else{
  //     label+=sitm+' '
  //   }
  // })
  return label;
};

const getStepsfromString = (str: any) => {
  let value: any = [];

  if (str) {
    const arr = str.split("\n\n");
    arr.map((itm: any) => {
      const string = itm ? itm : "";
      if (
        string &&
        !string.toLowerCase().includes("step-by") &&
        !string.includes("by following these") &&
        !string.includes("sorry, i am unable") &&
        !string.includes("Sure! Here are the steps") &&
        !string.includes("here are the steps")
      ) {
        value.push(removestep(itm).replace(":", "."));
      }
    });

    if (value.length == 0 || value.length == 1) {
      const arr = str.split("\n");
      value = [];
      arr.map((itm: any) => {
        const string = itm ? itm : "";
        if (
          string &&
          !string.includes("Step-by") &&
          !string.includes("by following these") &&
          !string.includes("sorry, i am unable") &&
          !string.includes("Sure! Here are the steps") &&
          !string.includes("here are the steps")
        ) {
          value.push(removestep(itm).replace(":", "."));
        }
      });
    }
  }
  return value;
};

const getStepsfromSteps = (str: any) => {
  const value: any = [];

  if (str) {
    const arr = str.split("^^");
    arr.map((itm: any) => {
      const string = itm ? itm : "";
      if (string) {
        value.push(string);
      }
    });
  }
  return value;
};

const speechModel = {
  recognition,
  textToVoice,
  getStepsfromString,
  getStepsfromSteps,
};

export default speechModel;
