import { Object3D } from "three";

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

    function controllerUpdate()
    {
        if (keys["w"])
        {
            headJoint.position.z -= moveSpeed * Math.cos(headJoint.rotation.y);
            headJoint.position.x -= moveSpeed * Math.sin(headJoint.rotation.y);
        }
        if (keys["s"])
        {
            headJoint.position.z -= moveSpeed * Math.cos(headJoint.rotation.y + Math.PI);
            headJoint.position.x -= moveSpeed * Math.sin(headJoint.rotation.y + Math.PI);
        }
        if (keys["a"])
        {
            headJoint.position.z -= moveSpeed * Math.cos(headJoint.rotation.y + Math.PI/2);
            headJoint.position.x -= moveSpeed * Math.sin(headJoint.rotation.y + Math.PI/2);
        }
        if (keys["d"])
        {
            headJoint.position.z -= moveSpeed * Math.cos(headJoint.rotation.y - Math.PI/2);
            headJoint.position.x -= moveSpeed * Math.sin(headJoint.rotation.y - Math.PI/2);
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