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
//renderer.physicallyCorrectLights = true
//renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMapping = THREE.sRGBEncoding
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

    model_lvl7.traverse( function( node ) {
        if (node.material) {
            node.material.map.encoding = THREE.LinearEncoding
            scene.add(model_lvl7)
            
        }
    })

    const folder = gui.addFolder("camera")
    folder.add(model_lvl1.position,'x').min(-3).max(3).step(0.01).name('position X')
    folder.add(model_lvl1.position,'y').min(-3).max(3).step(0.01).name('position Y')
    folder.add(model_lvl1.position,'z').min(-3).max(3).step(0.01).name('position Z')

    model_lvl1.position.set(0.232,0,0)
    model_lvl1.scale.set(0.968,1,1)


    gltf.scene.scale.set(1,1,1)
    screen_mesh = model_lvl2
    root.add(screen_mesh)

    
    let innerRoot = new THREE.Group()
    innerRoot.add(model_lvl3)

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
    //scene.add(model_lvl7)
   
    
})


 
// document.addEventListener('mousedown',() => {
//     changeMaterial(urls)
// });

const light = new THREE.AmbientLight( 0x404040 );
light.intensity = 5
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

