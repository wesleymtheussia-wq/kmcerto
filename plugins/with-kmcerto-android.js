const { withAndroidManifest, withDangerousMod, withPlugins } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const withKmCertoManifest = (config) => {
  return withAndroidManifest(config, async (cfg) => {
    let androidManifest = cfg.modResults.manifest;
    const mainApplication = androidManifest.application[0];

    // Adicionar permissões necessárias
    const permissions = [
      "android.permission.SYSTEM_ALERT_WINDOW",
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_SPECIAL_USE",
      "android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION",
      "android.permission.WAKE_LOCK",
      "android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS",
      "android.permission.RECEIVE_BOOT_COMPLETED",
    ];

    if (!androidManifest["uses-permission"]) androidManifest["uses-permission"] = [];
    
    permissions.forEach((perm) => {
      if (!androidManifest["uses-permission"].find((p) => p.$["android:name"] === perm)) {
        androidManifest["uses-permission"].push({ $: { "android:name": perm } });
      }
    });

    // Adicionar KmCertoPermissionActivity (Necessária para o OCR)
    if (!mainApplication.activity) mainApplication.activity = [];
    const hasPermActivity = mainApplication.activity.some(
      (a) => a.$ && a.$["android:name"] === "expo.modules.kmcertonative.KmCertoPermissionActivity"
    );
    if (!hasPermActivity) {
      mainApplication.activity.push({
        $: {
          "android:name": "expo.modules.kmcertonative.KmCertoPermissionActivity",
          "android:exported": "false",
          "android:theme": "@android:style/Theme.Translucent.NoTitleBar",
        },
      });
    }

    return cfg;
  });
};

const withKmCertoResources = (config) => {
  return withDangerousMod(config, [
    "android",
    async (cfg) => {
      const projectRoot = cfg.modRequest.projectRoot;
      const resDir = path.join(projectRoot, "android/app/src/main/res");

      const xmlDir = path.join(resDir, "xml");
      if (!fs.existsSync(xmlDir)) fs.mkdirSync(xmlDir, { recursive: true });

      const accessibilityConfig = `<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowContentChanged|typeWindowStateChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagReportViewIds|flagIncludeNotImportantViews|flagRetrieveInteractiveWindows"
    android:canRetrieveWindowContent="true"
    android:notificationTimeout="150"
    android:description="@string/kmcerto_accessibility_description" />`;

      fs.writeFileSync(path.join(xmlDir, "kmcerto_accessibility_service_config.xml" ), accessibilityConfig);

      const valuesDir = path.join(resDir, "values");
      if (!fs.existsSync(valuesDir)) fs.mkdirSync(valuesDir, { recursive: true });

      const stringsPath = path.join(valuesDir, "kmcerto_strings.xml");
      const stringsContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="kmcerto_accessibility_description">O KmCerto usa acessibilidade para ler as ofertas de corridas e calcular o valor por KM automaticamente.</string>
</resources>`;

      fs.writeFileSync(stringsPath, stringsContent);

      return cfg;
    },
  ]);
};

module.exports = (config) => {
  return withPlugins(config, [withKmCertoManifest, withKmCertoResources]);
};
