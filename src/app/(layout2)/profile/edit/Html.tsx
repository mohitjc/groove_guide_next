import "./style.scss";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css';
import ImageUpload from "@/components/ImageUpload/page";
import FormControl from "@/components/FormControl";
import { useRouter } from "next/navigation";

const Html = ({
  handleSubmit,
  setForm,
  form,
  getError,
  imageResult,
  images,
  submitted,
}:any) => {
  const history = useRouter();
  return (
    <>
      <div className="wrapper_section">
        <div className="flex items-center  justify-between">
          <h3 className="text-2xl font-semibold text-[#111827]">
            Edit Profile
          </h3>
        </div>

        <form name="profileForm" className="" onSubmit={handleSubmit}>
          <div className="grid grid-cols-12 mb-4 gap-4 mt-6 gap-4">
            <div className="col-span-12 md:col-span-6">
              <FormControl
                type="text"
                label="First Legal Name"
                value={form.firstName}
                onChange={(e:any) => setForm({ ...form, firstName: e })}
                required
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <FormControl
                type="text"
                label="Last Legal Name"
                value={form.lastName}
                onChange={(e:any) => setForm({ ...form, lastName: e })}
                required
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="mb-2 inline-flex">
                Mobile No<span className="star">*</span>
              </label>
              <PhoneInput
                country={"us"}
                value={form.mobileNo}
                enableSearch={true}
                
                
                onChange={(e) => setForm({ ...form, mobileNo: e })}
                countryCodeEditable={true}
              />
              {submitted && getError("mobileNo").invalid ? (
                <div className="invalid-feedback d-block">Min Length is 10</div>
              ) : (
                <></>
              )}
            </div>
            <div className="col-span-12 md:col-span-6">
              <label className="mb-2 inline-flex">Email</label>
              <input
                type="email"
                className="relative shadow-box bg-white w-full rounded-lg h-10 flex items-center gap-2 overflow-hidden px-2  !bg-gray-100 !cursor-not-allowed"
                value={form.email}
                autoComplete="false"
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                }}
                required
                disabled
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <p>Birthday</p>
              <div className="input_dates flex items-center mt-3 gap-1 w-full">
                <FormControl
                  type="dob"
                  value={form.birthday}
                  required
                  onChange={(e:any) => setForm({ ...form, birthday: e })}
                />
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <label className="mb-2 inline-flex">Image</label>
              <br></br>
              <ImageUpload
                model="users"
                result={(e:any) => imageResult(e, "image")}
                value={images.image || form.image}
                multiple={false}
                className="h-32 w-32 rounded-lg object-contain"
              />
            </div>
       
          </div>
          <div className="text-right mt-5">
            <button
              type="button"
              onClick={() => history.push("/profile")}
              className="me-3 text-white bg-gray-400 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Cancel
            </button>
            <button className="text-white bg-orange-400 bg-orange-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Html;
