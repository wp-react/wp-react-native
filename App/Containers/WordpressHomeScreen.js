import React, { Component } from 'react'
import { ScrollView, View } from 'react-native'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import { connect } from 'react-redux'
import { WordpressRedux } from 'wp-react-core'
import {placeHolder1} from '../Images/base64'
import HTMLView from 'react-native-htmlview'
// Styles
import styles from './Styles/LaunchScreenStyles'
const { WordpressActions } = WordpressRedux

class WordpressHomeScreen extends Component {
  constructor (props) {
    super(props)
    this.state = props
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
          link: post.link.replace('http://i-create.org', ''),
          body: post.excerpt.rendered,
          image: (post.better_featured_image ? post.better_featured_image.media_details.sizes['medium_large'].source_url : placeHolder1)
        }
        return (
          <Card key={index}>
            <CardImage source={{uri: `${contentObj.image}`}} />
            <CardTitle title={`${contentObj.title}`} />
            <CardContent>
              <HTMLView value={`${contentObj.body}`} />
            </CardContent>
            <CardAction
              separator
              inColumn={false}>
              <CardButton
                onPress={() => {}}
                title='Learn More'
                color='blue'
      />
              <CardButton
                onPress={() => {}}
                title='Share'
                color='blue'
      />
            </CardAction>
          </Card>
        )
      })
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

export default connect(mapStateToProps, mapDispatchToProps)(WordpressHomeScreen)
