export const centerGameObjects = (objects) => {
  objects.forEach(function (object) {
    object.anchor.setTo(0.5)
  })
}

export const between = (x, min, max) => x >= min && x <= max

export const bottleInRange = angle => {
  if (between(angle, -4, 4)) {
    return 1
  } else if (between(angle, -184, -176)) {
    return 2
  } else {
    return 0
  }
}

export const bottleInRangeSoft = angle => {
  if (between(angle, -15, 15)) {
    return 1
  } else if (between(angle, -194, -165)) {
    return 2
  } else {
    return 0
  }
}
