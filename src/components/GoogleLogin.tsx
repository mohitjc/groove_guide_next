import React, { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useDispatch } from "react-redux";
import { FcGoogle } from "react-icons/fc";
import envirnment from "@/envirnment";
import Modal from "./Modal";
import { loaderHtml } from "@/utils/shared";
import ApiClientB from "@/utils/Apiclient";
import { login as login_success} from "@/redux/slices/userSlice";
import datepipeModel from "@/utils/datepipemodel";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import FormControl from "./FormControl";

type Props={
  isSignUp?:boolean;
  code?:any;
  result?:(e?:any)=>void
}

function GoogleLogin({ isSignUp=false, code='',result=(e:any)=>{} }:Props) {
  const pathname = window.location.pathname.split('/')[1]
  const isSurvey=pathname=='cs'||pathname=='s'?true:false
  const router=useRouter()
  const history = (p='')=>{
    router.push(p)
  }
  const dispatch = useDispatch();
  const [data, setData] = useState<any>();
  const [form, setForm] = useState({
    date_of_birth: "",
  });
const {get,put,post}=ApiClientB()

  
     const params = useSearchParams()

  const {code:surveyId,month,year}=useParams()
  const [show, setShow] = useState(false);
  const query = params.get("product")||params.get("productId");


  const setLogin = async (data:any) => {
    const hasOnboarding =  data?.primary_interest?true:false;
    let url =
      query != null
        ? `/myjournal/?product=${query}`
        : hasOnboarding
          ? "/"
          : "/getstarted";

      if (data.isVerified == 'N' ||!data.birthday||!data.mobileNo) {
        url = `/verify/details?id=${data?._id}&productId=${query}`
      }

    localStorage.setItem("token", data.access_token);
    dispatch(login_success(data));
    if(isSurvey){
      // history(`/cancellation-survey?id=${data.id||data._id}`);
    }else{
      history(url);
    }
    result({type:'response',value:data})
  };

  const googleResponseMessage = (response:any) => {
    axios
      .get(`https://www.googleapis.com/oauth2/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${response?.access_token}`,
          Accept: "application/json",
        },
      })
      .then((res) => {
        const payload = {
          email: res?.data?.email,
          firstName: res?.data?.given_name,
          lastName: res?.data?.family_name||'',
          google_image: res?.data?.picture,
          image: res?.data?.picture,
          role: envirnment.userRoleId,
          referal_code: code,
          surveyId:surveyId,
          month:String(month||new Date().getMonth()+1),
          year:String(year||new Date().getFullYear()),
        };

        loaderHtml(true);
        post(`user/google/signup/login`, payload).then((res:any) => {
          loaderHtml(false);
          if (res.success) {
            localStorage.setItem("token", res.data?.access_token);
            setLogin(res.data);
          }
        });
      })
      .catch((err) => console.log(err, "==Google Error"));
  };

  const login = useGoogleLogin({ onSuccess: googleResponseMessage });


  const handleOnContinueClick = () => {
    loaderHtml(true);
    const formattedDate = datepipeModel.datetostring(form.date_of_birth);

    put("user/profile", {
      birthday: formattedDate,
      id: data?._id,
      referal_code: code,
    }).then((res:any) => {
      if (res.success) {
        setShow(!show);
        setForm({ date_of_birth: "" });
        setLogin(data);
        //     let uUser = { ...user, ...value };
        //     dispatch(login_success(uUser));
        //     history("/profile");
        //     // ToastsStore.success(res.message)
      }
      loaderHtml(false);
    });
  };

  function onClose() {
    setShow(!show);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => login()}
        className="flex items-center gap-4 justify-center w-full h-12 px-4 py-2 bg-white hover:bg-gray-100 active:bg-gray-200 border border-gray-300 rounded-xl shadow-sm"
      >
       <FcGoogle className="text-2xl" />

        <span className="text-sm font-medium text-gray-700">
          {isSignUp ? "Continue With Google" : "Continue With Google"}
        </span>
      </button>

      {show && (
        <Modal 
          body={<>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                      <label className="text-lg block">
                        Enter Your Date of Birth
                      </label>

                      <FormControl
                        type="dob"
                        onChange={(val: any) => {
                          setForm({ ...form, date_of_birth: val });
                        }}
                        value={form?.date_of_birth}
                        className={"logins"}
                      />

                      <div className="mt-2 flex items-center justify-end">
                        <button
                          className="bg-primary px-4 py-2  w-28 text-white text-[16px] leading-[20px] h-10 "
                          onClick={handleOnContinueClick}
                          disabled={!form.date_of_birth}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
          </>}
          result={()=>onClose()}
        />
      )}
    </>
  );
}

export default GoogleLogin;
