import { useEffect } from 'react';
import { App } from '@capacitor/app';

/**
 * Navigates back in browser history on the Android hardware/gesture back
 * button, or exits the app when there's nowhere left to go back to.
 */
export function useAndroidBackButton() {
  useEffect(() => {
    const listenerPromise = App.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        App.exitApp();
      }
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, []);
}
