import { KmCertoNativeViewProps } from "./KmCertoNative.types";

export default function KmCertoNativeView(props: KmCertoNativeViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad?.({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
