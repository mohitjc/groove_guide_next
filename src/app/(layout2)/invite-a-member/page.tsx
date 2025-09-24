"use client";
import { Fragment, useState } from "react";
import ApiClientB from "@/utils/Apiclient";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import TooltipHtml from "@/components/TooltipHtml";
import { loaderHtml } from "@/utils/shared";
import { emailPattern } from "@/utils/shared.utils";
import { fire } from "@/components/Swal";

function InviteMember() {
  const [submitted, setSubmitted] = useState(false);
  const {post}=ApiClientB()
  const [exist, setExist] = useState<any>([]);
  const history = useRouter();
  const [invites, setInvites] = useState([
    {
      fullName: "",
      email: "",
    }
  ])

  const handleSubmit = () => {
    setSubmitted(true);
    const value = {
      data: invites
    };

    let invalid = false

    invites.map((itm, i) => {
      if (emailExist(itm.email, i)) invalid = true
    })

    // if(invites.find(itm=>exist.includes(itm.email))){
    //   invalid=true
    // }

    if (invalid) return

    loaderHtml(true)
    post("referal/multipleInvites", { ...value }).then((res) => {
      loaderHtml(false)
      if (res.success) {
        const alreadyExist = res.alreadyExist || []
        let message = 'Member invited successfully'
        if (alreadyExist.length) {
          message = `${alreadyExist.join(' ,')} ${alreadyExist.length > 1 ? 'are' : 'is an'} existing member${alreadyExist.length > 1 ? 's' : ''} and ${alreadyExist.length > 1 ? 'were' : 'was'} not invited.`
          if(alreadyExist.length!=invites.length){
            message+=` Other members were invited successfully.`
          }
        }

        fire({
          // imageUrl: "/assets/img/age.png",
          icon: alreadyExist.length ? 'warning' : 'success',
          imageHeight: 120,
          // title: "Age Restricted!",
          description: message,
          confirmButtonText: "Ok",
        });

        if (!alreadyExist.length) {
          setSubmitted(false);
          setInvites([{ fullName: "", email: "" }]);
          history.push("/referrals");
        } else {
          setExist(alreadyExist)
          let arr = invites
          arr = arr.filter((itm) => alreadyExist.includes(itm.email))
          setInvites([...arr.map(itm => ({ ...itm }))])
        }

      }
    });
  };

  const updateInvite = (i:any, value:any, key:any) => {
    const arr:any = invites
    arr[i][key] = value
    setInvites([...arr])
  }

  const addInvite = () => {
    const arr = invites
    arr.push({
      fullName: "",
      email: "",
    })
    setInvites([...arr])
  }

  const removeInvite = (i:any) => {
    let arr = invites
    arr = arr.filter((itm, index) => index != i)
    setInvites([...arr])
  }

  const emailExist = (email = '', i:any) => {
    const ext = invites.find((itm, index) => (index != i && itm.email == email && itm.email))
    return ext ? true : false
  }

  return (
    <>
      <div className="pt-4 lg:px-4  ">
        <div className="w-[100%]">

          <div className="grid grid-cols-12 gap-4 xl:gap-6 items-center bg-gray-50">
            <div className="col-span-12 lg:col-span-3 hidden lg:block">
              <img src="./assets/img/Invite.jpg" className="h-[400px] w-full object-cover" />
            </div>
            <div className="col-span-12 lg:col-span-9">
              <div className="p-4 lg:p-8 ">
                <h6 className="text-[20px] xl:text-[30px]  text-black font-semibold">
                  Invite a Member to Groove Group
                </h6>

                <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                  <div className="space-y-6">
                    {invites.map((itm, i) => (
                      <Fragment key={i}>
                        <div className="bg-gray-50 mt-4 border border-gray-300 rounded-2xl p-5 shadow-sm space-y-5 lg:space-y-0 lg:flex lg:items-start lg:gap-4">
                          {/* Full Name */}
                          <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <input
                              type="text"
                              value={itm.fullName}
                              placeholder="John Doe"
                              onChange={(e) => updateInvite(i, e.target.value, 'fullName')}
                              className="h-12 w-full rounded-lg border border-gray-400 px-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                          </div>

                          {/* Email */}
                          <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                              type="text"
                              value={itm.email}
                              placeholder="john@example.com"
                            //   pattern={emailPattern.test(itm.email||'')?'':'ssdsd#'}
                              onChange={(e) => updateInvite(i, e.target.value, 'email')}
                              title={itm.email?'Please enter a valid email address':''}
                              className="h-12 w-full rounded-lg border border-gray-400 px-4 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                              required
                            />
                            {/* Email validation messages */}
                            {emailExist(itm.email, i) && (
                              <p className="text-red-600 text-xs mt-1">You already entered this Email</p>
                            )}
                            {!emailExist(itm.email, i) && exist.includes(itm.email) && (
                              <p className="text-red-600 text-xs mt-1">This Email already exists</p>
                            )}
                          </div>

                          {/* Remove Button */}
                          {invites.length > 1 && (
                            <div className="flex justify-end lg:pt-6 shrink-0">
                              <TooltipHtml placement="top" title="Delete">
                                <button
                                  type="button"
                                  onClick={() => removeInvite(i)}
                                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl p-2.5 h-11 w-11 flex items-center justify-center transition"
                                >
                                  <FiTrash2 className="text-lg" />
                                </button>
                              </TooltipHtml>
                            </div>
                          )}


                        </div>
                      </Fragment>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end gap-4 mt-8">
                    {/* Add Button */}

                    <div className=" ">
                      <TooltipHtml placement="top" title="Add More">
                        <button
                          type="button"
                          onClick={addInvite}
                          className="bg-gray-400 hover:bg-primary/90 text-white rounded-xl px-4 h-12 w-full  flex items-center justify-center gap-2 transition"
                        >
                          <FiPlus className="text-lg" />
                          <span className=" text-sm font-medium">Add More</span>
                        </button>
                      </TooltipHtml>
                    </div>

                    <button
                      type="submit"
                      className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 text-sm font-semibold tracking-wide transition"
                    >
                      Invite
                    </button>
                  </div>
                </form>



              </div>

            </div>
          </div>



        </div>
      </div>
    </>
  );
}

export default InviteMember;
