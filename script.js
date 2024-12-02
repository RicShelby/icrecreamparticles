import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

const gui = new dat.GUI()

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()


const coneGeometry = new THREE.ConeGeometry(0.5, 2, 32) 
const coneMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 })
const cone = new THREE.Mesh(coneGeometry, coneMaterial)
cone.rotation.x = Math.PI
scene.add(cone)

const scoopGeometry = new THREE.SphereGeometry(0.6, 32, 32)
const scoopMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFACD }) 
const scoop = new THREE.Mesh(scoopGeometry, scoopMaterial)
scoop.position.y = 1.1
scene.add(scoop)

let cherry, sprinkles

function addCherry() {
    if (cherry) {
        scene.remove(cherry)
    }

    const cherryGeometry = new THREE.SphereGeometry(0.2, 32, 32)
    const cherryMaterial = new THREE.MeshBasicMaterial({ color: 0xFF0000 })
    cherry = new THREE.Mesh(cherryGeometry, cherryMaterial)
    cherry.position.set(0, 1.9, 0)
    scene.add(cherry)
}

function addSprinkles() {
    if (sprinkles) {
        sprinkles.forEach(sprinkle => {
            scene.remove(sprinkle)
        })
    }

    sprinkles = []
    for (let i = 0; i < 100; i++) {
        const sprinkleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 8)
        const sprinkleMaterial = new THREE.MeshBasicMaterial({ color: getRandomSprinkleColor() })
        const sprinkle = new THREE.Mesh(sprinkleGeometry, sprinkleMaterial)

        const angle = Math.random() * Math.PI * 2
        const radius = 0.7 + Math.random() * 0.3
        sprinkle.position.set(radius * Math.cos(angle), 1.7 + Math.random() * 0.3, radius * Math.sin(angle))

        sprinkle.rotation.z = Math.random() * Math.PI
        sprinkles.push(sprinkle)
        scene.add(sprinkle)
    }
}

function getRandomSprinkleColor() {
    const colors = [0xFF6347, 0xFFD700, 0x00FA9A, 0x8A2BE2, 0xFF69B4]
    return colors[Math.floor(Math.random() * colors.length)]
}

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 5
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const options = {
    creamColor: '#FFFACD',
    addCherry: () => {
        addCherry() 
    },
    addSprinkles: () => {
        addSprinkles() 
    },
    removeToppings: () => {
        if (cherry) {
            scene.remove(cherry)
        }
        if (sprinkles) {
            sprinkles.forEach(sprinkle => scene.remove(sprinkle))
        }
    }
}

gui.addColor(options, 'creamColor').name('Ice Cream Flavor').onChange((color) => {
    scoop.material.color.set(color)
})
gui.add(options, 'addCherry').name('Add Cherry')
gui.add(options, 'addSprinkles').name('Add Sprinkles')
gui.add(options, 'removeToppings').name('Remove Toppings')

const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()
