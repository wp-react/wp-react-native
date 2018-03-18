import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
import {placeHolder1} from '../Images/base64'
import image from '../Images/placeholder/sc9Img3.jpg'
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
    onShareLink: PropTypes.func
  }

  render () {
    const image = { uri: this.props.image }
    return (
      <Card key={this.props.index}>
        <CardImage source={image} />
        <CardTitle title={`${this.props.title}`} />
        <CardContent>
          <HTMLView value={(this.props.isExcerpt ? this.props.excerpt:this.props.body)} />
        </CardContent>
        <CardAction
          separator
          inColumn={false}>
          <CardButton
            onPress={this.props.onPressLink}
            title={this.props.btnText}
            color={this.props.btnColor}
      />
        </CardAction>
      </Card>
    )
  }
}
