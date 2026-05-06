import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import { useNavigate } from '@tanstack/react-router';
import { BeforeInstallPromptEvent } from 'index';
import ConfigJson from './config/index.json';

import { UAParser } from 'ua-parser-js';
import ModalInstall from './component/templates/ModalInstall';
import ModalPlayBrowser from './component/templates/ModalPlayBrowser';
import { STATEFLOW } from './interfaces/stateflow.interface';
import StoreGlobalPersist from '@store/global/persist';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);
  const installButtonRef = useRef<HTMLDivElement | null>(null);

  const { isSupported, isManualInstall } = isBrowserSupported();
  const isInstalled = isAppInstalled();

  useEffect(() => {
    // Set up the game state
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Initial);

    StoreGlobalPersist.MethodGet().updateSettings({
      enableParticle: false,
    });
  }, []);

  useEffect(() => {
    // Initialize deferredPrompt for use later to show browser install prompt.
    const beforeInstallPromptHandler = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();

      // Stash the event so it can be triggered later.
      deferredPrompt.current = e;

      if (installButtonRef.current) {
        installButtonRef.current.style.display = 'block';
      }
    };
    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    const appInstalledHandler = () => {
      // after the app is installed, navigate to the splash screen
      navigate({
        to: '/',
        replace: true,
      });
    };
    window.addEventListener('appinstalled', appInstalledHandler);

    const promptInstall = async () => {
      console.log(deferredPrompt.current, 'promptInstall');
      if (deferredPrompt.current) {
        // Show the install prompt
        deferredPrompt.current.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.current.userChoice.then(({ outcome, platform }) => {
          console.log(`User response to the install prompt: ${outcome}`);
          // We've used the prompt and can't use it again, throw it away
          deferredPrompt.current = null;
        });
      }
    };

    if (installButtonRef.current) {
      installButtonRef.current.addEventListener('click', promptInstall);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
      window.removeEventListener('appinstalled', appInstalledHandler);
      if (installButtonRef.current) {
        installButtonRef.current.removeEventListener('click', promptInstall);
      }
    };
  }, [installButtonRef.current]);

  function isAppInstalled() {}

  function isBrowserSupported() {
    // check if the browser is supported
    // ref: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable#browser_support
    //
    // if we already have the deferredPrompt (from beforeinstallprompt event),
    // we can assume the browser is supported
    if (deferredPrompt.current != null) {
      return { isSupported: true, isManualInstall: false };
    }

    // otherwise, check if the browser is supported
    const parser = new UAParser();
    const browser = parser.getBrowser();
    const device = parser.getDevice();
    const os = parser.getOS();

    // on mobile devices, only these list of browsers are supported
    // - On Android, Firefox, Chrome, Edge, Opera, and Samsung Internet Browser all support installing PWAs.
    // - On iOS 16.3 and earlier, PWAs can only be installed with Safari.
    // - On iOS 16.4 and later, PWAs can be installed from the Share menu in Safari, Chrome, Edge, Firefox, and Orion.
    if (device.type === 'mobile') {
      if (
        os.is('Android') &&
        (browser.is('Firefox') ||
          browser.is('Chrome') ||
          browser.is('Edge') ||
          browser.is('Opera') ||
          browser.is('Samsung Internet'))
      ) {
        return { isSupported: true, isManualInstall: false };
      }

      // on iOS devices, let user install via Share menu
      if (os.is('iOS')) {
        return { isSupported: true, isManualInstall: true };
      }
    }

    // on desktop devices, only these list of browsers are supported
    // - Chromium browsers support installing PWAs that have a manifest file on all supported desktop operating systems.
    // - Firefox and Safari do not support installing PWAs using a manifest file.
    //
    // note: for user agent parser, the device type for desktop browsers need to be handled manually
    //       (1): https://docs.uaparser.dev/info/device/type.html
    //       (2): https://github.com/faisalman/ua-parser-js/issues/182
    else if (device.type === undefined || !['wearable', 'mobile'].includes(device.type)) {
      // let user install only Chrome and Edge
      if (browser.is('Chrome') || browser.is('Edge')) {
        return { isSupported: true, isManualInstall: false };
      }
    }
    return { isSupported: false, isManualInstall: false };
  }

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      className="flex-1 relative"
      deBugVisibleIs={false}
    >
      <SafezonePanel className="w-full h-full flex items-center justify-center">
        {isSupported ? (
          <ModalInstall ref={installButtonRef} t={t} />
        ) : (
          <ModalPlayBrowser t={t} />
        )}
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
