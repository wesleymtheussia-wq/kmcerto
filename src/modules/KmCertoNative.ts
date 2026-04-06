import { requireNativeModule, EventEmitter, Subscription } from 'expo-modules-core';

// Importa o módulo nativo registrado no Expo
// O nome 'KmCertoNative' deve ser o mesmo definido no expo-module.config.json
const KmCertoNativeModule = requireNativeModule('KmCertoNative');

const eventEmitter = new EventEmitter(KmCertoNativeModule);

export default {
  // Funções do módulo
  requestScreenCapturePermission: async (): Promise<boolean> => {
    try {
      return await KmCertoNativeModule.requestScreenCapturePermission();
    } catch (e) {
      console.error("Erro ao pedir permissão de OCR:", e);
      return false;
    }
  },
  
  isScreenCaptureEnabled: (): boolean => {
    try {
      return KmCertoNativeModule.isScreenCaptureEnabled();
    } catch (e) {
      return false;
    }
  },

  // Gerenciamento de eventos
  addListener: (listener: (event: any) => void): Subscription => {
    return eventEmitter.addListener('onOfferDetected', listener);
  },

  removeAllListeners: () => {
    eventEmitter.removeAllListeners('onOfferDetected');
  }
};
