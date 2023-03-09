const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const vanishPointX = canvas.width / 2
const vanishPointY = canvas.height / 2

const imgWheel = new Image()
const imgWheel2 = new Image()
imgWheel.src = "models/texture/red_white.png"
imgWheel2.src = "models/texture/charakter.png"
imgWheel.onload = function() {
  imgWheel2.onload = function() {
    motion()
  }
}






  function addImage(image, angle, translateX, translateY, scale, stat) {
    const imgWidth = image.width * scale
    const imgHeight = image.height * scale

    let yAngleInRadians = degToRad(angle) 
    let zAngleInRadians = 0

    // Update the rotation angle along the Z-axis
    if (!stat) {
      zAngleInRadians = performance.now() / 300
    }else {
      zAngleInRadians = 0
    }
    
    // Set the perspective transformation with the initial Y-axis rotation
    const cosY = Math.cos(yAngleInRadians)
    const sinY = Math.sin(yAngleInRadians)
    ctx.setTransform(
      cosY,    // a
      0,       // b (no rotation along the X-axis)
      0,       // c (no rotation along the Z-axis)
      1,       // d (no scaling)
      vanishPointX * (1 - cosY), // e
      vanishPointY,              // f
    )

    // Apply the additional Z-axis rotation using the center of the image as the transformation point
    ctx.translate(vanishPointX + translateX, 0 + translateY )
    ctx.rotate(zAngleInRadians)
    ctx.translate(-vanishPointX, -vanishPointY )

    ctx.drawImage(
      image,
      vanishPointX - imgWidth / 2,  
      vanishPointY - imgHeight / 2, 
      imgWidth,                     
      imgHeight                     
    )
  } 


  function motion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    addImage(imgWheel, 0, 0, 0, 1, false)
    addImage(imgWheel2, 0, 0, 0, 0.2, true)
    requestAnimationFrame(motion)
  }

  function degToRad(degrees) {
    return degrees * (Math.PI / 180)
  }