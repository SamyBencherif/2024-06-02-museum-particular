import * as THREE from 'three';

const WIREFRAME = false;

const map = `
                                     $$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$$$$$$$$$$$$$
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $         P         $$$$$                   $$$$$                   $
                                     $                                   L                       L       $
                                     $                                                                   $
                                     $                                                                   $
                                     $                   $$$$$                   $$$$$                   $
                                     $                   $   $                   $   $                   $
                                     $           L       $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $$$$$$$$$   $$$$$$$$$   $$$$$   $$$$$   $$$$$   $$$$$$$$   $$$$$$$$$$
                                             $   $               $   $   $   $              $   $
                                             $   $               $   $   $   $              $   $
                                             $L  $               $L  $   $L  $              $L  $
             $$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$   $$$$$$$$$   $$$$$   $$$$$   $$$$$   $$$$$$$$   $$$$$$$$$$   $$$$$$$$$$$$$$$$$$$$$
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $$$$$                   $$$$$                   $$$$$                   $$$$$                   $
             $           L                       L                       L                       L                       L       $
             $                                                                                                                   $
             $                                                                                                                   $
             $                   $$$$$                   $$$$$                   $$$$$                   $$$$$                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $                   $   $                   $   $                   $   $                   $   $                   $
             $$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$   $$$$$$$$$   $$$$   $$$$$$   $$$$$   $$$$$$$$$   $$$$$$$$$   $$$$$$$$$$$$$$$$$$$$$
                                             $   $              $   $    $   $               $   $
                                             $   $              $   $    $   $               $   $
                                             $L  $              $L  $    $L  $               $L  $
                                     $$$$$$$$$   $$$$$$$$$   $$$$   $$$$$$   $$$$$   $$$$$$$$$   $$$$$$$$$
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $$$$$                   $$$$$                   $
                                     $           L                       L                       L       $
                                     $                                                                   $
                                     $                                                                   $
                                     $                   $$$$$                   $$$$$                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $                   $   $                   $   $                   $
                                     $$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$$$$$$$$$$$$$   $$$$$$$$$$$$$$$$$$$$$
                                                             
                                     
`

function box(scene, position, scale, color)
{
    const geometry = new THREE.BoxGeometry( scale.x, scale.y, scale.z );
    const material = new THREE.MeshStandardMaterial( { color } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.copy(position);
    scene.add( cube );

    const ep = 0;
    const geometry2 = new THREE.WireframeGeometry(new THREE.BoxGeometry( scale.x+ep, scale.y+ep, scale.z+ep ))
    const material2 = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    const line = new THREE.LineSegments( geometry2, material2);
    line.position.copy(position);
    if (WIREFRAME) scene.add( line );
}

export function map_sample(tx, tz)
{
    tx = Math.round(tx);
    tz = Math.round(tz);

    let x = 0;
    let z = 0;
    for (let i in map)
    {
        const c = map[i]

        if (c != ' ' && c != '\n' && c != '\t')
        {
            if (x == tx && z == tz)
                return c;
        }

        x++;

        if (c == "\n")
        {
            x = 0;
            z ++;
        }
    }

    // otherwise return undefined
}

export function generate(player, scene)
{
    let x = 0
    let z = 0

    // floor
    box(
        scene,
        new THREE.Vector3(x, -3, z),
        new THREE.Vector3(1000, 1, 1000),
        0xffffff
    )

    // ceiling
    box(
        scene,
        new THREE.Vector3(x, 3, z),
        new THREE.Vector3(1000, 1, 1000),
        0xffffff
    )

    for (let i in map)
    {
        const c = map[i]

        if (c != ' ' && c != '\n' && c != '\t')
        {
            if (c == '$')
            {
                // wall
                box(
                    scene,
                    new THREE.Vector3(x, 0, z),
                    new THREE.Vector3(1, 5, 1),
                    0xffffff
                )
            }

            if (c == 'P')
            {
                player.position.set(x, player.position.y, z);
                player.rotation.y = Math.PI;
            }

            if (c == 'L')
            {
                const light = new THREE.PointLight( 0xffffff, 1, 100 ); // soft white light
                light.position.set(x, 0, z);
                scene.add( light );
            }

        }

        x++;

        if (c == "\n")
        {
            x = 0;
            z ++;
        }
    }

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    directionalLight.position.set(-1,2,3)
    scene.add( directionalLight );

    const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
}