import {
    withMainActivity,
    withAndroidManifest,
    ConfigPlugin,
    AndroidConfig,
    Mod
} from '@expo/config-plugins';
import type { Permission } from 'react-native-health-connect';

function toManifestPermissionName({ accessType, recordType }: Permission): string {
    const access = accessType.toUpperCase();
    const record = recordType.replace(/([A-Z])/g, '_$1').replace(/^_/, '').toUpperCase();
    return `android.permission.health.${access}_${record}`;
}

function addPermissionDelegate(contents: string) {
    if (contents.includes('HealthConnectPermissionDelegate')) {
        return contents;
    }

    const withImport = contents.replace(
        'import com.facebook.react.ReactActivity',
        'import com.facebook.react.ReactActivity\nimport dev.matinzd.healthconnect.permissions.HealthConnectPermissionDelegate'
    );

    const withDelegate = withImport.replace(
        'super.onCreate(null)',
        'super.onCreate(null)\n    HealthConnectPermissionDelegate.setPermissionDelegate(this)'
    );

    return withDelegate;
}

function addHealthPermissions(
    manifest: AndroidConfig.Manifest.AndroidManifest['manifest'],
    permissions: Permission[]
) {
    const declared = new Set(
        manifest['uses-permission']?.map(permission => permission.$['android:name']) ?? []
    );

    const missing = permissions
        .map(toManifestPermissionName)
        .filter(name => !declared.has(name))
        .map(name => ({ $: { 'android:name': name } }));

    manifest['uses-permission'] = [...(manifest['uses-permission'] ?? []), ...missing];
}

function addRationaleIntentFilter(app: AndroidConfig.Manifest.ManifestApplication) {
    const mainActivity = app.activity?.find(
        activity => activity.$['android:name'] === '.MainActivity'
    );

    if (!mainActivity) {
        return;
    }

    const rationaleAction = 'androidx.health.ACTION_SHOW_PERMISSIONS_RATIONALE';
    const hasRationaleFilter = mainActivity['intent-filter']?.some(intentFilter =>
        intentFilter.action?.some(action => action.$?.['android:name'] === rationaleAction)
    );

    if (hasRationaleFilter) {
        return;
    }

    const rationaleFilter = {
        action: [{ $: { 'android:name': rationaleAction } }]
    };

    mainActivity['intent-filter'] = [...(mainActivity['intent-filter'] ?? []), rationaleFilter];
}

function addViewPermissionUsageAlias(app: AndroidConfig.Manifest.ManifestApplication) {
    const hasViewPermissionAlias = app['activity-alias']?.some(
        alias => alias.$?.['android:name'] === 'ViewPermissionUsageActivity'
    );

    if (hasViewPermissionAlias) {
        return;
    }

    const viewPermissionAlias = {
        $: {
            'android:name': 'ViewPermissionUsageActivity',
            'android:exported': 'true',
            'android:targetActivity': '.MainActivity',
            'android:permission': 'android.permission.START_VIEW_PERMISSION_USAGE'
        } as const,
        'intent-filter': [
            {
                action: [{ $: { 'android:name': 'android.intent.action.VIEW_PERMISSION_USAGE' } }],
                category: [{ $: { 'android:name': 'android.intent.category.HEALTH_PERMISSIONS' } }]
            }
        ]
    };

    app['activity-alias'] = [...(app['activity-alias'] ?? []), viewPermissionAlias];
}

function modifyAndroidManifest(
    permissions: Permission[]
): Mod<AndroidConfig.Manifest.AndroidManifest> {
    return mod => {
        const { manifest } = mod.modResults;
        const manifestApp = manifest.application?.[0];

        if (!manifestApp) {
            return mod;
        }

        addHealthPermissions(manifest, permissions);
        addRationaleIntentFilter(manifestApp);
        addViewPermissionUsageAlias(manifestApp);

        return mod;
    };
}

const modifyMainActivity: Mod<AndroidConfig.Paths.ApplicationProjectFile> = mod => {
    mod.modResults.contents = addPermissionDelegate(mod.modResults.contents);
    return mod;
};

const withHealthConnect: ConfigPlugin<Permission[]> = (config, permissions) => {
    config = withMainActivity(config, modifyMainActivity);
    config = withAndroidManifest(config, modifyAndroidManifest(permissions));
    return config;
};

export default withHealthConnect;
