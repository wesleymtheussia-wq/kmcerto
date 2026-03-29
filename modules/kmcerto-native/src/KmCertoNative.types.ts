import type { StyleProp, ViewStyle } from "react-native";

export type KmCertoDecisionStatus = "ACEITAR" | "RECUSAR";

export type KmCertoOverlayEventPayload = {
  totalFare: number;
  totalFareLabel: string;
  status: KmCertoDecisionStatus;
  statusColor: string;
  perKm: number;
  perHour: number | null;
  perMinute: number | null;
  minimumPerKm: number;
  sourceApp: string;
  rawText: string;
};

export type KmCertoNativeModuleEvents = {
  KmCertoOverlayData: (params: KmCertoOverlayEventPayload) => void;
};

export type ChangeEventPayload = KmCertoOverlayEventPayload;

export type OnLoadEventPayload = {
  url?: string;
};

export type KmCertoNativeViewProps = {
  url?: string;
  onLoad?: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
