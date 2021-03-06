import './App/Config/ReactotronConfig'
import Expo from 'expo'
import DebugConfig from './App/Config/DebugConfig'

const entrypoint =
  __DEV__ && DebugConfig.launchStorybook
    ? require('./storybook').default
    : require('./App/Containers/App').default

Expo.registerRootComponent(entrypoint)
