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

let isAnimation = true
let currentRotation = 0
let rotationSpeed = 0.05
let targetDegree = 10

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
  if(currentRotation < targetDegree) {
    isAnimation = true
  } else {
    isAnimation = false
  }
  addImageWithMotion(imgWheel, 19, 9, 0, 1, isAnimation, currentRotation)
  addImage(ring, 19, 10, 2, 0.257, true)
  addImage(innerDisk, 0, 0, 0, 0.257, true)
  addImage(cursorOff, 0, 12, -wheelBack.height * 0.256 / 2, 0.257, true)
  addImage(character, 0, 165,  (canvas.height - character.height * 0.183) / 2, 0.183, true)

  currentRotation += rotationSpeed
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

function drawMotionBlurImage(image, x, y, rotation) {
  const blurSteps = 10; // Количество шагов размытия
  const blurAlpha = 0.1; // Прозрачность для каждого шага размытия

  ctx.save();
  ctx.translate( x , y );

  for (let i = 0; i < blurSteps; i++) {
      ctx.save();
      ctx.rotate(rotation - i * 0.01);
      ctx.globalAlpha = blurAlpha;

      // Рисуем изображение с учетом размытия
      ctx.drawImage(image, -image.width / 2, -image.height / 2, image.width  , image.height );
      ctx.restore();
  }

  ctx.restore();
}

function addImageWithMotion(image, angle, translateX, translateY, scale, isAnimation, lCurrentRotation) {
  const imgWidth = image.width * scale
  const imgHeight = image.height * scale

  let yAngleInRadians = degToRad(angle) 
  let zAngleInRadians = 0

  let blurSteps = 10; 
  let blurAlpha = 0.1; 
  console.log(lCurrentRotation)
  // Update the rotation angle along the Z-axis
  if (isAnimation) {
    //zAngleInRadians = performance.now() / 300
    zAngleInRadians = lCurrentRotation
  }else {
    zAngleInRadians = 0
  }
  
  // Set the perspective transformation with the initial Y-axis rotation
  const cosY = Math.cos(yAngleInRadians)
  const sinY = Math.sin(yAngleInRadians)

  ctx.save()
  for (let i = 0; i < blurSteps; i++) {
    blurAlpha = 1 / i
    
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
  
    ctx.rotate(zAngleInRadians - i * 0.02)
    ctx.translate(-vanishPointX, -vanishPointY )
    ctx.globalAlpha = blurAlpha;
    

    ctx.drawImage(
      image,
      vanishPointX - imgWidth / 2,  
      vanishPointY - imgHeight / 2, 
      imgWidth,                     
      imgHeight                     
    )
    ctx.restore();
  }
    ctx.restore();
    ctx.globalAlpha = 1
} 