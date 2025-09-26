"use client";
import React, { useState, useEffect } from "react";
import ApiClientB from "@/utils/Apiclient";
import { loaderHtml } from "@/utils/shared";
import "./style.scss";
import Html from "./Html";
import { useRouter } from "next/navigation";
import formModel from "@/components/Model/form.model";
import { useDispatch, useSelector } from "react-redux";
import { login as login_success} from "@/redux/slices/userSlice";

const EditProfile = () => {
  const user = useSelector((state: any) => state.user.data);
  const dispatch = useDispatch();
  const [data, setData] = useState("");
  const {get,put}=ApiClientB()
  const [form, setForm]: any = useState({
    id: "",
    email: "",
    mobileNo: "",
    firstName: "",
    lastName: "",
    birthday: "",
    image:""
  });
  const [images, setImages]: any = useState({ image: "" });
  const history = useRouter();
  const [submitted, setSubmitted] = useState(false);

  const gallaryData = () => {
    loaderHtml(true);
    get(`user/profile`, { id: user._id }).then((res) => {
      if (res.success) {
        const payload = form;
        const value = res.data;
        const oarr = Object.keys(form);
        oarr.map((itm) => {
          payload[itm] = value[itm] || null;
        });
        payload.id = user._id;
        setForm({ ...payload });

        console.log(form,'setForm');
        

        const img = images;
        Object.keys(images).map((itm) => {
          img[itm] = value[itm];
        });

        setImages({ ...img });
        setData(value);
      }
      loaderHtml(false);
    });
  };

  const getError = (key: any) => {
    return formModel.getError("profileForm", key);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    const invalid = formModel.getFormError("profileForm");
    if (invalid) return;

    const value = {
      ...form,
      id: user._id,
      addedBy: user._id,
      ...images,
    };
    Object.keys(value).map((itm) => {
      if (!value[itm]) value[itm] = null;
    });

    value.fullName=`${value.firstName?.trim()} ${value.lastName?.trim()}`

    loaderHtml(true);
    put("user/profile", value).then((res) => {
      if (res.success) {
        const uUser = { ...user, ...value };
        dispatch(login_success(uUser));
        history.push("/profile");
        // ToastsStore.success(res.message)
      }
      loaderHtml(false);
    });
  };

  const imageResult = (e: any, key: any) => {
    images[key] = e.value;
    setImages(images);
  };

  useEffect(() => {
    if (user) {
      gallaryData();
    }
  }, []);

  return (
    <>
      <Html
        handleSubmit={handleSubmit}
        setForm={setForm}
        form={form}
        getError={getError}
        submitted={submitted}
        imageResult={imageResult}
        images={images}
      />
    </>
  );
};

export default EditProfile;
