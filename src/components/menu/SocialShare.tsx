import { Menu } from '@headlessui/react';
import { IoShareSocialOutline } from 'react-icons/io5';
import { LinkedinShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import { toast } from 'react-toastify';
import TooltipHtml from '../TooltipHtml';
import Image from 'next/image';

type Props = {
  shareUrl: string;
}

const SocialShare = ({ shareUrl }: Props) => {
  const title = "Hi use this link to view the product detail";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard")
  };

  return (
    <div className="relative">
      {/* Headless UI Dropdown (Menu) */}
      <Menu as="div" className="relative">
        <TooltipHtml title="Social Share">
          <Menu.Button className="flex cursor-pointer hover:shadow-lg flex-col items-center justify-center  bg-gray-white rounded-lg text-[16px] 2xl:text-[20px] focus:outline-none">
            <IoShareSocialOutline className='text-black' />
          </Menu.Button>
        </TooltipHtml>
        <Menu.Items className="absolute top-[100%] right-[0] mt-2 w-48 bg-white border rounded-lg shadow-lg">
          <div className="py-2 h-32 lg:h-auto overflow-auto">
            {/* Whatsapp Share */}
            <Menu.Item>
              {({ active }) => (
                <WhatsappShareButton
                  className='w-full'
                  url={shareUrl}
                  title={title}
                  separator=":: "
                >
                  <div className={`flex items-center space-x-1 text-[12px] px-4 w-full py-1 ${active ? 'bg-gray-100' : ''} cursor-pointer`}>
                    <Image src="/assets/img/Social Icons1.png" alt="Whatsapp" width="16" />
                    <span>Whatsapp</span>
                  </div>
                </WhatsappShareButton>
              )}
            </Menu.Item>

            {/* Facebook Share */}
            <Menu.Item>
              {({ active }) => (
                <FacebookShareButton
                  className='w-full'
                  url={shareUrl}
                  title={title}
                >
                  <div className={`flex items-center space-x-1 text-[12px] px-4 w-full py-1 ${active ? 'bg-gray-100' : ''} cursor-pointer`}>
                    <Image src="/assets/img/Social Icons2.png" alt="Facebook" width="16" />
                    <span>Facebook</span>
                  </div>
                </FacebookShareButton>
              )}
            </Menu.Item>

            {/* Twitter Share */}
            <Menu.Item>
              {({ active }) => (
                <TwitterShareButton
                  className='w-full'
                  url={shareUrl}
                  title={title}
                >
                  <div className={`flex items-center space-x-1 text-[12px] px-4 w-full py-1 ${active ? 'bg-gray-100' : ''} cursor-pointer`}>
                    <Image src="/assets/img/Social Icons3.png" alt="Twitter" width="16" />
                    <span>Twitter</span>
                  </div>
                </TwitterShareButton>
              )}
            </Menu.Item>

            {/* Email Share */}
            <Menu.Item>
              {({ active }) => (
                <div className={`flex items-center space-x-1 text-[12px] px-4 w-full py-1 ${active ? 'bg-gray-100' : ''} cursor-pointer`}>
                  <Image src="/assets/img/Social Icons6.png" alt="Email" width="16" />
                  <a href={`mailto:?subject=Share URL&body=${title} ${shareUrl}`} className="text-gray-800">Email</a>
                </div>
              )}
            </Menu.Item>

            {/* Instagram Share */}
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={() => window.open(`https://www.instagram.com/?url=${shareUrl}`, "_blank")}
                  className={`flex items-center space-x-1 text-[12px] px-4 w-full py-1 ${active ? 'bg-gray-100' : ''} cursor-pointer`}
                >
                  <Image src="/assets/img/3.svg" alt="Instagram" width="16" />
                  <span>Instagram</span>
                </div>
              )}
            </Menu.Item>

            {/* Linkedin Share */}
            <Menu.Item>
              {({ active }) => (
                <LinkedinShareButton
                  className='w-full'
                  url={shareUrl}
                  title={title}
                >
                  <div className={`flex items-center space-x-1 text-[12px] px-4 w-full py-1 ${active ? 'bg-gray-100' : ''} cursor-pointer`}>
                    <Image src="/assets/img/2.svg" alt="Twitter" width="16" />
                    <span>Linkedin</span>
                  </div>
                </LinkedinShareButton>
              )}
            </Menu.Item>

            {/* Copy to Clipboard */}
            <Menu.Item>
              {({ active }) => (
                <div
                  onClick={copyToClipboard}
                  className={`flex items-center space-x-1 text-[12px] px-4 w-full py-1 ${active ? 'bg-gray-100' : ''} cursor-pointer`}
                >
                  <Image src="/assets/img/copy.png" alt="Copy Link" width="16" />
                  <span className="text-gray-800">Copy Link</span>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
};

export default SocialShare;