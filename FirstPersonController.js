import { Object3D } from "three";
import { map_sample } from "./World";

const moveSpeed = .1;
const lookSpeed = .002;

function clamp(x, min, max)
{
    return Math.max(min, Math.min(x, max))
}

export function createFirstPersonController(camera, scene)
{
    const headJoint = new Object3D()
    scene.add(headJoint)
    headJoint.position.copy(camera.position)
    headJoint.add(camera)
    camera.position.set(0,0,0)

    let keys = {}

    function move_in_dir(dx, dz)
    {
        // extra space around colliders
        const buffer = 10;

        if (map_sample(headJoint.position.x + buffer*dx, headJoint.position.z + buffer*dz) != '$')
        {
            headJoint.position.x += dx;
            headJoint.position.z += dz;
        }
    }

    function controllerUpdate()
    {
        if (keys["w"])
        {
            move_in_dir(-moveSpeed * Math.sin(headJoint.rotation.y), -moveSpeed * Math.cos(headJoint.rotation.y))
        }
        if (keys["s"])
        {
            move_in_dir(-moveSpeed * Math.sin(headJoint.rotation.y + Math.PI), -moveSpeed * Math.cos(headJoint.rotation.y + Math.PI))
        }
        if (keys["a"])
        {
            move_in_dir(-moveSpeed * Math.sin(headJoint.rotation.y + Math.PI/2), -moveSpeed * Math.cos(headJoint.rotation.y + Math.PI/2))
        }
        if (keys["d"])
        {
            move_in_dir(-moveSpeed * Math.sin(headJoint.rotation.y - Math.PI/2), -moveSpeed * Math.cos(headJoint.rotation.y - Math.PI/2))
        }


        requestAnimationFrame(controllerUpdate);
    }
    controllerUpdate();

    document.body.addEventListener("keydown", (ev)=>
    { 
        keys[ev.key.toLowerCase()] = 1;
    })

    document.body.addEventListener("keyup", (ev)=>
    {
        keys[ev.key.toLowerCase()] = 0;
    })

    document.body.addEventListener("mousedown", (ev)=>{
        document.body.requestPointerLock();
    })

    document.body.addEventListener("mousemove", (ev)=>
    {
        if (document.pointerLockElement)
        {
            headJoint.rotation.y -= lookSpeed * ev.movementX;
            camera.rotation.x = clamp(camera.rotation.x - lookSpeed * ev.movementY, -Math.PI/2, Math.PI/2);
        }
    })

    return headJoint
}