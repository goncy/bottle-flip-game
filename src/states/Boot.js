import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
    this.stage.backgroundColor = '#00bfff'
    this.fontsReady = false
    this.fontsLoaded = this.fontsLoaded.bind(this)
  }

  preload () {
    WebFont.load({
      google: {
        families: ['Bungee Shade']
      },
      active: this.fontsLoaded
    })

    const text = this.add.text(
      this.world.centerX,
      this.world.centerY,
      'CARGANDO',
      { font: '26px Arial', fill: '#1B6795', align: 'center' }
    )

    text.anchor.setTo(0.5, 0.5)

    this.load.image('loaderBg', 'assets/images/loader-bg.png')
    this.load.image('loaderBar', 'assets/images/loader-bar.png')
  }

  render () {
    if (this.fontsReady) {
      this.state.start('Splash')
    }
  }

  fontsLoaded () {
    this.fontsReady = true
  }

}
