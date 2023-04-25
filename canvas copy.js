const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d",{ antialias: true })
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
let lightPart1 = new Image()
let lightPart2 = new Image()
let isAnimate = false
let wheelBlock
let angleDelta = 19

let rotationSpeed = 0.03//Скорость вращения колеса
let targetDegree = 0  //Угол на который врашаем

wheelBlock = {
  width: canvas.width * 0.7,
  height: canvas.height * 0.7
}

imgWheel.src = "img/red_white2.png"
character.src = "img/charakter.png"
character.width = wheelBlock.height 
character.height = wheelBlock.height 
wheelBack.src = "img/wheel_back.png"
ring.src = "img/ring.png"
innerDisk.src = "img/inner_disk.png"
cursorOff.src = "img/cursor_off.png"
lightPart1.src = "img/light_part1.png"
lightPart2.src = "img/light_part2.png"

let imgArray = [imgWheel, character, wheelBack, ring, innerDisk, lightPart1, lightPart2, cursorOff]
let isAnimation = true
let currentRotation = 0
let blurSteps = 1; 
let blurMarker = blurSteps * rotationSpeed

//Каллбек на остановку колеса
function wheelInTaregt(){
  console.log("Сектор ПРИЗ на барабане!")
}

//Задаем угол вращения
function setTarget(degree){
  targetDegree = degToRad(degree)  
}



//Калбек на загрузку всех изображений
loadImagesWithCallback(imgArray, (isLoad) => {
  setScale(imgWheel, 0.87)
  setScale(character, 1)
  setScale(wheelBack, 1)
  setScale(ring, 1)
  setScale(innerDisk, 0.4)
  setScale(cursorOff, 0.1)
  setScale(lightPart1, 1)
  setScale(lightPart2, 1)
  motion()
});


function addImage(image, translateX, translateY, globA) {
  ctx.globalAlpha = globA
  ctx.setTransform(1, 0, 0, 1, 0,vanishPointY)

  // Apply the additional Z-axis rotation using the center of the image as the transformation point
  ctx.translate(vanishPointX + translateX, 0 + translateY )
  ctx.translate(-vanishPointX, -vanishPointY )
  
  ctx.drawImage(
    image,
    vanishPointX - image.width / 2,  
    vanishPointY - image.height / 2, 
    image.width,                     
    image.height                     
  )
} 


function motion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let delta1 = Math.abs(Math.sin(performance.now() / 100)) //Alpha для фонариков
    let delta2 = Math.abs(Math.cos(performance.now() / 100)) //Alpha для фонариков
    
    addImage(wheelBack, 0, 0 ,1)
    addImageWithMotion(imgWheel, 19, 10, 0, currentRotation)
    addImage(ring, 0, 2, 1)
    addImage(innerDisk, 10, 0, 1)
    addImage(cursorOff, canvas.width * 0.01, -wheelBlock.height * 0.45, 1)
    addImage(lightPart1, 0, 0, delta1)
    addImage(lightPart2, 0, 0, delta2)
    addImage(character, character.height * 0.4,  (canvas.height - character.height) / 2, 1)
    

    //Затухиние и нарастание дополнительных слоев MotionBlur для плавности перехода
    if(isAnimate) {
      if (targetDegree - currentRotation < blurMarker && blurSteps > 1) {
        blurSteps -= 1
        rotationSpeed -= 0.002
      } else if (blurSteps < 20) {
        rotationSpeed += 0.002
        blurSteps += 1
        blurMarker = blurSteps * rotationSpeed
      }
      currentRotation += rotationSpeed
  }
    
  if (currentRotation <= targetDegree) {
    requestAnimationFrame(motion)
  }else {
    wheelInTaregt() //Остановка колеса
  }
}

//Углы в радианы
function degToRad(degrees) {
  return degrees * (Math.PI / 180)
}

//Загрузчик изображений
function loadImage(img) {
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

//Загружаем массив картинок и отдаем калбек
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



function addImageWithMotion(image, angle, translateX, translateY, lCurrentRotation) {
  let yAngleInRadians = degToRad(angle) 
  let zAngleInRadians = 0

  let blurAlpha = 0.1; 
  zAngleInRadians = lCurrentRotation
  
  // Задаем перспективное изкажение по Y
  const cosY = Math.cos(yAngleInRadians)
  ctx.save()
  
  //Рисуем дополнительные слои для MotionBlur
  for (let i = 0; i < blurSteps; i++) {
    blurAlpha = 1 / i
    ctx.setTransform(
      cosY,    // Поворот по Y
      0,       // Поворот по X
      0,       // Поворот по Z
      1,       // Маштаб
      vanishPointX * (1 - cosY), // Центр трансформации по X
      vanishPointY,              // Центр трансформации по Y
    )

    //Дополнительная трансформации по оси Z
    ctx.translate(vanishPointX + translateX, 0 + translateY )
  
    ctx.rotate(zAngleInRadians - i * 0.01)
    ctx.translate(-vanishPointX, -vanishPointY )
    ctx.globalAlpha = blurAlpha;
    

    ctx.drawImage(
      image,
      vanishPointX - image.width / 2,  
      vanishPointY - image.height / 2, 
      image.width,                     
      image.height                     
    )
    ctx.restore();
  }

    ctx.restore();
} 

function setScale(image, scale) {
 image.width = wheelBlock.height * scale
 image.height = wheelBlock.height * scale
}

document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener('click', function () {
      setTarget(420)
      isAnimate = true
      
  });
});

