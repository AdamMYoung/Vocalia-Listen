import { get, set } from "idb-keyval";

const DARK_MODE = "isDarkMode";

export class SettingsManager {
  /**
   * Gets the dark mode status.
   */
  getDarkMode = async (): Promise<boolean> => {
    return await get(DARK_MODE).then(x => (x ? (x as boolean) : false));
  };

  /**
   * Sets the dark mode status.
   */
  setDarkMode = async (enabled: boolean) => {
    await set(DARK_MODE, enabled);
  };
}
