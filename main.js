import * as THREE from 'three';
import * as FirstPersonController from './FirstPersonController'
import * as World from './World'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
document.body.style.overflow = "hidden"

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

const player = FirstPersonController.createFirstPersonController(camera, scene);
World.generate(player, scene);