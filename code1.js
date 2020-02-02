"use strict";

// задаём размеры игрового поля
let screenWidth = 1080;
let screenHeight = 720;

window.onload = function () {
    /* Создание сцены */
    let scene = new THREE.Scene();
    /* Создание камеры */
    
    /* Создание визуализатора */
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor("#0000FF");
    renderer.setSize(screenWidth, screenHeight);
    document.getElementById("gameBox").append(renderer.domElement);
/*
    let loader = new THREE.GLTFLoader();
    loader.load( 'scene.gltf', function ( gltf ) {
        scene.add( gltf.scene );
    }, undefined, function ( error ) {
        console.error( error );
    } );*/
    /*
    let manager = new THREE.LoadingManager();
    let loader = new THREE.ImageLoader(manager); 
    let TextureBody = new THREE.Texture();
    
    loader.load('boat.obj', function(image){
        TextureBody.image = image;
        TextureBody.needUpdate = true;
    });*/

    /*
    var objLoader = new THREE.OBJLoader();
    objLoader.load('boat.obj',function(object){
        console.log(object);
    });*/


    let manager = new THREE.LoadingManager();
    let loader = new THREE.ImageLoader(manager); 
    let TextureBody = new THREE.Texture();
    let meshes = [];
    let objLoader = new THREE.OBJLoader();
    objLoader.load('Boat.obj',function(object){
        console.log(object);
        object.traverse(function(child){
            if(child instanceof THREE.Mesh)
                meshes.push(child);
        });
    });
    let pirateShip = meshes[0];
    scene.add(pirateShip);
    pirateShip.scale(0.001,0.001,0.001);

    let camera = new THREE.PerspectiveCamera(100, screenWidth / screenHeight, 0.1, 1000);
    /* Назначение порядка вращения камеры */
    camera.rotation.order = 'YXZ';
    // Начальные координаты камеры
    camera.position.z = 400;
    camera.position.x = 600;
    camera.position.y = 70;
    camera.lookAt(0,0,0);
    let q1 = createLight(scene, "#FFFFFF", 1);
    // Координаты солнца
    q1.position.x = camera.position.x;
    q1.position.y = camera.position.z;
    q1.position.z = camera.position.z;
    //camera.rotation.y = Math.PI;


    renderer.render(scene, camera);
}