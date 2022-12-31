import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

/**
 * Base
 */

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

const particlesGeometry = new THREE.BufferGeometry( 0.5, 16, 16)
const count = 5000

const colors = new Float32Array(count * 3)

let object3Particle = new THREE.SphereGeometry( 0.5, 16, 16 );
object3Particle.deleteAttribute( 'normal' );
object3Particle.deleteAttribute( 'uv' );
object3Particle = BufferGeometryUtils.mergeVertices( object3Particle );
const combinedGeometry = BufferGeometryUtils.mergeBufferGeometries( [ object3Particle] );
const positionAttribute = combinedGeometry.getAttribute( 'position' );


particlesGeometry.setAttribute(
    'position',
    positionAttribute
)

particlesGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors , 3)
)

const particlesMaterial = new THREE.PointsMaterial({
    color: 0xfff33d,
    size: 0.01,
    blending: THREE.AdditiveBlending,
})


const particle1 = new THREE.Points(particlesGeometry , particlesMaterial)
const particle2 = new THREE.Points(particlesGeometry , particlesMaterial)
const particle3 = new THREE.Points(particlesGeometry , particlesMaterial)

scene.add(object1, object2, object3)

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster()

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
 * Cursor
 */
const mouse = new THREE.Vector2()

window.addEventListener('mousemove' , (_event) =>{
    mouse.x = _event.clientX / sizes.width * 2 - 1
    mouse.y = -(_event.clientY / sizes.height) * 2 + 1

    // console.log(mouse);
})

window.addEventListener('click' , (_event)=>{
    if(currentIntersect){
        switch(currentIntersect.object){
            case object1:
                if(object1.visible == false){
                    scene.remove(particle1)
                    object1.visible = true
                    break
                }
                console.log('click on object1');
                object1.visible = false
                scene.add(particle1)
                break
            case object2:
                if(object2.visible == false){
                    scene.remove(particle2)
                    object2.visible = true
                    break
                }
                console.log('click on object2');
                object2.visible = false
                scene.add(particle2)
                break
            case object3:
                if(object3.visible == false){
                    scene.remove(particle3)
                    object3.visible = true
                    break
                }
                console.log('click on object3');
                object3.visible = false
                scene.add(particle3)
                break
        }
    }
})


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
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

let  currentIntersect = null

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Animate Objects
    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5 
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5

    // Particles postion
    particle1.position.y = object1.position.y
    particle1.position.x = object1.position.x
    particle2.position.y = object2.position.y
    particle2.position.x = object2.position.x
    particle3.position.y = object3.position.y
    particle3.position.x = object3.position.x


    raycaster.setFromCamera(mouse , camera)


    // Cast a ray
    // const rayOrigin = new THREE.Vector3(-3 , 0 , 0)
    // const rayDirection = new THREE.Vector3(1 , 0 , 0)

    // rayDirection.normalize()


    // raycaster.set(rayOrigin , rayDirection)

    const objectsForTest = [object1 , object2 , object3]
    const intersects = raycaster.intersectObjects(objectsForTest)

    const particlesHover = [particle1 , particle2 , particle3]
    const intersectsForParticle = raycaster.intersectObjects(particlesHover)

    for(const object of objectsForTest){
        object.material.color.set('#ff654f')
       for(const particle of particlesHover){
            particle.material.color.set('red')
       }
    }

    for (const intersect of intersects){
        intersect.object.material.color.set('#0000ff')
        for(const intersectParticles of intersectsForParticle){
            intersectParticles.object.material.color.set('blue')
       }
    }
   
    if(intersects.length){
        if(currentIntersect ===null){
            console.log('mouse enter');
        }
        currentIntersect = intersects[0]
    }
    else{
        if(currentIntersect){
            console.log('mouse leave')
        }

        currentIntersect = null
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()