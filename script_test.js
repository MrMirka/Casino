import * as THREE from './lib/three/build/three.module.js'
import { OrbitControls } from './lib/three/examples/jsm/controls/OrbitControls.js'


 let scene,
    camera,
    renderer,
    orbitControl

let clock = new THREE.Clock()



const canvas = document.querySelector('canvas.webgl')

scene  = new THREE.Scene()

camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100 )
camera.position.x = -0.53
camera.position.y = 0.68
camera.position.z = 1.6
camera.lookAt(0,0.7,0)

scene.add(camera)

renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } )
renderer.setPixelRatio( window.devicePixelRatio )
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.logarithmicDepthBuffer = true
renderer.autoClear = true
renderer.render(scene, camera)


orbitControl = new OrbitControls(camera, renderer.domElement)
orbitControl.update()

//Creatte video texture
let video = document.getElementById("video")
video.setAttribute("src", './models/video/bb.mp4')
video.play()



var videoTexture = new THREE.VideoTexture(video)
videoTexture.minFilter = THREE.LinearFilter
videoTexture.magFilter = THREE.LinearFilter

videoTexture.needsUpdate = true


let material = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    vertexShader: `
        varying vec2 vUv;

        void main()	{

            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_Position = projectionMatrix * mvPosition;

        }
    `,
    fragmentShader: `
            
            uniform float time;

            uniform sampler2D map;

            varying vec2 vUv;

            float noise(vec2 coord)
            {
                return fract(sin(dot(coord, vec2(12.9898, 78.233))) * 43758.5453);
            }
            
            void main()
            {
                vec2 uv = vUv;
                
            
                
                vec4 color = texture2D( map, vUv );
				gl_FragColor = vec4( color.r, color.g, color.b, 1.0 );
            }
    `,
    uniforms:
       {
           time: { value: 0 },
           map: { value: videoTexture }
       }
})

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );







animate()

function animate(){
    const elapsedTime = clock.getElapsedTime()
    material.uniforms.time.value = elapsedTime
    material.needsUpdate = true
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
} 

