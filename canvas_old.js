let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')

//Draw image
let image = new Image()
image.src = 'models/texture/red_white.png'
image.onload = function() {
    //ctx.drawImage(image,0,0) 

    const imgWidth = image.width;
    const imgHeight = image.height;
  
    // Define the vanishing point and the distance from it
    const vanishPointX = canvas.width / 2;
    const vanishPointY = canvas.height / 2;
    const distance = 1

    // Define the initial rotation angle
    let angleInRadians = 0;

    function animate() {
        angleInRadians += Math.PI / 180 // Rotate 1 degree per frame
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Set the perspective transformation
        ctx.setTransform(
            1,                   // a
            0,                   // b
            0,                   // c
            Math.cos(angleInRadians) / distance,  // d
            0,                   // e
            vanishPointY         // f
        )

        // Draw the image
        ctx.drawImage(
            image,
            -imgWidth / 2 + vanishPointX,  // x
            -imgHeight / 2,                // y
            imgWidth,                      // width
            imgHeight                      // height
        )

        requestAnimationFrame(animate);
    }
  animate() 
}