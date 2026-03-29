import { NativeModule, requireNativeModule } from "expo";

import type { KmCertoNativeModuleEvents } from "./KmCertoNative.types";

declare class KmCertoNativeModule extends NativeModule<KmCertoNativeModuleEvents> {
  isOverlayPermissionGranted(): Promise<boolean>;
  isAccessibilityServiceEnabled(): Promise<boolean>;
  openOverlaySettings(): Promise<boolean>;
  openAccessibilitySettings(): Promise<boolean>;
  startMonitoring(): Promise<boolean>;
  stopMonitoring(): Promise<boolean>;
  hideOverlay(): Promise<boolean>;
  setMinimumPerKm(value: number): Promise<boolean>;
  getMinimumPerKm(): Promise<number>;
  showTestOverlay(payload?: string): Promise<boolean>;
}

export default requireNativeModule<KmCertoNativeModule>("KmCertoNative");
