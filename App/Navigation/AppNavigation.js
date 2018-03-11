import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import WordpressHomeScreen from '../Containers/WordpressHomeScreen'
import WordpressPostScreen from '../Containers/WordpressPostScreen'
import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  WordpressHomeScreen: { screen: WordpressHomeScreen },
  WordpressPostScreen: { screen: WordpressPostScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'LaunchScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
