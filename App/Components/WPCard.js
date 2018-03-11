import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardTitle, CardContent, CardAction, CardButton, CardImage } from 'react-native-material-cards'
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
    onShareLink: PropTypes.func
  }

  render () {
    return (
      <Card key={this.props.index}>
        <CardImage source={{uri: `${this.props.image}`}} />
        <CardTitle title={`${this.props.title}`} />
        <CardContent>
          <HTMLView value={`${this.props.body}`} />
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
