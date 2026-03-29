// Reexport the native module. On web, it will be resolved to KmCertoNativeModule.web.ts
// and on native platforms to KmCertoNativeModule.ts
export { default } from './src/KmCertoNativeModule';
export { default as KmCertoNativeView } from './src/KmCertoNativeView';
export * from  './src/KmCertoNative.types';
