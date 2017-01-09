import Phaser from 'phaser'
import p2 from 'p2'

const BOTTLE_SPIN_ROTATION = 6.293246930743587

export default class extends Phaser.Sprite {
  constructor ({ game, x, y, asset = 'bottle', event }) {
    super(game, x, y, asset)

    this.game = game
    this.event = event
    this.game.physics.p2.enable(this)
    this.anchor.setTo(0.5)

    this.body.clearShapes()
    this.body.loadPolygon('physicsData', 'bottle')

    this.body.collideWorldBounds = true

    this.mouseBody = new p2.Body(this.game, this)
    this.game.physics.p2.world.addBody(this.mouseBody)

    this.game.input.onDown.add(this.click, this)
    this.game.input.onUp.add(this.release, this)
    this.game.input.addMoveCallback(this.move, this)

    this.body.onBeginContact.add(this.blockHit, this)
    this.body.onEndContact.add(this.blockLeave, this)

    this.click = this.click.bind(this)
    this.release = this.release.bind(this)
    this.move = this.move.bind(this)
    this.blockHit = this.blockHit.bind(this)
    this.blockLeave = this.blockLeave.bind(this)

    this.winTimer = null
  }

  update () {}

  click (pointer) {
    var bodies = this.game.physics.p2.hitTest(pointer.position, [ this.body ])

    // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
    var physicsPos = [this.game.physics.p2.pxmi(pointer.position.x), this.game.physics.p2.pxmi(pointer.position.y)]

    if (bodies.length) {
      var clickedBody = bodies[0]

      var localPointInBody = [0, 0]
      // this takes physicsPos and coverts it to the body's local coordinate system
      clickedBody.toLocalFrame(localPointInBody, physicsPos)

      // use a revoluteContraint to attach mouseBody to the clicked body
      this.mouseConstraint = this.game.physics.p2.createRevoluteConstraint(this.mouseBody, [0, 0], clickedBody, [this.game.physics.p2.mpxi(localPointInBody[0]), this.game.physics.p2.mpxi(localPointInBody[1])])
    }
  }

  release () {
    // remove constraint from object's body
    this.releaseRotation = this.rotation
    this.game.physics.p2.removeConstraint(this.mouseConstraint)
  }

  move (pointer) {
    // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
    this.mouseBody.position[0] = this.game.physics.p2.pxmi(pointer.position.x)
    this.mouseBody.position[1] = this.game.physics.p2.pxmi(pointer.position.y)
  }

  blockHit (body, shapeA, shapeB, equation) {
    this.winTime = this.game.time.events.add(this.event.time, this.event.callback, this)
  }

  blockLeave (body, shapeA, shapeB, equation) {
    this.game.time.events.remove(this.winTime)
  }

  hasSpun () {
    const spinDifference = (this.releaseRotation / BOTTLE_SPIN_ROTATION) - (this.rotation / BOTTLE_SPIN_ROTATION)
    return spinDifference >= 0.8 || spinDifference <= -0.8
  }
}
