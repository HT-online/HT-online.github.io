"use strict";

// задаём размеры игрового поля
let screenWidth = 1080;
let screenHeight = 720;
/* Функция для создания и возвращения куба */
function createCube(scene, width, height, length, color, x, y, z, rotationY, rotationX, rotationZ, name) {
    let cubeGeometry = new THREE.CubeGeometry(width, height, length);
    let cubeMaterial = new THREE.MeshLambertMaterial({ color: color });
    let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    if (x !== undefined) {
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
    }
    if (rotationY !== undefined) cube.rotation.y = rotationY;
    if (rotationX !== undefined) cube.rotation.x = rotationX;
    if (rotationZ !== undefined) cube.rotation.z = rotationZ;
    cube.name = name;
    scene.add(cube);
    return cube;
}
/* Функция для создания и возвращения точечного источника света */
function createLight(scene, color, force) {
    let pointLight = new THREE.PointLight(color, force);
    scene.add(pointLight);
    return pointLight;
}
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

  loader.load( 'textures/handgun_C.jpg', function ( image ) {
    textureBody.image = image;
    textureBody.needsUpdate = true;
  });

  loader.load( 'textures/handgun_C.jpg', function ( image ) {
    textureHead.image = image;
    textureHead.needsUpdate = true;
  });

  var meshes = [];
    var gltfLoader = new THREE.GLTFLoader();

    gltfLoader.load( 'destroyer/scene.gltf', function ( object ) {
  
      console.log(object);
      scene.add( object.scene );
/*
      object.animations; // Array<THREE.AnimationClip>
      object.scene; // THREE.Scene
      object.scenes; // Array<THREE.Scene>
      object.cameras; // Array<THREE.Camera>
      object.asset; // Object*/
			/*
      object.traverse( function ( child )
      {
        if ( child instanceof THREE.Mesh )
        {
          meshes.push(child);
        }
      });
  		*/
      var head = meshes[0];
      var body = meshes[0];
  
      //head.position.y = 0;
      //body.position.y = -80;
  
      head.rotation.y = Math.PI/3;
      body.rotation.y = Math.PI/3;
  
      var mapHeightBody = new THREE.TextureLoader().load( "textures/handgun_S.jpg" );
      var mapHeightHead = new THREE.TextureLoader().load( "textures/handgun_S.jpg" );
  
      head.material = new THREE.MeshPhongMaterial({map: textureHead, specular: 0xfceed2, bumpMap: mapHeightHead, bumpScale: 0.4, shininess: 25});
      body.material = new THREE.MeshPhongMaterial({map: textureBody, specular: 0xfceed2, bumpMap: mapHeightBody, bumpScale: 0.4, shininess: 25});
  
      console.log('head', head);
  	//head.scale(new THREE.Vector3(10,10,10));
	head.scale.set(100,100,100);
	body.scale.set(100,100,100);
      scene.add(head);
      //scene.add(body);
  
    }, onProgress, onError );

    // Создание куб (земля)
    //let ground = createCube(scene, 700, 1, 700, "#00AA00");
    let ground = createCube(scene, 7, 1, 7, "#00AA00");
    // Определение значения позиции куба (земли)
    ground.position.x = -10;
    ground.position.y = -10;
    ground.position.z = 0;

	
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
    camera.position.z = 100;
    camera.position.x = 100;
    camera.position.y = 70;
    camera.lookAt(0,0,0);
    let q1 = createLight(scene, "#FFFFFF", 1);
    // Координаты солнца
    q1.position.x = camera.position.x;
    q1.position.y = camera.position.z;
    q1.position.z = camera.position.z;
    //camera.rotation.y = Math.PI;
	
    // Создание Солнца
    let sun = createLight(scene, "#FFFFFF", 1);
    // Координаты солнца
    sun.position.x = 100;
    sun.position.y = 250;
    sun.position.z = 0;

    let w, a, s, d, bsp, sft;// Определение переменных для кнопок
    bsp = sft = w = a = s = d = false;// Инициализация переменных для кнопок
    /* Функции для опряделения нажатых кнопок */
    window.onkeydown = function (event) {
        switch (event.keyCode) {
            case 87: { w = true; break; }
            case 65: { a = true; break; }
            case 83: { s = true; break; }
            case 68: { d = true; break; }
            case 32: { bsp = true; break; }
            case 16: { sft = true; break; }
        }
    }
    window.onkeyup = function (event) {
        switch (event.keyCode) {
            case 87: { w = false; break; }
            case 65: { a = false; break; }
            case 83: { s = false; break; }
            case 68: { d = false; break; }
            case 32: { bsp = false; break; }
            case 16: { sft = false; break; }
        }
    }

    const rect = gameBox.getBoundingClientRect();// Рамка canvas
    let mouseX = screenWidth / 2, mouseY = screenHeight / 2;// Начальные координаты курсора
    /* Переназначение координат мыши относительно canvas при движении мыши */
    gameBox.addEventListener('mousemove', e => {
        mouseX = Math.min(e.clientX - rect.left, screenWidth);
        mouseY = Math.min(e.clientY - rect.top, screenHeight);
    });
    let mult = 2;// Мультипликатор скорости движения камеры
	
    setInterval(function(){
	    
        /* Источник света рядом с камерой */
        q1.position.x = camera.position.x;
        q1.position.y = camera.position.y;
        q1.position.z = camera.position.z;

	camera.rotation.x += Math.PI / 10000 * Math.pow((screenHeight / 2 - mouseY) / 120, 5);// вращение камеры с помощью мыши относительно внутренней оси X
        camera.rotation.y += Math.PI / 10000 * Math.pow((screenWidth / 2 - mouseX) / 120 / screenWidth * screenHeight, 5);// вращение камеры с помощью мыши относительно внутренней оси Y
        if(camera.rotation.x > Math.PI/2)camera.rotation.x = Math.PI/2;
        if(camera.rotation.x < -Math.PI/2)camera.rotation.x = -Math.PI/2;
	renderer.render(scene, camera);
        /* Движение камеры учитывая вращение камеры относительно внутренней оси Y */
        if (w) {
            camera.position.x -= 1 * mult * Math.sin(camera.rotation.y);
            camera.position.z -= 1 * mult * Math.cos(camera.rotation.y);
        }
        if (a) {
            camera.position.x -= 1 * mult * Math.cos(camera.rotation.y);
            camera.position.z += 1 * mult * Math.sin(camera.rotation.y);
        }
        if (s) {
            camera.position.x += 1 * mult * Math.sin(camera.rotation.y);
            camera.position.z += 1 * mult * Math.cos(camera.rotation.y);
        }
        if (d) {
            camera.position.x += 1 * mult * Math.cos(camera.rotation.y);
            camera.position.z -= 1 * mult * Math.sin(camera.rotation.y);
        }
        /* Движение камеры вверх/вниз НЕ учитывая вращение камеры относительно внутренней оси Y*/
        if (bsp) camera.position.y += 1 * mult;
        if (sft) camera.position.y -= 1 * mult;
    },30);
}
