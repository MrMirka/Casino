const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "models/texture/red_white.png";
img.onload = function() {
  const imgWidth = img.width;
  const imgHeight = img.height;

  canvas.width = 512
  canvas.height = 512

  console.log(imgWidth + " " + imgHeight)
  console.log(canvas.width + " " + canvas.height)


  
    ctx.drawImage(
      img,
      0,  // x
      0, // y
      imgWidth,                     // width
      imgHeight                     // height
    );

}
