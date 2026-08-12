/**
 * MODULE FEDERATION BOUNDARY — Settings Module
 *
 * In production this module would be extracted as a separate Webpack/Vite remote:
 *
 * // webpack.config.js (settingsRemote)
 * new ModuleFederationPlugin({
 *   name: 'settingsRemote',
 *   filename: 'remoteEntry.js',
 *   exposes: {
 *     './SettingsModule': './src/modules/settings/SettingsModule',
 *     './settingsSlice': './src/modules/settings/slice/settingsSlice',
 *   },
 *   shared: {
 *     react: { singleton: true },
 *     'react-dom': { singleton: true },
 *     '@reduxjs/toolkit': { singleton: true },
 *     'react-hook-form': { singleton: true },
 *   },
 * })
 */

export { default } from './SettingsModule';
