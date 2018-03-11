import React, { Component } from 'react'
import { ScrollView, View, RefreshControl } from 'react-native'
import WPCard from '../Components/WPCard'
import { connect } from 'react-redux'
import { WordpressRedux } from 'wp-react-core'
import {placeHolder1} from '../Images/base64'
import { Colors } from '../Themes'
// Styles
import styles from './Styles/LaunchScreenStyles'
const { WordpressActions } = WordpressRedux
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
}
class WordpressHomeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {...props, refreshing: false, page: 1}
    this.page = 1
  }

  componentWillReceiveProps (newProps) {
    this.setState(newProps)
  }

  componentDidMount () {
    if (!this.state.posts.length) this.props.wpAllRequested()
  }

  getPosts () {
    if (this.state.posts.length) {
      return this.state.posts.map((post, index) => {
        const contentObj = {
          title: post.title.rendered,
          slug: post.slug,
          link: post.link.replace('http://i-create.org', ''),
          body: post.excerpt.rendered,
          onPress: () => {
            this.props.navigation.navigate('WordpressPostScreen', {pageName: post.slug})
          },
          image: (post.better_featured_image ? post.better_featured_image.media_details.sizes['medium_large'].source_url : placeHolder1)
        }
        return (
          <WPCard btnColor={Colors.linkColor} btnText='Learn More' index={index} image={contentObj.image} title={contentObj.title} body={contentObj.body} onPressLink={contentObj.onPress} />
        )
      })
    }
  }

  _onRefresh = () => {
    this.setState({page: this.page++}, () => {
      this.props.wpPageRequested({pageNumber: this.state.page})
    })
  }

  render () {
    return (
      <View style={styles.mainContainer}>
        <ScrollView style={styles.container}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              console.tron.log(' on scroll end fired')
              this._onRefresh()
            }
          }}
          scrollEventThrottle={400}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
          />
        }>
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

export default connect(mapStateToProps, mapDispatchToProps)(WordpressHomeScreen)
