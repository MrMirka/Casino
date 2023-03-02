import * as THREE from './lib/three/build/three.module.js'
import { OrbitControls } from './lib/three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from './lib/three/examples/jsm/loaders/GLTFLoader.js'
import { RGBELoader } from './lib/three/examples/jsm/loaders/RGBELoader.js'
import * as dat from './lib/dat.gui.module.js'

 let scene,
    camera,
    renderer,
    orbitControl

let clock = new THREE.Clock()

let degree = 0

var gui = new dat.GUI()

var root = new THREE.Group()


var screen_mesh

const gltfLoader = new GLTFLoader()
const rgbloader = new RGBELoader()

const canvas = document.querySelector('canvas.webgl')

scene  = new THREE.Scene()

//camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100 )
camera = new THREE.OrthographicCamera( window.innerWidth / - 470, window.innerWidth / 470, window.innerHeight / 470, window.innerHeight / - 470, 1, 1000 );

camera.position.z = 100


/* 
const folder = gui.addFolder("camera")
folder.add(camera.position,'x').min(-3000).max(3000).step(0.01).name('position X')
folder.add(camera.position,'y').min(-3000).max(3000).step(0.01).name('position Y')
folder.add(camera.position,'z').min(-3000).max(3000).step(0.01).name('position Z') */



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


//orbitControl = new OrbitControls(camera, renderer.domElement)
//orbitControl.update()
 




gltfLoader.load('./models/disk.gltf', gltf => {
    //let model_box = gltf.scene.children[0]
    let model_lvl1 = gltf.scene.children[0]
    let model_lvl2 = gltf.scene.children[1]
    let model_lvl3 = gltf.scene.children[2]




    gltf.scene.scale.set(1,1,1)
    screen_mesh = model_lvl2
    root.add(screen_mesh)

    const folder = gui.addFolder("camera")
    folder.add(root.rotation,'y').min(0).max(3).step(0.01).name('position X')

    root.rotation.y = 0.26
    scene.add(root)
    scene.add(model_lvl1)
    scene.add(model_lvl3)
   
    
})

rgbloader.load('./models/texture/env/env.pic', texture => {
    texture.encoding = THREE.sRGBEncoding
    texture.mapping = THREE.EquirectangularRefractionMapping
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapP = THREE.RepeatWrapping
    texture.repeat.set( 1, 1 )
    scene.environment = texture
  
    
 })
 

 const pointLight = new THREE.PointLight( 0xffffff, 16, 100 )
 pointLight.position.set( 1, 1, 1 )
 pointLight.castShadow = true
 pointLight.shadow.normalBias = 0.05
 scene.add( pointLight )
 
 const sphereSize = 0.2
 const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
 scene.add( pointLightHelper )

// document.addEventListener('mousedown',() => {
//     changeMaterial(urls)
// });


animate()

function animate(){
    const elapsedTime = clock.getElapsedTime()
   // orbitControl.update()

    degree += 0.02

   if(screen_mesh != undefined) {
    screen_mesh.rotation.y += 0.02
   // screen_mesh.rotation.set(screen_mesh.rotation.y, degree, screen_mesh.rotation.z)
   }
    
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
} 

