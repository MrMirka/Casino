const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const vanishPointX = canvas.width / 2
const vanishPointY = canvas.height / 2

let imgWheel = new Image()
let character = new Image()
let wheelBack = new Image()
let ring = new Image()
let innerDisk = new Image()
let cursorOff = new Image()

imgWheel.src = "models/texture/red_white.png"
character.src = "models/texture/charakter.png"
wheelBack.src = "models/texture/wheel_back.png"
ring.src = "models/texture/ring.png"
innerDisk.src = "models/texture/inner_disk.png"
cursorOff.src = "models/texture/cursor_off.png"

let imgArray = [imgWheel, character, wheelBack, ring, innerDisk]


loadImagesWithCallback(imgArray, (isLoad) => {
  motion()
});





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
    vanishPointX * (1 - cosY), // e center point
    vanishPointY,              // f center point
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
  addImage(wheelBack, 0, 0, 0, 0.286, true)
  addImage(imgWheel, 19, 9, 0, 1, false)
  addImage(ring, 19, 10, 2, 0.257, true)
  addImage(innerDisk, 0, 0, 0, 0.257, true)
  addImage(cursorOff, 0, 12, -wheelBack.height * 0.256 / 2, 0.257, true)
  addImage(character, 0, 165,  (canvas.height - character.height * 0.183) / 2, 0.183, true)
  requestAnimationFrame(motion)
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

function loadImage(img) {
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

function loadImagesWithCallback(srcArray, callback) {
  let isLoad = false
  let counter = 0;

  srcArray.forEach((src) => {
    loadImage(src)
      .then(() => {
        counter++
        if (counter === srcArray.length) {
            isLoad = true
          callback( isLoad )
        }
      })
      .catch((err) => console.log(err));
  });
}