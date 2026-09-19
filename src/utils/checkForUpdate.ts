import { CapacitorUpdater } from '@capgo/capacitor-updater';

const OTA_URL = import.meta.env.VITE_OTA_URL;

type LatestVersion = {
  version: string;
  url: string;
};

export async function checkForUpdate(): Promise<void> {
  try {
    const response = await fetch(`${OTA_URL}/app/version`);
    if (!response.ok) return;

    const latest: LatestVersion = await response.json();
    const { bundle } = await CapacitorUpdater.current();

    if (bundle.version === latest.version) return;

    const newBundle = await CapacitorUpdater.download({
      url: latest.url,
      version: latest.version,
    });
    await CapacitorUpdater.next({ id: newBundle.id });
  } catch {
    // Update checks must never block or crash the app.
  }
}
