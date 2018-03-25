import React, { Component } from 'react'
import {StyleSheet, View, WebView} from 'react-native'
import PropTypes from 'prop-types'
import { Card, Button } from 'react-native-elements'
// import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
// import styles from './Styles/FullButtonStyles'
import HTMLView from 'react-native-htmlview'

export default class WPCard extends Component {
  static propTypes = {
    index: PropTypes.number,
    image: PropTypes.string,
    title: PropTypes.string,
    body: PropTypes.string,
    btnText: PropTypes.string,
    btnColor: PropTypes.string,
    onPressLink: PropTypes.func,
    isExcerpt: PropTypes.bool,
    htmlView: PropTypes.bool,
    postEnabled: PropTypes.bool,
    onShareLink: PropTypes.func
  }

  getContent = () => {
    if (this.props.htmlView) {
      return (
        <View style={{flex: 1}}>
          <HTMLView
            value={(this.props.isExcerpt ? this.props.excerpt : this.props.body)}
            stylesheet={styles}
          />
        </View>
      )
    } else {
      return (
        <View style={{flex: 0.9}}>
          <WebView
            scalesPageToFit
            style={{flex: 1, minHeight: this.props.postHeight}}
            source={{html: (this.props.isExcerpt ? this.props.excerpt : this.props.body)}}
        />
        </View>
      )
    }
  }

  render () {
    const image = { uri: this.props.image }
    return (
      <Card
        containerStyle={{flex: 1}}
        wrapperStyle={{flex: 1}}
        imageWrapperStyle={{flex: 1}}
        key={this.props.index}
        title={`${this.props.title}`}
        image={image}>
        <View style={{flex: 1}}>
          {
          this.props.postEnabled === true && this.getContent()
        }
          <View style={{flex: 0.1, backgroundColor: 'white', padding: 10}}>
            <Button
        // icon={{name: 'code'}}
              backgroundColor='#03A9F4'
        // fontFamily='Lato'
              onPress={this.props.onPressLink}
              buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0, padding: 5}}
              title={this.props.btnText} />
          </View>
        </View>
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  img: {
    resizeMode: 'contain',
    width: '100%',
    flex: -1,
    minWidth: '5'
  }
})

WPCard.defaultProps = {
  htmlView: false,
  postEnabled: true
}
