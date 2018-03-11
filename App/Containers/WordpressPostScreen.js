import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'
import WPCard from '../Components/WPCard'
import { connect } from 'react-redux'
import { WordpressRedux } from 'wp-react-core'
import {placeHolder1} from '../Images/base64'
import HTMLView from 'react-native-htmlview'
import { Colors } from '../Themes'
// Styles
import styles from './Styles/LaunchScreenStyles'
const { WordpressActions } = WordpressRedux

class WordpressPostScreen extends Component {
  constructor (props) {
    super(props)
    this.state = props
  }

  componentWillReceiveProps (newProps) {
    this.setState(newProps)
  }

  componentDidMount () {
    this.props.wpSlugRequested({pageName: this.props.navigation.state.params.pageName})
  }

  getPosts () {
    if (this.state.post) {
      const contentObj = {
        title: this.state.post.title.rendered,
        link: this.state.post.link.replace('http://i-create.org', ''),
        slug: this.state.post.slug,
        body: this.state.post.content.rendered,
        onPress: () => {
          this.props.navigation.navigate('WordpressHomeScreen')
        },
        image: (this.state.post.better_featured_image ? this.state.post.better_featured_image.media_details.sizes['medium_large'].source_url : placeHolder1)
      }
      return (
        <WPCard index={0} image={contentObj.image} title={contentObj.title} body={contentObj.body} btnColor={Colors.linkColor} btnText='Go Back' onPressLink={contentObj.onPress} />
      )
    }
  }
  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}>
          {
               this.getPosts()
            }
        </ScrollView>
      </View>
    )
  }
}
const mapStateToProps = (state, props) => {
  return ({
    fetching: state.wp.fetching,
    posts: state.wp.posts,
    post: state.wp.post
  })
}

const mapDispatchToProps = (dispatch) => {
  return {
    wpSlugRequested: (payload) => dispatch(WordpressActions.wpSlugRequested(payload)),
    wpPageRequested: (payload) => dispatch(WordpressActions.wpPageRequested(payload)),
    wpAllRequested: (payload) => dispatch(WordpressActions.wpAllRequested(payload)),
    getPosts: (payload) => dispatch(WordpressActions.getPosts(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordpressPostScreen)
