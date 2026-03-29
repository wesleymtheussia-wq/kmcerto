import { NativeModule, registerWebModule } from "expo";

import type { KmCertoNativeModuleEvents, KmCertoOverlayEventPayload } from "./KmCertoNative.types";

class KmCertoNativeModule extends NativeModule<KmCertoNativeModuleEvents> {
  async emitOverlayData(payload: KmCertoOverlayEventPayload): Promise<void> {
    this.emit("KmCertoOverlayData", payload);
  }

  async isOverlayPermissionGranted(): Promise<boolean> {
    return false;
  }

  async isAccessibilityServiceEnabled(): Promise<boolean> {
    return false;
  }

  async openOverlaySettings(): Promise<boolean> {
    return false;
  }

  async openAccessibilitySettings(): Promise<boolean> {
    return false;
  }

  async startMonitoring(): Promise<boolean> {
    return false;
  }

  async stopMonitoring(): Promise<boolean> {
    return false;
  }

  async hideOverlay(): Promise<boolean> {
    return false;
  }

  async setMinimumPerKm(_value: number): Promise<boolean> {
    return false;
  }

  async getMinimumPerKm(): Promise<number> {
    return 1.5;
  }

  async showTestOverlay(_payload?: string): Promise<boolean> {
    return false;
  }
}

export default registerWebModule(KmCertoNativeModule, "KmCertoNative");
