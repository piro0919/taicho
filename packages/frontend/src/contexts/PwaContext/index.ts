import { createContext } from "react";
import { PwaData } from "use-pwa";

export type PwaValue = Partial<
  Pick<
    PwaData,
    | "appinstalled"
    | "canInstallprompt"
    | "enabledPwa"
    | "enabledUpdate"
    | "isPwa"
    | "showInstallPrompt"
    | "unregister"
  >
>;

const PwaContext = createContext<PwaValue>({
  appinstalled: undefined,
  canInstallprompt: undefined,
  enabledPwa: undefined,
  isPwa: undefined,
  showInstallPrompt: undefined,
});

export default PwaContext;
