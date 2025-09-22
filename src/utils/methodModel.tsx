import environment from "../envirnment";


type replaceUrl={
  url:string;
  parm :any;
  title :any;
  description:any
}
const isTranslatePage = () => {
  let value = false;
  let url = window.location.href;
  if (url.includes("translation")) value = true;
  return value;
};

const generatekeysArr = (arr:any, key = "typeofresult") => {
  let keys:any= {};
  if (!arr) return { keys, arr: [] };
  arr.map((itm:any) => {
    if (keys[itm[key]]) {
      keys[itm[key]].push(itm);
    } else {
      keys[itm[key]] = [itm];
    }
  });
  return {
    keys,
    arr: Object.keys(keys).map((itm) => {
      return { key: itm, value: keys[itm] };
    }),
  };
};

const userImg = (img:string) => {
    img=img?.replace('https://joincraftclub.org/images/profile-place.png','')
  if (!img) return "/assets/img/person.jpg";

  if (img.includes("https")) return img;
  return `${environment.image_path}/${img}`;
};

const noImg = (img:string, defaultImg = "/assets/img/placeholder.jpg") => {
  img=img?.replace('https://joincraftclub.org/images/profile-place.png','')
  let value = defaultImg;
  if (img?.includes("https")) return img;
  if (img) value = `${environment.image_path}${img}`;
  return value;
};

const getPrams = (p:any) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(p);
};

const isNumber = (e:any) => {
  let key = e.target;
  let maxlength = key.maxLength ? key.maxLength : 1;

  let max = Number(key.max ? key.max : key.value);
  if (Number(key.value) > max) key.value = max;

  // let min = key.min;
  // if (min && Number(key.value)<Number(min)) key.value = min;

  if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
  key.value = key.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

  return key.value;
};

const isRatio = (e:any) => {
  let key = e.target;
  let maxlength = key.maxLength ? key.maxLength : 1;

  let max = Number(key.max ? key.max : key.value);
  if (Number(key.value) > max) key.value = max;

  // let min = key.min;
  // if (min && Number(key.value)<Number(min)) key.value = min;

  if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
  key.value = key.value.replace(/[^0-9.>]/g, "").replace(/(\..*?)\..*/g, "$1");

  return key.value;
};

const find = (arr:any, value:any, key = "key") => {
  let ext = arr?.find((itm:any) => itm[key] == value);
  return ext;
};

/* ###################### Form Methods #########################  */

// get Single field error
const getError = (key:any, fvalue:any, formValidation:any) => {
  let ext = find(formValidation, key);
  let res = matchError(ext, fvalue);
  return res;
};

const emailRequiredFor = (role:any) => {
  let value = false;
  if (
    role == "Clinic Admin" ||
    role == "Counsellor" ||
    role == "Owner" ||
    role == "admin"
  )
    value = true;
  return value;
};

const validateUsername = (val:any) => {
  return /^(?=[a-zA-Z0-9._-]{8,20}$)(?!.*[_.-]{2})[^_.-].*[^_.-]$/.test(val);
};

const dialMatch = (val:any) => {
  let value = false;
  value = val.match(/^(?=.*[0-9])(?=.*[+])[0-9+]{2,5}$/);
  return value;
};
const emailvalidation = (val:any) => {
  if (
    val.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  ) {
    return true;
  }
  // if(!val.includes(".")){
  //     return false
  // }
  return false;
};
// match errors for fields
const matchError = (ext:any, fValue:any) => {
  let invalid = false;
  let kValue = fValue[ext.key];
  let value = {
    minLength: false,
    maxLength: false,
    confirmMatch: false,
    required: false,
    email : false,
    dialCode:false,
    username:false
  };
  let message = "";
  if (ext.required) {
    if (!kValue || (!kValue.length && typeof kValue != "object")) {
      invalid = true;
      message = ext?.message || "This is Required";
    }
  }
  if (ext.minLength && kValue) {
    if (kValue.length < ext.minLength) {
      value.minLength = true;
      message = ext?.message || `Min Length is ${ext.minLength}`;
    }
  }
  if (ext.email && kValue) {
    if (!emailvalidation(kValue)) {
      value.email = true;
      message = ext?.message || `Email is invalid`;
    }
  }
  if (ext.maxLength && kValue) {
    if (kValue.length > ext.maxLength) {
      value.maxLength = true;
      message = ext?.message || `Max Length is ${ext.maxLength}`;
    }
  }
  if (ext.dialCode && kValue) {
    if (dialMatch(kValue)) {
      kValue.indexOf("+");
      if (kValue.indexOf("+") != 0) {
        value.dialCode = true;
        message = ext?.message || `DialCode is Invalid`;
      }
    } else {
      value.dialCode = true;
      message = ext?.message || `DialCode is Invalid`;
    }
  }

  if (ext.username && kValue) {
    if (!validateUsername(kValue)) value.username = true;
  }

  if (ext.confirmMatch && kValue) {
    if (fValue[ext.confirmMatch[0]] != fValue[ext.confirmMatch[1]]) {
      value.confirmMatch = true;
      message = ext?.message || `Confirm Password is not matched`;
    }
  }

const vArr = Object.keys(value) as (keyof typeof value)[];

vArr.map((itm) => {
  if (value[itm]) invalid = true;
});

  let res = { invalid: invalid, err: value, message };
  return res;
};

