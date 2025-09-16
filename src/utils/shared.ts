import envirnment from "@/envirnment";

export const APP_NAME='Groove Guide'
export const APP_DESCRIPTION='Explore personalized resources, exclusive rewards, and a thriving community—all in one place.'

export const loaderHtml = (p: boolean) => {
  const loaderEl = document.getElementById("loader");
  if (!loaderEl) return;
  if (p) {
    loaderEl.classList?.remove("hidden");
  } else {
    loaderEl.classList?.add("hidden");
  }
};

export const noImg = (img:any='', defaultImg = '/assets/img/placeholder.png') => {
  let value = defaultImg;
  if (img?.includes("https")) return img;
  if (img) value = `${envirnment.image_path}${img}`;
  return value;
};

export const isNumber = (e:any) => {
  const key = e.target;
  const maxlength = key.maxLength ? key.maxLength : 0;

  const max = Number(key.max ? key.max : key.value);
  if (Number(key.value) > max) key.value = max;

  // let min = key.min;
  // if (min && Number(key.value)<Number(min)) key.value = min;


  if (maxlength > 0) {
    if (key.value.length > maxlength) key.value = key.value.slice(0, maxlength);
  }

  key.value = key.value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");

  return key.value;
};

export function getRandomCode(length = 5) {
  const letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

type ReplaceUrlType={
  url?:string;
  parm?:any;
  title?:string;
  description?:string
}

export const replaceUrl = ({
  url='',
  parm = {},
  title = "Groove Guide",
  description = "",
}:ReplaceUrlType) => {
  const params = new URLSearchParams();
  const dazhHomeUrl = "";
  Object.keys(parm).map((key) => {
    params.append(key, parm[key]);
  });

  const u = `${dazhHomeUrl}${url}` + params.toString();
  const nextTitle = title;
  const nextState = { additionalInformation: description };
  window.history.replaceState(nextState, nextTitle, u);
};

export const scrollId = (id:string) => {
  const element = document.getElementById(id);
  const headerOffset = 85;
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    // var offsetPosition = elementPosition - headerOffset;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "instant" });
  } else {
    console.log("id", id);
    console.log("element", element);
  }

  return element;
};