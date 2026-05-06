import IconFacebook from '../../../assets/fb-logo2.svg';
import IconGlobeWhite from '../../../assets/icon-globe-w.svg';
import IconMail from '../../../assets/icon-mail.svg';
import IconPhone from '../../../assets/icon-phone.svg';
import IconLine from '../../../assets/line-logo2.svg';
import QRLine from '../../../assets/line-qr-image.png';
import IconButton from '../atoms/wc-a-icon-button';

function SectionContactUs() {
  return (
    <div className="p-8 rounded-2xl max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-3">
          <a
            href="https://lin.ee/5OpvRTO"
            className="text-xl font-semibold underline"
            target="_blank"
          >
            <div className="flex gap-2 items-center cursor-pointer">
              <IconButton
                iconSrc={IconLine}
                width={48}
                height={48}
                style={{ backgroundColor: '#3ACE00', borderColor: '#9EFF99' }}
              />
              CLEVER-PLATFORM
            </div>
          </a>
        </div>
        <img src={QRLine} alt="QR Code" className="w-48 h-48" />
      </div>

      <div className="space-y-5">
        <div className="flex items-center space-x-3">
          <a
            href="https://line.me/R/ti/p/@nextgen-education"
            className="text-lg underline text-gray-800"
            target="_blank"
          >
            <div className="flex gap-2 items-center cursor-pointer">
              <IconButton
                iconSrc={IconLine}
                width={48}
                height={48}
                style={{ backgroundColor: '#3ACE00', borderColor: '#9EFF99' }}
              />
              @nextgen-education
            </div>
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://facebook.com/2018.nextgeneducation"
            className="text-lg underline text-gray-800"
            target="_blank"
          >
            <div className="flex gap-2 items-center cursor-pointer">
              <IconButton iconSrc={IconFacebook} width={48} height={48} />
              2018.nextgeneducation
            </div>
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://nextgen-education.com"
            className="text-lg underline text-gray-800"
            target="_blank"
          >
            <div className="flex gap-2 items-center cursor-pointer">
              <IconButton
                iconSrc={IconGlobeWhite}
                width={48}
                height={48}
                variant="white"
              />
              nextgen-education.com
            </div>
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="mailto:nextgen@nextgen-education.com"
            className="text-lg text-gray-800"
          >
            <div className="flex gap-2 items-center cursor-pointer">
              <IconButton iconSrc={IconMail} width={48} height={48} variant="white" />
              nextgen@nextgen-education.com
            </div>
          </a>
        </div>

        <div className="flex items-center space-x-3">
          <a href="tel:0998054987" className="text-lg text-gray-800">
            <div className="flex gap-2 items-center cursor-pointer">
              <IconButton iconSrc={IconPhone} width={48} height={48} variant="white" />
              099-805-4987
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default SectionContactUs;
