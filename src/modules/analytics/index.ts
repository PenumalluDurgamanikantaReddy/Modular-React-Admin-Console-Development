/**
 * MODULE FEDERATION BOUNDARY — Analytics Module
 *
 * In production this module would be extracted as a separate Webpack/Vite remote:
 *
 * // webpack.config.js (analyticsRemote)
 * new ModuleFederationPlugin({
 *   name: 'analyticsRemote',
 *   filename: 'remoteEntry.js',
 *   exposes: {
 *     './AnalyticsModule': './src/modules/analytics/AnalyticsModule',
 *     './analyticsSlice': './src/modules/analytics/slice/analyticsSlice',
 *   },
 *   shared: {
 *     react: { singleton: true },
 *     'react-dom': { singleton: true },
 *     '@reduxjs/toolkit': { singleton: true },
 *     recharts: { singleton: true },
 *   },
 * })
 */

export { default } from './AnalyticsModule';
