const fs = require("fs");
const path = require("path");
const { AndroidConfig, withAndroidManifest, withDangerousMod } = require("expo/config-plugins");

const ACCESSIBILITY_SERVICE_NAME = "expo.modules.kmcertonative.KmCertoAccessibilityService";
const OVERLAY_SERVICE_NAME = "expo.modules.kmcertonative.KmCertoOverlayService";
const ACCESSIBILITY_XML_RESOURCE = "@xml/kmcerto_accessibility_service_config";

function ensureUsesPermission(manifest, permissionName) {
  const permissions = manifest.manifest["uses-permission"] ?? [];
  const exists = permissions.some((item) => item?.$?.["android:name"] === permissionName);

  if (!exists) {
    permissions.push({
      $: {
        "android:name": permissionName,
      },
    });
  }

  manifest.manifest["uses-permission"] = permissions;
}

function ensureService(application, serviceConfig) {
  const services = application.service ?? [];
  const existingIndex = services.findIndex((item) => item?.$?.["android:name"] === serviceConfig.$["android:name"]);

  if (existingIndex >= 0) {
    services[existingIndex] = serviceConfig;
  } else {
    services.push(serviceConfig);
  }

  application.service = services;
}

function ensureAndroidResources(projectRoot) {
  const xmlDir = path.join(projectRoot, "android", "app", "src", "main", "res", "xml");
  const valuesDir = path.join(projectRoot, "android", "app", "src", "main", "res", "values");

  fs.mkdirSync(xmlDir, { recursive: true });
  fs.mkdirSync(valuesDir, { recursive: true });

  const accessibilityConfig = `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
  android:accessibilityEventTypes="typeWindowContentChanged|typeWindowStateChanged"
  android:accessibilityFeedbackType="feedbackGeneric"
  android:notificationTimeout="150"
  android:canRetrieveWindowContent="true"
  android:accessibilityFlags="flagReportViewIds|flagIncludeNotImportantViews|flagRetrieveInteractiveWindows"
  android:description="@string/kmcerto_accessibility_service_description"
  android:packageNames="br.com.ifood.driver.app,com.app99.driver,com.ubercab.driver" />
`;

  const accessibilityStrings = `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string name="kmcerto_accessibility_service_description">Permite que o KmCerto leia valor, distância e tempo em apps suportados para exibir o overlay automático.</string>
</resources>
`;

  fs.writeFileSync(path.join(xmlDir, "kmcerto_accessibility_service_config.xml"), accessibilityConfig);
  fs.writeFileSync(path.join(valuesDir, "kmcerto_strings.xml"), accessibilityStrings);
}

const withKmCertoAndroid = (config) => {
  config = withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults;
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);

    ensureUsesPermission(manifest, "android.permission.SYSTEM_ALERT_WINDOW");
    ensureUsesPermission(manifest, "android.permission.FOREGROUND_SERVICE");

    ensureService(application, {
      $: {
        "android:name": ACCESSIBILITY_SERVICE_NAME,
        "android:enabled": "true",
        "android:exported": "true",
        "android:permission": "android.permission.BIND_ACCESSIBILITY_SERVICE",
      },
      "intent-filter": [
        {
          action: [
            {
              $: {
                "android:name": "android.accessibilityservice.AccessibilityService",
              },
            },
          ],
        },
      ],
      "meta-data": [
        {
          $: {
            "android:name": "android.accessibilityservice",
            "android:resource": ACCESSIBILITY_XML_RESOURCE,
          },
        },
      ],
    });

    ensureService(application, {
      $: {
        "android:name": OVERLAY_SERVICE_NAME,
        "android:enabled": "true",
        "android:exported": "false",
      },
    });

    return mod;
  });

  config = withDangerousMod(config, ["android", async (mod) => {
    ensureAndroidResources(mod.modRequest.projectRoot);
    return mod;
  }]);

  return config;
};

module.exports = withKmCertoAndroid;
