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
    
  var manager = new THREE.LoadingManager();
  var loader  = new THREE.ImageLoader( manager );

  manager.onProgress = function ( item, loaded, total ) {

	};

  var textureBody = new THREE.Texture();
  var textureHead = new THREE.Texture();

  var onProgress = function ( xhr ) {
					if ( xhr.lengthComputable ) {
						var percentComplete = xhr.loaded / xhr.total * 100;
						console.log( Math.round(percentComplete, 2) + '% downloaded' );
					}
  };

  var onError = function ( xhr ) { };

  loader.load( 'model/Body diff MAP.jpg', function ( image ) {
    textureBody.image = image;
    textureBody.needsUpdate = true;
  });

  loader.load( 'model/HEAD diff MAP.jpg', function ( image ) {
    textureHead.image = image;
    textureHead.needsUpdate = true;
  });

  var meshes = [];
    var objLoader = new THREE.OBJLoader();

    objLoader.load( 'model/bb8.obj', function ( object ) {
  
      console.log(object);
  
      object.traverse( function ( child )
      {
        if ( child instanceof THREE.Mesh )
        {
          meshes.push(child);
        }
      });
  
      var head = meshes[0];
      var body = meshes[1];
  
      head.position.y = -80;
      body.position.y = -80;
  
      head.rotation.y = Math.PI/3;
      body.rotation.y = Math.PI/3;
  
      var mapHeightBody = new THREE.TextureLoader().load( "model/BODY bump MAP.jpg" );
      var mapHeightHead = new THREE.TextureLoader().load( "model/HEAD bump MAP.jpg" );
  
      head.material = new THREE.MeshPhongMaterial({map: textureHead, specular: 0xfceed2, bumpMap: mapHeightHead, bumpScale: 0.4, shininess: 25});
      body.material = new THREE.MeshPhongMaterial({map: textureBody, specular: 0xfceed2, bumpMap: mapHeightBody, bumpScale: 0.4, shininess: 25});
  
      console.log('head', head);
  
      scene.add(head);
      scene.add(body);
  
    }, onProgress, onError );

    /*
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
    */

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
