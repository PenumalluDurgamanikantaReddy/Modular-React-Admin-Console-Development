/**
 * MODULE FEDERATION BOUNDARY — Users Module
 *
 * In production this module would be extracted as a separate Webpack/Vite build:
 *
 * // webpack.config.js (usersRemote)
 * new ModuleFederationPlugin({
 *   name: 'usersRemote',
 *   filename: 'remoteEntry.js',
 *   exposes: {
 *     './UsersModule': './src/modules/users/UsersModule',
 *     './usersSlice': './src/modules/users/slice/usersSlice',
 *   },
 *   shared: {
 *     react: { singleton: true, requiredVersion: '^19.0.0' },
 *     'react-dom': { singleton: true },
 *     '@reduxjs/toolkit': { singleton: true },
 *     react-redux: { singleton: true },
 *   },
 * })
 *
 * // Shell app webpack.config.js (host)
 * remotes: {
 *   usersRemote: 'usersRemote@https://users.google.app/remoteEntry.js',
 * }
 *
 * The shell would then lazy-load:
 *   const UsersModule = React.lazy(() => import('usersRemote/UsersModule'));
 * and inject the slice dynamically into the store via injectReducer().
 */

export { default } from './UsersModule';
