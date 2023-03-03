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

const frustumSize = 2.9


var screen_mesh

const gltfLoader = new GLTFLoader()
const rgbloader = new RGBELoader()

const canvas = document.querySelector('canvas.webgl')

scene  = new THREE.Scene()

//camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 100 )
/* camera = new THREE.OrthographicCamera( 
                                        window.innerWidth / - camera_resolution, 
                                        window.innerWidth / camera_resolution,
                                        window.innerHeight / camera_resolution,
                                        window.innerHeight / - camera_resolution,
                                        1, 1000 ); */

const aspect = window.innerWidth / window.innerHeight
camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 )                                 
camera.position.z = 3
camera.position.x = 0
camera.position.y = 0.035


/* 
const folder = gui.addFolder("camera")
folder.add(camera.position,'x').min(-3000).max(3000).step(0.01).name('position X')
folder.add(camera.position,'y').min(-3000).max(3000).step(0.01).name('position Y')
folder.add(camera.position,'z').min(-3000).max(3000).step(0.01).name('position Z') */



scene.add(camera)

renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha:true } )
renderer.setPixelRatio( window.devicePixelRatio )
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.logarithmicDepthBuffer = true
renderer.autoClear = true
renderer.toneMappingExposure = 1.2
renderer.render(scene, camera)


//orbitControl = new OrbitControls(camera, renderer.domElement)
//orbitControl.update()
 




gltfLoader.load('./models/disk.gltf', gltf => {
    //let model_box = gltf.scene.children[0]
    let model_lvl1 = gltf.scene.children[0]
    let model_lvl2 = gltf.scene.children[1]
    let model_lvl3 = gltf.scene.children[2]
    let model_lvl4 = gltf.scene.children[3]
    let model_lvl5 = gltf.scene.children[4]
    let model_lvl6 = gltf.scene.children[5]
    let model_lvl7 = gltf.scene.children[6]


    gltf.scene.scale.set(1,1,1)
    screen_mesh = model_lvl2
    root.add(screen_mesh)

    
    let innerRoot = new THREE.Group()
    innerRoot.add(model_lvl3)

   /*  const folder = gui.addFolder("inner")
    folder.add(model_lvl7.position,'x').min(-3).max(3).step(0.01).name('rotation x')
    folder.add(model_lvl7.position,'y').min(-3).max(3).step(0.01).name('rotation y')
    folder.add(model_lvl7.position,'z').min(-3).max(3).step(0.01).name('rotation z')

    folder.add(model_lvl7.scale,'x').min(-3).max(3).step(0.01).name('scale x')
    folder.add(model_lvl7.scale,'y').min(-3).max(3).step(0.01).name('scale y')
    folder.add(model_lvl7.scale,'z').min(-3).max(3).step(0.01).name('scale z') */

    model_lvl7.position.set(0.8, -0.52, 0.47)
    model_lvl7.scale.set(0.9, 1, 0.9)
   

    model_lvl4.position.set(0.258,0,0.12)
    model_lvl4.rotation.set(1.6,0,-0.19)
    model_lvl4.scale.set(0.86,1,0.89)

    model_lvl2.scale.set(0.85,1,0.85)

    model_lvl6.rotation.z = -0.26

  
    root.rotation.y = 0.34
    root.position.x = -0.021

    scene.add(root)
    scene.add(model_lvl1)
    scene.add(innerRoot)
    scene.add(model_lvl4)
    scene.add(model_lvl5)
    scene.add(model_lvl6)
    scene.add(model_lvl7)
   
    
})

rgbloader.load('./models/texture/env/env.pic', texture => {
    texture.encoding = THREE.sRGBEncoding
    texture.mapping = THREE.EquirectangularRefractionMapping
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapP = THREE.RepeatWrapping
    texture.repeat.set( 1, 1 )
    //scene.environment = texture
 })
 

 const pointLight = new THREE.PointLight( 0xffffff, 16, 100 )
 pointLight.position.set( 1, 1, 1 )
 pointLight.castShadow = true
 pointLight.shadow.normalBias = 0.05
 //scene.add( pointLight )
 
 const sphereSize = 0.2
 const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
 //scene.add( pointLightHelper )

// document.addEventListener('mousedown',() => {
//     changeMaterial(urls)
// });

const light = new THREE.AmbientLight( 0x404040 );
light.intensity = 20
scene.add( light );


animate()

function animate(){
    const elapsedTime = clock.getElapsedTime()
   // orbitControl.update()

    degree += 0.02

   if(screen_mesh != undefined) {
    screen_mesh.rotation.y += 0.02
   }
    
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
} 

