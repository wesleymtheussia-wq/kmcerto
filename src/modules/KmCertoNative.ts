import { NativeModule, EventEmitter, Subscription } from 'expo-modules-core';

// Interface para o módulo nativo
declare class KmCertoNativeModule extends NativeModule {
  requestScreenCapturePermission(): Promise<boolean>;
  isScreenCaptureEnabled(): boolean;
}

// Importa o módulo nativo do Expo
import KmCertoNative from './KmCertoNativeModule';

const eventEmitter = new EventEmitter(KmCertoNative);

export default {
  // Funções do módulo
  requestScreenCapturePermission: async () => {
    return await KmCertoNative.requestScreenCapturePermission();
  },
  
  isScreenCaptureEnabled: () => {
    return KmCertoNative.isScreenCaptureEnabled();
  },

  // Gerenciamento de eventos
  addListener: (listener: (event: any) => void): Subscription => {
    return eventEmitter.addListener('onOfferDetected', listener);
  },

  removeAllListeners: () => {
    eventEmitter.removeAllListeners('onOfferDetected');
  }
};