// get form error (All Fields)
const getFormError = (formValidation:any, fvalue:any) => {
  let invalid = false;
  formValidation.map((ext:any) => {
    if (matchError(ext, fvalue).invalid) {
      invalid = true;
    }
  });

  return invalid;
};

/* ###################### Form Methods end #########################  */

const route = (route:any) => {
  localStorage.setItem("route", route);
  let el = document.getElementById("routerDiv");
  setTimeout(() => {
    if (el) el.click();
  });
};

const flagIcon = (icon = "", width = 50) => {
  const imageErr = (e:any) => {
    e.target.src = "/assets/img/placeholder.png";
  };
  return (
    <>
      <img
        src={`https://flagsapi.com/${icon?.toUpperCase()}/flat/64.png`}
        width={width}
        onError={imageErr}
      />
    </>
  );
};

const msToTime = (milliseconds:any, ago = true) => {
  //get hours from milliseconds
  var hours = milliseconds / (1000 * 60 * 60);
  var absoluteHours = Math.floor(hours);
  var h:any = absoluteHours;
  //get remainder from hours and convert to minutes
  var minutes = (hours - absoluteHours) * 60;
  var absoluteminutes = Math.floor(minutes);
  var m:any = absoluteminutes;

  //get remainder from minutes and convert to seconds
  var seconds = (minutes - absoluteminutes) * 60;
  var absoluteseconds = Math.floor(seconds);
  var s = absoluteseconds;

  var time = "";
  if (h > 0) {
    time += `${h}h`;
  }
  if (m > 0) {
    time += ` ${m}m`;
  }

  if (ago) {
    if ((h == 0) && (m == 0)) {
      time += `a few seconds`;
    }
    time += " ago";
  }
  return time;
};

const scrollId = (id:any) => {
  let element = document.getElementById(id);
  var headerOffset = 85;
  if (element) {
    var elementPosition = element.getBoundingClientRect().top;
    var offsetPosition = elementPosition - headerOffset;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "instant" });
  } else {
    console.log("id", id);
    console.log("element", element);
  }

  return element;
};

const scrollInView = (id = "") => {
  const target = document.getElementById(id);
  if (target) {
    target.scrollIntoView({ behavior: "instant", block: "center" });
    localStorage.removeItem("infoScroll");
  } else {
    console.log("scrollInView", id);
  }
  return target;
};

const replaceUrl = ({
  url,
  parm = {},
  title = "Groove Guide",
  description = "",
}:replaceUrl) => {
  const params = new URLSearchParams();
  let dazhHomeUrl = "";
  Object.keys(parm).map((key) => {
    params.append(key, parm[key]);
  });

  let u = `${dazhHomeUrl}${url}` + params.toString();
  const nextTitle = title;
  const nextState = { additionalInformation: description };
  window.history.replaceState(nextState, nextTitle, u);
};

const methodModel = {
  replaceUrl,
  scrollInView,
  userImg,
  route,
  flagIcon,
  isNumber,
  isRatio,
  find,
  getError,
  getFormError,
  getPrams,
  emailRequiredFor,
  emailvalidation,
  noImg,
  isTranslatePage,
  generatekeysArr,
  msToTime,
  scrollId,
};
export default methodModel;
