import * as THREE from 'three';
import * as FirstPersonController from './FirstPersonController'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.body.style.overflow = "hidden"

let cubes = []
let positions = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -2, 5),
    new THREE.Vector3(0, 2, 5),
]
let colors = [
    0x00ff00,
    0xff00ff,
    0x0000ff,
]

for (let i=0; i<positions.length; i++)
{
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: colors[i] } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
    cube.position.copy(positions[i]);
    cubes.push(cube);
}

camera.position.z = 5;

function animate() {

	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

window.addEventListener("resize", (ev)=>{
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

FirstPersonController.createFirstPersonController(camera, scene)