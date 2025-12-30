
"use client"

import { TbArrowUpRight } from "react-icons/tb";
import { GoArrowRight } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loaderHtml } from "@/utils/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/redux/slices/userSlice";
import { fire } from "@/components/Swal";
import ApiClientB from "@/utils/Apiclient";
import { RootState } from "@/redux/store";
import envirnment from "@/envirnment";
import Image from "next/image";


export default function HomeComponent() {
  const user: any = useSelector((state: RootState) => state.user?.data);
  const router = useRouter()
  const dispatch = useDispatch()
  const { post } = ApiClientB()
  const query = useSearchParams();

  const history = (url = '') => {
    router.push(url)
  }

  const setLogin = async (data: any) => {
    const hasOnboarding = data?.primary_interest ? true : false;
    const query1 = query?.get("product");
    const url =
      query1 != null
        ? `/myjournal/?product=${query1}`
        : hasOnboarding
          ? "/"
          : "/getstarted";
    dispatch(login(data));

    const isCancel = query?.get('isCancel') || query?.get('cancelKey')
    const surveyId = query?.get('surveyId')
    const month = query?.get('month')
    const year = query?.get('year')

    if (isCancel) {
      history(`/cs`);
    } else if (surveyId) {
      if (month) {
        history(`/s/${surveyId}/${month}/${year}`);
      } else {
        history(`/s/${surveyId}`);
      }
    } else {
      history(url);
    }
  };

  useEffect(() => {
    const id = query?.get("id");
    const productId = query?.get("productId");
    
    if (id && !user) {
      loaderHtml(true)
      post("user/auto/login", { 
        id, 
        number: query?.get('numb'), 
        newRegister: query?.get('newRegister'), 
        isMobile: query?.get('isMobile') 
      }).then((res) => {
        if (res.success) {
          setLogin(res.data)
        }
        loaderHtml(false)
      });
    } else if (id && user) {
      history("/");
      fire({
        title: "You are already logged into the system.",
        description: 'If you want to log in, please log out of the current account first.',
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#540C0F",
      });
    } else if (user && productId) {
      history(`/myjournal?product=${productId}`);
    }
  }, []);

  return <>
    <section className="homesecond">


      <div className="bg-[#540C0F] text-center px-4 md:px-8 2xl:px-16 bg-[linear-gradient(90deg,rgba(255,255,255,0.12)_0%,rgba(0,0,0,0.20)_100%)] py-3 lg:flex items-center justify-between">
        <div className="">
          <p className="text-white italic font-medium" ><span className="font-semibold text-white not-italic">Catch the live unboxing! </span> Wednesday July 9th | 7:30 PM EST | YouTube 🎉</p>
        </div>
        <a href="https://joincraftclub.com/events/" target="_new" className="flex gap-1  items-center text-white justify-center">
          <p className="cursor-pointer">See all events</p>
          <p className="cursor-pointer"><GoArrowRight /></p>
        </a>
      </div>
    </section>

    <section className="homethird">

      <div className="md:flex hidden items-center justify-center h-auto bg-gray-100 overflow-hidden bg-gradient-to-b from-white to-[#D1D6DA] desktoponly">
        <div className="flex justify-between gap-6 px-6 w-full">
          {/* Left images */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <Image
                  height={500}
                  width={280}
                  src="/assets/img/v2/home/1.png" alt="People working" className="rounded-xl w-full h-auto object-content mb-4" />
                <Image
                  height={500}
                  width={280}
                  src="/assets/img/v2/home/2.png" alt="Mushrooms and capsules" className="rounded-xl w-full h-auto object-content mb-4" />
              </div>
              <div>
                <Image
                  height={160}
                  width={280}
                  src="/assets/img/v2/home/3.png" alt="People working" className="rounded-xl w-full h-auto object-content mb-4" />
                <Image
                  height={500}
                  width={280}
                  src="/assets/img/v2/home/4.png" alt="Mushrooms and capsules" className="rounded-xl w-full h-auto object-content mb-4" />
                <Image
                  height={400}
                  width={280}
                  src="/assets/img/v2/home/5.png" alt="Dog and person" className="rounded-xl w-full h-auto object-content " />
              </div>
            </div>
          </div>

          {/* Center Text */}
          <div className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-center text-center md:min-w-[340px] lg:min-w-[450px] 2xl:min-w-[540px] md:w-[340px] lg:w-[440px] 2xl:w-[500px]">
            <h1 className="text-[#232536] font-inter text-3xl lg:!text-[38px] 2xl:!text-5xl font-bold leading-tight 2xl:leading-[40px] 2xl:leading-[60px] tracking-[-2.24px] max-w-xl">
              Your Gateway to <br></br> Wellness and Discovery.
            </h1>

            <h2 className="text-[#6D6E76] font-inter text-base md:text-lg lg:text-[17px]  font-medium md:font-semibold leading-relaxed md:leading-[26px] lg:leading-[28px] max-w-2xl">
              Explore personalized resources, exclusive rewards, and a thriving community—all in one place.
            </h2>

            <button onClick={() => history('/resource-center')} className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition">
              <span className="text-[16px] font-[700] uppercase block">Get Started</span>
              <span className="bg-white text-[#540C0F] p-1 rounded-full">
                <TbArrowUpRight size={16} />
              </span>
            </button>
          </div>


          {/* Right images */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="mt-4">
                <Image
                  height={260}
                  width={280}
                  priority
                  fetchPriority="high"
                  
                  src="/assets/img/v2/home/6.png" alt="People working" className="rounded-xl w-full h-auto object-content mb-4" />
                <Image
                  height={500}
                  width={280}
                  src="/assets/img/v2/home/7.png" alt="Mushrooms and capsules" className="rounded-xl w-full h-auto object-content mb-4" />
                <Image
                  height={260}
                  width={280}
                  src="/assets/img/v2/home/8.png" alt="People working" className="rounded-xl w-full object-cover h-auto object-content " />
              </div>
              <div className="mt-5">
                <Image
                  height={500}
                  width={280}
                  src="/assets/img/v2/home/9.png" alt="Mushrooms and capsules" className="rounded-xlw-full h-auto object-content mb-4" />
                <Image
                  height={260}
                  width={280}
                  src="/assets/img/v2/home/10.png" alt="Dog and person" className="rounded-xl w-full h-auto object-content" />
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className="md:hidden flex items-center justify-center  bg-gray-100 overflow-hidden bg-gradient-to-b from-white to-[#D1D6DA] mobileonly">
        <div className="grid grid-cols-12 w-full">
          {/* Left images */}
          <div className="col-span-12 flex flex-col gap-4 px-4 md:px-8">
            <div className="flex max-w-lg mx-auto gap-4 h-auto items-center">
              <div>
                <Image
                  height={149}
                  width={83}
                  src="/assets/img/v2/home/1.png" alt="People working" className="rounded-xl w-[200px] h-auto object-contain mb-4" />
                <Image
                  height={149}
                  width={83}
                  src="/assets/img/v2/home/2.png" alt="Mushrooms and capsules" className="rounded-xl w-[200px] h-auto object-contain mb-4" />
              </div>
              <div>
                <Image
                  height={47}
                  width={83}
                  src="/assets/img/v2/home/3.png" alt="People working" className="rounded-xl w-[200px] object-cover h-auto object-contain mb-4" />
                <Image
                  height={149}
                  width={83}
                  src="/assets/img/v2/home/4.png" alt="Mushrooms and capsules" className="rounded-xl w-[200px] h-auto object-contain mb-4" />
                <Image
                  height={47}
                  width={83}
                  src="/assets/img/v2/home/5.png" alt="Dog and person" className="rounded-xl w-[200px] h-auto object-contain " />
              </div>
              <div>
                <Image
                  height={77}
                  width={83}
                  src="/assets/img/v2/home/6.png" alt="People working" className="rounded-xl w-[200px] object-cover h-auto object-contain mb-4" />
                <Image
                  height={149}
                  width={83}
                  src="/assets/img/v2/home/7.png" alt="Mushrooms and capsules" className="rounded-xl w-[200px] h-auto object-contain mb-4" />
                <Image
                  height={77}
                  width={83}
                  src="/assets/img/v2/home/8.png" alt="People working" className="rounded-xl w-[200px] object-cover h-auto object-contain " />
              </div>
              <div>
                <Image
                  height={149}
                  width={83}
                  src="/assets/img/v2/home/9.png" alt="People working" className="rounded-xl w-[200px] h-auto object-contain mb-4" />
                <Image
                  height={149}
                  width={83}
                  src="/assets/img/v2/home/10.png" alt="Mushrooms and capsules" className="rounded-xl w-[200px] h-auto object-contain mb-4" />
              </div>
            </div>
          </div>

          {/* Center Text */}
          <div className="col-span-12   ">
            <div className="py-6 px-6 rounded-t-3xl bg-white flex flex-col items-start gap-4 2xl:gap-10 justify-start ">
              <div className="text-[#232536]  font-inter text-3xl font-bold leading-[60px] tracking-[-2.24px] ">
                <h1 className="max-w-lg"> Your Gateway to Wellness and Discovery.</h1>
              </div>

              <p className="text-[#6D6E76]  font-inter text-xl font-bold leading-[28px]">Explore personalized resources, exclusive rewards, and a thriving community—all in one place.</p>
              <button onClick={() => history('/resource-center')} className="flex items-center justify-center gap-2 bg-[#500] text-white font-semibold px-6 py-3 rounded-full hover:bg-[#700] transition ">
                <span className="uppercase block">Get Started</span>
                <span className="bg-white text-[#540C0F] p-1 rounded-full">
                  <TbArrowUpRight size={16} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>



    <section className="homeforth px-5 sm:px-6 md:px-16 lg:px-20 xl:px-30 2xl:px-40 bg-gradient-to-r from-white to-gray-200 py-6 ">
      <div className="lg:flex gap-4 xl:gap-8">
        <h3 className="text-2xl  md:text-3xl max-w-md mx-auto font-bold text-black text-center text-center mb-6 lg:mb-0 lg:text-left shrink-0 pr-4 xl:pr-10">Explore our extensive ecosystem of brands.</h3>
        <div className="flex items-center justify-center lg:justify-between gap-6 flex-wrap  mx-auto lg:w-full">
          <div className="flex flex-col items-center">
            <Image
              height={72}
              width={115}
              src="/assets/img/v2/icons/1.png" onClick={() => window.scrollTo({ top: 0 })} alt="Groove Guide" className="lg:h-14 hover:scale-110 transition-transform duration-200 drop-shadow-md cursor-pointer xl:h-18  " />

          </div>
          <div className="flex flex-col items-center">
            <Image
              height={72}
              width={103}
              src="/assets/img/v2/icons/2.png" onClick={() => window.open('https://theshroomgroove.com/')} alt="Shroom Groove" className="lg:h-14 hover:scale-110 transition-transform duration-200 drop-shadow-md cursor-pointer xl:h-18 " />

          </div>
          <div className="flex flex-col items-center">
            <Image
              height={64}
              width={64}
              src="/assets/img/v2/icons/3.svg" alt="Groove Grill" className="lg:h-14  xl:h-16 " />
          </div>
          <div className="flex flex-col items-center ">
            <Image
              height={64}
              width={64}
              src="/assets/img/newPhoto.jpeg" alt="Craft Therapy" onClick={() => window.open('https://youtube.com/@crafttherapynetwork?si=YeHPdkOfy-RJtpjs')} className="cursor-pointer hover:scale-110 transition-transform duration-200 drop-shadow-md imageResponsive rounded-full " />
          </div>
          <div className="flex flex-col items-center">
            <Image
              height={64}
              width={64}
              src="/assets/img/v2/icons/5.svg" alt="Craft Club" onClick={() => window.open('https://joincraftclub.com/')} className="lg:h-14 hover:scale-110 transition-transform duration-200 drop-shadow-md cursor-pointer xl:h-16 " />
          </div>
        </div>
      </div>
    </section>


    <section className="fomesixth  ">
      <div className="hidden md:flex desktopview relative  items-center justify-center h-[600px] bg-gray-100 p-6 ">
        <div className="absolute inset-0">
          <Image
            height={600}
            width={1400}
            src="/assets/img/v2/bg1.png"
            alt="Shrooms"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container">

          <div className="relative flex flex-col items-start gap-3 xl:gap-8   bg-white p-10 rounded-[60px] shadow-lg max-w-lg ml-auto">
            <div className="">
              <h3 className="text-xl text-[#061522] italic">Natural Wellness</h3>
              <h2 className="text-5xl font-bold text-[#232536] tracking-[-2.24px] max-w-xl w-96">
                Discover the Shroom Groove Menu
              </h2>
            </div>
            <p className="text-[21px] text-[#6D6E76] font-[600] leading-[28px]">
              Browse our full range of therapeutic products, monthly box offerings, and exclusive deals. Start your journey here.
            </p>
            <button onClick={() => history('/menu')} className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition">
              <span className="text-[16px] font-[700] uppercase uppercase block">View Menu</span>
              <span className="bg-white text-[#540C0F] p-1 rounded-full">
                <TbArrowUpRight size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>


      <div className="block md:hidden mobileview relative bg-[#D1D6DA] ">
        <div className="relative flex flex-col items-start gap-3 xl:gap-6 p-4 sm:p-6 md:pb-0 ">
          <h3 className="text-sm uppercase text-gray-600">Natural Wellness</h3>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#061522] tracking-[-2.24px] ">
            Discover the Shroom Groove Menu
          </h2>
          <p className="text-black mb-3 mt-6 text-[20px] font-bold leading-[28px]">
            Browse our full range of therapeutic products, monthly box offerings, and exclusive deals. Start your journey here.
          </p>
          <button onClick={() => history('/menu')} className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition">
            <span className="text-[16px] font-[700] uppercase uppercase block">View Menu</span>
            <span className="bg-white text-[#540C0F] p-1 rounded-full">
              <TbArrowUpRight size={16} />
            </span>
          </button>

        </div>
        <Image
          height={415}
          width={900}
          src="/assets/img/v2/remove1.png"
          alt="Shrooms"
          className="w-full h-full object-cover"
        />

        <Image
          height={415}
          width={900}
          src="/assets/img/v2/line.png"
          alt="Shrooms"
          className="w-full h-full object-cover"
        />

      </div>
    </section>


    <section className="fomeseven  ">
      <div className="desktopview relative hidden md:flex items-center justify-center  bg-gray-100 px-6 py-[80px] xl:py-[100px] 2xl:py-[140px]  bg-[url('/assets/img/v2/bg2.png')] bg-cover bg-right xl:bg-center bg-no-repeat">




        <div className="container">

          <div className="relative flex flex-col items-start gap-3 xl:gap-6 max-w-[520px] mr-auto">
            <h2 className="text-5xl font-bold text-black tracking-[-2.24px] ">
              Explore Resources to Support Your Wellness Journey
            </h2>
            <p className="text-black font-bold max-w-[230px] leading-[28px]">
              Dive into audios, guides, videos, and more—curated to help you learn, grow, and thrive.
            </p>
            <button onClick={() => history('/resource-center')} className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition">
              <span className="text-[16px] font-[700] uppercase uppercase block">Access the Resource Center</span>
              <span className="bg-white text-[#540C0F] p-1 rounded-full">
                <TbArrowUpRight size={16} />
              </span>
            </button>
          </div>
        </div>
      </div>


      <div className="mobileview relative block md:hidden bg-[#D2CAC3] ">
        <div className="relative flex flex-col items-start gap-3 xl:gap-6 p-4 sm:p-6 md:pb-0 ">
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 ">
            Explore Resources to Support Your Wellness Journey
          </h2>
          <p className="text-black mb-3 mt-6 text-[20px] font-bold leading-[28px]">
            Dive into audios, guides, videos, and more—curated to help you learn, grow, and thrive.
          </p>
          <button onClick={() => history('/resource-center')} className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition">
            <span className="text-[16px] font-[700] uppercase uppercase block">Access the Resource Center</span>
            <span className="bg-white text-[#540C0F] p-1 rounded-full">
              <TbArrowUpRight size={16} />
            </span>
          </button>

        </div>
        <Image
          height={415}
          width={900}
          src="/assets/img/v2/remove2.png"
          alt="Shrooms"
          className="w-full h-full object-cover"
        />



      </div>
    </section>

    <section className="homeeight  ">

      <div className="relative hidden md:flex items-center justify-center h-[500px] 2xl:h-[650px] bg-gray-100 p-6 ">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            height={650}
            width={1400}
            src="/assets/img/v2/bg3.png"
            alt="Shrooms"
            className="w-full h-full object-cover object-left"
          />
        </div>

        <div className="container">

          <div className="relative flex flex-col items-center gap-3 xl:gap-8   bg-white p-10 rounded-[60px] shadow-lg max-w-lg ml-auto">
            <div className="">
              <h3 className="text-xl text-center text-[#061522] italic">Elevate your membership!</h3>
              <h2 className="text-5xl text-center font-bold text-[#232536] tracking-[-2.24px]">
                Enhance Your Membership
              </h2>
            </div>
            <p className="text-[21px] text-[#6D6E76] font-[600] text-center leading-[28px]">
              Get $200 worth of products for $97/month,
              exclusive perks, cashback rewards, and more.
            </p>
            <a
              href="https://joincraftclub.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition"
            >
              <span className="text-[16px] font-[700] uppercase block">Upgrade My Membership</span>
              <span className="bg-white text-[#540C0F] p-1 rounded-full">
                <TbArrowUpRight size={16} />
              </span>
            </a>

          </div>
        </div>
      </div>

      <div className="mobileview relative block md:hidden bg-[#EEEAE7] pb-8 ">
        <Image
          height={415}
          width={900}
          src="/assets/img/v2/remove3.png"
          alt="Shrooms"
          className="w-full h-full object-cover"
        />
        <div className="relative flex flex-col items-center gap-3 xl:gap-6 p-6 pb-0 ">
          <h3 className="text-sm uppercase text-center text-[#061522] italic">Elevate your membership!</h3>
          <h2 className="text-4xl 2xl:text-5xl font-bold text-center text-[#232536] tracking-[-2.24px] ">
            Enhance Your Membership
          </h2>
          <p className="text-[#6D6E76] mb-3 mt-6 text-[20px] text-center font-bold leading-[28px]">
            Get $200 worth of products for $97/month,
            exclusive perks, cashback rewards, and more.
          </p>
          <a href={`${envirnment.joinUrl}?q=${user?.id || user?._id || ''}`} target="_new" className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition">
            <span className="text-[16px] font-[700] uppercase uppercase block">Subscribe</span>
            <span className="bg-white text-[#540C0F] p-1 rounded-full">
              <TbArrowUpRight size={16} />
            </span>
          </a>
        </div>
      </div>
    </section>



    <section className="homenine">

      <div className="flex flex-col md:flex-row items-end xl:items-center bg-gradient-to-r from-[#1E1E1E] via-[#540C0F] to-[#2B0305] text-white ">

        {/* Left Content */}
        <div className="md:w-1/2 xl:max-w-3xl text-left  space-y-4 xl:space-y-8 px-4 sm:px-6 py-12 md:px-8 lg:px-16 ml-auto">
          <div>
            <p className="2xl:text-lg font-bold hidden md:block">Get $15 for each stamp and save up to $135!</p>
            <h2 className="text-3xl lg:text-4xl 2xl:text-5xl font-bold max-2xl:max-w-[465px] tracking-[-2.24px]">Earn and Track Rewards as You Grow</h2>
          </div>
          <p className="text-[#FBFBFB] font-bold max-w-[465px] leading-[24px] ">
            {`Every action you take—whether it's sharing an experience, exploring a product, or upgrading your membership—brings
            you closer to exclusive perks.`}
          </p>
          <button onClick={() => history('/rewards')} className="bg-[#E09F3E] hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-full flex items-center gap-2">
            <span className="text-[16px] font-[700] uppercase">GET REWARDS</span>
            <span className="bg-black text-[#fff] p-2 rounded-full">
              <TbArrowUpRight size={16} />
            </span>
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 flex justify-end mt-6 md:mt-0">
          <Image
            height={460}
            width={670}
            src="/assets/img/v2/bg4.png"
            alt="Shrooms"
            className="w-full h-auto max-w-2xl"
          />

        </div>
      </div>

    </section>


    <section className="hometen">

      <div className="flex  items-center justify-center py-6 xl:py-16 px-5 sm:px-6 md:px-16 lg:px-20 xl:px-30 2xl:px-40 bg-gray-100 overflow-hidden bg-gradient-to-b from-white to-[#D1D6DA]">
        <div className="grid grid-cols-12 gap-4 items-center  w-full">
          {/* Left images */}
          <div className="col-span-12 lg:col-span-4  xl:col-span-3 hidden lg:flex flex-col gap-4 ">
            <div className="">
              <Image
                height={300}
                width={370}
                src="/assets/img/v2/bg6.png" alt="People working" className="rounded-xl w-full md:h-[300px] lg:h-[220px] xl:h-[240px] 2xl:h-[300px] object-contain lg:object-cover mb-4" />
            </div>
          </div>

          {/* Center Text */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-6 flex flex-col items-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-center text-center">
            <h3 className="text-[#061522] font-inter text-5xl md:text-4xl 2xl:text-5xl font-bold leading-tight md:leading-snug 2xl:!leading-[60px] tracking-[-2px] max-w-xl">
              Your Feedback Fuels the Community
            </h3>

            <p className="text-black lg:text-[#061522] font-inter text-md leading-[25px] max-w-[620px]">
              Tell us about your experience with the products you’ve tried. Your insights help others make better choices—and you’ll earn rewards for every shared experience.
            </p>

            <button onClick={() => history('/myjournal')} className="bg-[#E09F3E] hover:bg-yellow-600 text-black font-semibold px-5 py-2 rounded-full flex items-center gap-2">
              <span className="text-[16px] font-[700] uppercase uppercase">Share Your Product Experience</span>
              <span className="bg-black text-[#fff] p-2 rounded-full">
                <TbArrowUpRight size={16} />
              </span>
            </button>
          </div>


          {/* Right images */}
          <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 ">
            <div className="">
              <Image
                height={300}
                width={370}
                src="/assets/img/v2/bg5.png" alt="People working" className="rounded-xl w-full md:h-[300px] lg:h-[220px] xl:h-[240px] 2xl:h-[300px] object-contain lg:object-cover mb-4" />
            </div>
          </div>
        </div>
      </div>

    </section>



    <section className="homeelevean">

      <div className="flex  items-center justify-center py-10 xl:py-16  overflow-hidden bg-[#001720]">
        <div className="mx-auto w-full">


          {/* Center Text */}
          <div className=" flex flex-col items-center gap-4 md:gap-6 lg:gap-8 xl:gap-10 justify-center text-center px-4 sm:px-6 xl:px-10">
            <h4 className="text-[#F9F7F5] font-inter text-3xl sm:text-4xl 2xl:text-5xl font-bold 2xl:!leading-[60px] tracking-[-2px] max-w-[500px] 2xl:max-w-xl">
              Inspire the Community with Your Story
            </h4>

            <p className="text-[#F9F7F5] font-inter text-[16px]  leading-relaxed leading-[28px] max-w-[525px]">
              Your journey matters. Share how mushrooms and wellness products have transformed your life, and inspire others to explore their own path. Earn rewards for contributing to our shared journey.              </p>

            <button onClick={() => history('/myjournal')} className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition">
              <span className="text-[16px] font-[700] uppercase uppercase">Share Your Wellness Journey</span>
              <span className="bg-white text-[#540C0F] p-1 rounded-full">
                <TbArrowUpRight size={16} />
              </span>
            </button>
          </div>


        </div>
      </div>

    </section>

    <section className="hometwelves">

      <div className="bg-white border-t border-gray-300 p-4 py-10 flex flex-col lg:flex-row items-center justify-between px-5 sm:px-6 md:px-16 lg:px-20 xl:px-30 2xl:px-40 gap-5">

        <div className="flex flex-col lg:flex-row gap-5">
          <Image
            height={120}
            width={120}
            src="/assets/img/v2/email2.svg" alt="email icon" className="h-20 2xl:h-25 2xl:h-24 2xl:h-30" />
          <div>
            <h2 className="text-[30px] lg:text-[24px] 2xl:text-[34px] lg:max-w-[280px]  2xl:max-w-[420px] !leading-[35px] 2xl:!leading-[45px] text-center font-bold text-[#061522] tracking-[-2px]">
              Stay Updated with the Latest Insights
            </h2>
          </div>
        </div>
        <p className=" lg:text-sm 2xl:text-lg text-black font-bold lg:max-w-[225px] xl:max-w-[295px] 2xl:max-w-[410px] !leading-[18px] 2xl:!leading-[24px] text-center">
          Catch up on our newsletter in the Resource Center, with exclusive
          content and updates tailored for you.
        </p>


        <button className="flex items-center gap-2 bg-[#500] text-white font-semibold px-5 md:px-6 py-2.5 md:py-3 rounded-full hover:bg-[#700] transition">
          <span className="text-sm lg:text-base 2xl:text-lg uppercase"> EXPLORE THE NEWSLETTER</span>
          <span className="bg-white text-[#540C0F] p-1 rounded-full">
            <TbArrowUpRight size={16} />
          </span>
        </button>


      </div>



    </section>

  </>;
}