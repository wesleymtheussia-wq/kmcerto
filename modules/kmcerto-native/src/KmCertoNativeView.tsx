import { requireNativeView } from 'expo';
import * as React from 'react';

import { KmCertoNativeViewProps } from './KmCertoNative.types';

const NativeView: React.ComponentType<KmCertoNativeViewProps> =
  requireNativeView('KmCertoNative');

export default function KmCertoNativeView(props: KmCertoNativeViewProps) {
  return <NativeView {...props} />;
}
