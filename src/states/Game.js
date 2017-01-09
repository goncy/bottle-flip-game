/* globals __DEV__ */
import Phaser from 'phaser'
import Bottle from '../sprites/Bottle'

import {bottleInRange, bottleInRangeSoft} from '../utils'

export default class extends Phaser.State {
  init () {
    this.checkBottlePosition = this.checkBottlePosition.bind(this)

    this.hasWon = false
    this.firstTime = true
    this.messageText = null
  }

  preload () {
    this.game.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.restitution = 0.12
    this.game.physics.p2.gravity.y = 1000

    this.game.load.image('star', 'assets/images/star.png')
    this.game.load.image('bottle', 'assets/images/bottle.png')
    this.game.load.physics('physicsData', 'assets/sprites/bottle.json')
  }

  create () {
    this.bottle = new Bottle({
      game: this,
      x: this.world.centerX,
      y: this.world.bounds.bottom - 32,
      event: {
        time: Phaser.Timer.SECOND * 1.25,
        callback: this.checkBottlePosition
      }
    })

    this.game.add.existing(this.bottle)
  }

  render () {
    if (__DEV__) {
      this.game.debug.spriteInfo(this.bottle, 32, 32)
    }
  }

  checkBottlePosition () {
    if (bottleInRangeSoft(this.bottle.angle)) {
      setTimeout(() => {
        if (bottleInRange(this.bottle.angle)) return this.checkIfNotAlreadyWon()
      }, 500)
    }
  }

  checkIfNotAlreadyWon () {
    if (!this.hasWon) return this.checkIfNotFirstTime()
  }

  checkIfNotFirstTime () {
    if (!this.firstTime) this.checkIfBottleSpun()
    else return this.firstTime = false //eslint-disable-line
  }

  checkIfBottleSpun () {
    if (this.bottle.hasSpun()) return this.checkWonState()
    else return this.showMessage('La botella debe girar por lo menos una vuelta')
  }

  checkWonState () {
    const winPositionNumber = bottleInRange(this.bottle.angle)
    if (winPositionNumber === 1) return this.winnerMessage('Ganaste')
    else if (winPositionNumber === 2) return this.winnerMessage('WTFFFFF, re ganaste')
  }

  winnerMessage (message) {
    this.hasWon = true

    this.winnerMessageText = this.game.add.text(this.world.centerX, this.world.centerY, message)

    this.winnerMessageText.font = 'Bungee Shade'
    this.winnerMessageText.padding.set(10, 16)
    this.winnerMessageText.fontSize = 40
    this.winnerMessageText.fill = '#1B6795'
    this.winnerMessageText.smoothed = false
    this.winnerMessageText.anchor.setTo(0.5)

    const emitter = this.game.add.emitter(this.game.world.centerX, 0, 200)
    emitter.width = this.game.world.width
    emitter.makeParticles('star')
    emitter.start(false, 5000, 20)

    this.winnerMessageTimer = this.game.time.events.add(
      Phaser.Timer.SECOND * 5,
      () => {
        emitter.destroy()
        this.winnerMessageText.destroy()
        this.game.time.events.remove(this.winnerMessageTimer)
        this.hasWon = false
      },
      this
    )
  }

  showMessage (message) {
    if (this.messageText) return

    this.messageText = this.game.add.text(this.world.centerX, 45, message)

    this.messageText.font = 'Bungee Shade'
    this.messageText.padding.set(10, 16)
    this.messageText.fontSize = 22
    this.messageText.fill = '#1B6795'
    this.messageText.smoothed = false
    this.messageText.anchor.setTo(0.5)

    this.messageTimer = this.game.time.events.add(
      Phaser.Timer.SECOND * 7,
      () => {
        this.messageText.destroy()
        this.messageText = null
        this.game.time.events.remove(this.messageTimer)
      },
      this
    )
  }
}
