import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import gsap from 'gsap'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const parameters = {
    myString:"HOLA PETE"
}


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Axis Helper
 */
// const AxesHelper = new THREE.AxesHelper()
// scene.add(AxesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/2.png')


/**
 * Fonts
 */
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            parameters.myString,
            {
                font:font,
                size:0.5,
                height:0.2,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        textGeometry.center()

        const textMaterial = new THREE.MeshMatcapMaterial()
        textMaterial.matcap = matcapTexture
        const text = new THREE.Mesh(textGeometry, textMaterial)
        text.name = "textGeometryObject"
        scene.add(text)

    }
)

gui.add( parameters, 'myString' );
gui.onFinishChange(()=>{
    let selectedObject = scene.getObjectByName("textGeometryObject");
    scene.remove(selectedObject)
    fontLoader.load(
        '/fonts/helvetiker_regular.typeface.json',
        (font) => {
            const textGeometry = new TextGeometry(
                parameters.myString,
                {
                    font:font,
                    size:0.5,
                    height:0.2,
                    curveSegments: 12,
                    bevelEnabled: true,
                    bevelThickness: 0.03,
                    bevelSize: 0.02,
                    bevelOffset: 0,
                    bevelSegments: 5
                }
            )
            textGeometry.center()
    
            const textMaterial = new THREE.MeshMatcapMaterial()
            textMaterial.matcap = matcapTexture
            const text = new THREE.Mesh(textGeometry, textMaterial)
            text.name = "textGeometryObject"
            scene.add(text)
    
        }
    )
})

/**
 * Objects
 */

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const donutMaterial = new THREE.MeshMatcapMaterial()
donutMaterial.matcap = matcapTexture

const donutList = []

for (let i = 0; i < 100; i++)
{
    
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)

    donut.position.x = (Math.random() - 0.5) * 5
    donut.position.y = (Math.random() - 0.5) * 5
    donut.position.z = (Math.random() - 0.5) * 5

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI 

    const scale = Math.random() * (0.4 - 0.2) + 0.2
    donut.scale.set(scale, scale, scale)

    donutList.push(donut)

    scene.add(donut)
}

console.log(donutList)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

//Update Objects
// donutList.forEach(()=>{gsap.to(.rotation,{duration:10, x:"+=1"})})

for ( const mesh of donutList ) {

    gsap.to(mesh.rotation,{duration:4, x:"random(-1, 1)", y:"random(-10, 10)", yoyo:true, repeat:-1, ease:'power4.inOut'})

}

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()