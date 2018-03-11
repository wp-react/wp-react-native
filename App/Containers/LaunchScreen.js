import React from 'react'
import ExpoGraphics from 'expo-graphics'
import Expo from 'expo'
import * as THREE from 'three'
import ExpoTHREE from 'expo-three'
import { View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { WordpressRedux } from 'wp-react-core'
import {placeHolder1} from '../Images/base64'
// Styles
import styles from './Styles/LaunchScreenStyles'
const totalClouds = 100
const { WordpressActions } = WordpressRedux

const fragmentShader = `
uniform sampler2D map;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;

varying vec2 vUv;

void main() {

  float depth = gl_FragCoord.z / gl_FragCoord.w;
  float fogFactor = smoothstep( fogNear, fogFar, depth );

  gl_FragColor = texture2D( map, vUv );
  gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
  gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

}
`
const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`
console.disableYellowBox = true
function round (n) {
  if (!n) {
    return 0
  }
  return Math.floor(n * 100) / 100
}
class LaunchScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {...props, accelerometerData: {}}
    this.width = 0
    this.height = 0
  }

  componentWillReceiveProps (newProps) {
    this.setState(newProps)
  }

  componentDidMount () {
    this._toggle()
  }

  componentWillUnmount () {
    this._unsubscribe()
    if (this._requestAnimationFrameID) {
      cancelAnimationFrame(this._requestAnimationFrameID)
    }
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe()
    } else {
      this._subscribe()
    }
  }

  _slow = () => {
    Expo.Accelerometer.setUpdateInterval(1000)
  }

  _fast = () => {
    Expo.Accelerometer.setUpdateInterval(16)
  }

  _subscribe = () => {
    this._subscription = Expo.Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData })
    })
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove()
    this._subscription = null
  }

  buildClouds = async () => {
    var texture = await ExpoTHREE.createTextureAsync({
      asset: Expo.Asset.fromModule(require('../Images/cloud10.png'))
    })
    texture.magFilter = THREE.LinearMipMapLinearFilter
    texture.minFilter = THREE.LinearMipMapLinearFilter
    var fog = new THREE.Fog(0x4584b4, -100, 3000)
    let material = new THREE.ShaderMaterial({
      uniforms: {
        'map': { type: 't', value: texture },
        'fogColor': { type: 'c', value: fog.color },
        'fogNear': { type: 'f', value: fog.near },
        'fogFar': { type: 'f', value: fog.far }
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      depthWrite: false,
      depthTest: false,
      transparent: true
    })
    let geometry = new THREE.Geometry()
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64))

    for (var i = 0; i < totalClouds; i++) {
      plane.position.x = Math.random() * 1000 - 500
      plane.position.y = -Math.random() * Math.random() * 200 - 15
      plane.position.z = i
      plane.rotation.z = Math.random() * Math.PI
      plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5
      // THREE.Geometry.merge(plane)
      THREE.GeometryUtils.merge(geometry, plane)
    }

    let mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
    mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = -totalClouds
    this.scene.add(mesh)
  }

  _onGLContextCreate = async ({ gl, canvas, width, height, scale }) => {
    // this.arSession = await this._glView.startARSessionAsync()
    this.width = width
    this.height = height
    this.scene = this.configureScene()
    this.camera = this.configureCamera({ width, height })
    // this.controls = new THREE.OrbitControls(this.camera);
    // this.configureLights();
    this.renderer = ExpoTHREE.renderer({ gl, canvas })
    this.renderer.setPixelRatio(scale)
    this.renderer.setSize(width, height)
    this.renderer.setClearColor(0x4584b4)
    // this.scene.background = ExpoTHREE.createARBackgroundTexture(this.arSession, this.renderer)
    this.buildClouds()
  }

  renderGL = (delta) => {
    let lastFrameTime
    // this._requestAnimationFrameID = requestAnimationFrame(render)
    const now = 0.001 * global.nativePerformanceNow()
    if (!this.start_time) this.start_time = now
    const dt = typeof lastFrameTime !== 'undefined'
      ? now - lastFrameTime
      : 0.16666
    this.tick += dt
    if (this.tick < 0) this.tick = 0
    let { x, y, z } = this.state.accelerometerData
    let position = ((Date.now() - this.start_time) * 0.03) % totalClouds
    this.camera.position.x += (round(x) - this.camera.position.x) * 0.01
    this.camera.position.y += (-round(y) - this.camera.position.y) * 0.01
    this.camera.position.z = -position + totalClouds
    this.camera.lookAt(this.scene.position)
    this.renderer.render(this.scene, this.camera)
    // NOTE: At the end of each frame, notify `Expo.GLView` with the below
    lastFrameTime = now
  }

  configureScene = () => {
    // scene
    let scene = new THREE.Scene()
    return scene
  }

  configureCamera = ({ width, height }) => {
    // camera
    let camera = new THREE.PerspectiveCamera(30, width / height, 1, 3000)
    return camera
  }

  renderScene = () => (
    <ExpoGraphics.View
      onContextCreate={this._onGLContextCreate}
      onRender={this.renderGL}
      style={{ flex: 1 }}
      onResize={this.onResize}
      onShouldReloadContext={this.onShouldReloadContext}
      />
  )

  renderSVG = () => {
    return (
      <View style={{ flex: 1, position: 'absolute', zIndex: 1, top: (this.height / 2 - 100), left: (this.width / 2 - 100) }}>
        <TouchableOpacity accessibilityLabel='svgBtn' accessible testID='svgBtn' ref='svgBtn' onPress={() => {
          console.tron.log('onPress')
          this.props.navigation.navigate('WordpressHomeScreen')
        }}>
          <Expo.Svg height={200} width={200} viewBox='0 0 512 512'>
            <Expo.Svg.LinearGradient id='grad' x1='0' y1='512' x2='0' y2='0'>
              <Expo.Svg.Stop offset='0' stopColor='#0CA3D1' stopOpacity='0' />
              <Expo.Svg.Stop offset='1' stopColor='#bcefff' stopOpacity='1' />
            </Expo.Svg.LinearGradient>
            <Expo.Svg.Path
              clipRule='evenodd'
              d='M198.627 398.169l-83.444-250.333c8.616-.453 17.232-1.359 25.396-2.266 8.616-1.359 9.522-7.71 9.069-10.881-.453-2.726-3.172-8.616-10.429-7.71-22.216 1.813-42.175 2.719-60.767 2.719h-7.257c40.363-58.955 107.934-97.95 185.035-97.95 55.775 0 106.567 20.404 146.016 54.416-12.248 2.265-24.935 10.882-28.575 23.13-10.873 35.372 10.437 58.502 20.42 73.914 10.874 17.232 14.968 35.832 16.779 55.33 2.266 27.208-9.077 61.673-16.326 87.983l-23.591 70.289-82.991-248.974c8.624-.453 17.232-1.359 25.403-2.266 9.062-1.359 9.515-7.71 9.062-10.881 0-2.726-2.719-8.163-10.421-7.71-22.231 2.266-41.729 2.719-60.321 2.719s-38.543-.453-60.768-2.719c-7.257-.453-9.975 4.984-10.428 7.71 0 3.171.453 9.522 9.069 10.881 7.71.906 15.874 1.813 23.583 2.266l36.277 98.864-50.791 151.469zM480.254 256.23c0 80.257-42.637 151-106.583 190.464l52.167-148.749c10.421-28.122 22.216-56.689 29.012-86.163 3.625-16.326 5.453-32.652 5-49.432 13.139 28.567 20.404 60.314 20.404 93.88zM256.23 480.254c-22.231 0-43.089-3.172-63.04-9.077l65.759-197.261 71.195 193.636c-23.59 8.155-48.073 12.702-73.914 12.702zM152.375 454.85C80.718 417.214 31.747 342.394 31.747 256.23c0-30.395 5.89-58.962 16.771-85.264L152.375 454.85zM256.23 0C114.73 0 0 114.73 0 256.23 0 397.263 114.73 512 256.23 512 397.263 512 512 397.263 512 256.23 512 114.73 397.263 0 256.23 0z'
              fill='url(#grad)'
              fillRule='evenodd'
            />
          </Expo.Svg>
        </TouchableOpacity>
      </View>
    )
  }

  render = () => (
    <View style={{ flex: 1 }}>
      {this.renderScene()}
      {this.renderSVG()}
    </View>
  )

  onResize = ({ width, height, scale }) => {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(scale)
    this.renderer.setSize(width, height)
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

export default connect(mapStateToProps, mapDispatchToProps)(LaunchScreen)
