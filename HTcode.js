"use strict";

// задаём размеры игрового поля
let screenWidth = 1080;
let screenHeight = 720;
let pivotPoints = [[], []];

/* Функция для приблизительного сравнивания чисел с плавающей точкой */
function fequal(a, b) {
    let e = 0.01;
    if (a < b + e && a > b - e) return true;
    else return false;
}

/* Функция для создания холма */
function createHill(scene, radius, x, y, z, color, detail) {
    const verticesOfCube = [
        -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
        -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
    ];
    const indicesOfFaces = [
        2, 1, 0, 0, 3, 2,
        0, 4, 7, 7, 3, 0,
        0, 1, 5, 5, 4, 0,
        1, 2, 6, 6, 5, 1,
        2, 3, 7, 7, 6, 2,
        4, 5, 6, 6, 7, 4,
    ];
    const geometry = new THREE.PolyhedronBufferGeometry(verticesOfCube, indicesOfFaces, radius, detail);
    let material = new THREE.MeshLambertMaterial({ color: color });
    let hill = new THREE.Mesh(geometry, material);
    hill.position.x = x;
    hill.position.y = y;
    hill.position.z = z;
    scene.add(hill);
}

/* Функция для создания и возвращения конуса */
function createCone(scene, radius, height, color, sideNumber) {
    if (height > 40) height = 40;
    let cone_geometry = new THREE.ConeBufferGeometry(radius, height, sideNumber);
    let cone_material = new THREE.MeshLambertMaterial({ color: color });
    let cone = new THREE.Mesh(cone_geometry, cone_material);
    scene.add(cone);
    return cone;
}

/* Функция для создания и возвращения сферы */
function createSphere(scene, radius, color, segments) {
    let sphereGeometry = new THREE.SphereGeometry(radius, segments, segments);
    let sphereMaterial = new THREE.MeshLambertMaterial({ color: color });
    let sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    return sphere;
}

/* Функция для создания и возвращения цилиндра */
function createCylinder(scene, radius, height, color, segments) {
    let cylinderGeometry = new THREE.CylinderGeometry(radius, radius, height, segments);
    let sphereMaterial = new THREE.MeshLambertMaterial({ color: color });
    let cylinderMaterial = new THREE.MeshLambertMaterial({ color: color });
    let cylinder = new THREE.Mesh(cylinderGeometry, sphereMaterial);
    scene.add(cylinder);
    return cylinder;
}

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
    /* Создание визуализатора */
    let renderer = new THREE.WebGLRenderer();
    renderer.setClearColor("#0000FF");
    renderer.setSize(screenWidth, screenHeight);
    document.getElementById("gameBox").append(renderer.domElement);
    
    
    let manager = new THREE.LoadingManager();
    let loader  = new THREE.ImageLoader( manager );

    manager.onProgress = function ( item, loaded, total ) {	};

    let textureBody = new THREE.Texture();
    let textureHead = new THREE.Texture();

    let onProgress = function ( xhr ) {
  	if ( xhr.lengthComputable ) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log( Math.round(percentComplete, 2) + '% downloaded' );
	}
  };

  let onError = function ( xhr ) { };

  loader.load( 'textures/handgun_C.jpg', function ( image ) {
    textureBody.image = image;
    textureBody.needsUpdate = true;
  });

  loader.load( 'textures/handgun_C.jpg', function ( image ) {
    textureHead.image = image;
    textureHead.needsUpdate = true;
  });

  let meshes = [];
  let gltfLoader = new THREE.GLTFLoader();

  gltfLoader.load( 'destroyer/scene.gltf', function ( object ) {
    console.log("Object 'ship' loaded");
    console.log(object);
    scene.add( object.scene );
	object.scale(100,100,100);
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
    let head = meshes[0];
    let body = meshes[0];
  
    //head.position.y = 0;
    //body.position.y = -80;
  
    head.rotation.y = Math.PI/3;
    body.rotation.y = Math.PI/3;
  
    let mapHeightBody = new THREE.TextureLoader().load( "textures/handgun_S.jpg" );
    let mapHeightHead = new THREE.TextureLoader().load( "textures/handgun_S.jpg" );
  
    head.material = new THREE.MeshPhongMaterial({map: textureHead, specular: 0xfceed2, bumpMap: mapHeightHead, bumpScale: 0.4, shininess: 25});
    body.material = new THREE.MeshPhongMaterial({map: textureBody, specular: 0xfceed2, bumpMap: mapHeightBody, bumpScale: 0.4, shininess: 25});
  
    console.log('head', head);
  	//head.scale(new THREE.Vector3(10,10,10));
	head.scale.set(100,100,100);
	body.scale.set(100,100,100);
      scene.add(head);
      //scene.add(body);
  
  }, onProgress, onError );
    
    //pirateShip.scale = new THREE.vector3(0.001,0.001,0.001);
    
    
    let w, a, s, d, bsp, sft;// Определение переменных для кнопок
    bsp = sft = w = a = s = d = false;// Инициализация переменных для кнопок

    /* Создание камеры */
    let camera = new THREE.PerspectiveCamera(100, screenWidth / screenHeight, 0.1, 1000);
    /* Назначение порядка вращения камеры */
    camera.rotation.order = 'YXZ';
    // Начальные координаты камеры
    camera.position.z = 400;
    camera.position.x = 600;
    camera.position.y = 70;
    camera.rotation.y = Math.PI;
    // Создание источника свята рядом с камерой
    let q1 = createLight(scene, "#FFFFFF", 0);
    // Координаты солнца
    q1.position.x = camera.position.x;
    q1.position.y = camera.position.z;
    q1.position.z = camera.position.z;

    // Создание куб (земля)
    //let ground = createCube(scene, 700, 1, 700, "#00AA00");
    // Определение значения позиции куба (земли)
    //ground.position.x = 0;
    //ground.position.y = -0.0;
    //ground.position.z = 0;

    // Создание Солнца
    let sun = createLight(scene, "#FFFFFF", 1);
    // Координаты солнца
    sun.position.x = 100;
    sun.position.y = 250;
    sun.position.z = 0;

    let shipPosition = new THREE.Vector3(500,0,500);
    createCube(scene,20,10,60,"#00FF00",shipPosition.x,shipPosition.y,shipPosition.z,0,0,0,"ship");
    //createCube(scene,6,100,6,"#00FF00",0,0,0,0,0,0);

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


    // Example text options : {'font' : 'helvetiker','weight' : 'normal', 'style' : 'normal','size' : 100,'curveSegments' : 300};

    
    let lastUpdate=Date.now();
    let mult = 2;// Мультипликатор скорости движения камеры
    let sunAngle = 0;
    let incX=0,incZ=0,waveMulti=10,sinMulti=3;
    let iMax=100,jMax=100;
    let polygonSize = 10;
    let fps=0;
    let shipRotation = 0;
    let y1,y2;
    /* Анимация мира */
    setInterval(function () {
        
        let waterGeometry = new THREE.Geometry();
        let speedX=0.1;//Math.random()*0.5;
        let speedZ=speedX;//Math.random()*0.5;
        incX+=speedX;
        incZ+=speedZ;
        let height1=0, lastheight1=Math.sin((incX-1)/sinMulti), height2=0, lastheight2=Math.sin((incZ-1)/sinMulti);
        for(let i=0; i<iMax; i++){
            height2 = Math.sin((i+incZ)/sinMulti);
        for(let j=0; j<jMax; j++){
            height1 = Math.sin((j+incX)/sinMulti);
            if(i*polygonSize==shipPosition.x&&j*polygonSize==shipPosition.z-30){
                //console.log("eq1");
                y1 = lastheight1*lastheight2*waveMulti;
                scene.add(createCube(scene,10,100,10,"#00ff00",i*polygonSize,y1,j*polygonSize,0,0,0));
            }
            if(i*polygonSize==shipPosition.x&&j*polygonSize==shipPosition.z+30){
                //console.log("eq2");
                y2 = lastheight1*lastheight2*waveMulti;
                scene.add(createCube(scene,10,100,10,"#00ff00",i*polygonSize,y2,j*polygonSize,0,0,0));
            }
            waterGeometry.vertices.push(
                new THREE.Vector3(polygonSize*i, lastheight1*lastheight2*waveMulti, polygonSize*j),
                new THREE.Vector3(polygonSize*i, height1*lastheight2*waveMulti, polygonSize*(j+1)),
                new THREE.Vector3(polygonSize*(i+1), height1*height2*waveMulti, polygonSize*(j+1)),

                new THREE.Vector3(polygonSize*i, lastheight1*lastheight2*waveMulti, polygonSize*j),
                new THREE.Vector3(polygonSize*(i+1), lastheight1*height2*waveMulti, polygonSize*j),
                new THREE.Vector3(polygonSize*(i+1), height1*height2*waveMulti, polygonSize*(j+1))
            );
            waterGeometry.faces.push(
                new THREE.Face3((i*iMax+j)*6+0, (i*iMax+j)*6+1, (i*iMax+j)*6+2),
                new THREE.Face3((i*iMax+j)*6+3, (i*iMax+j)*6+5, (i*iMax+j)*6+4)
            );
            lastheight1 = height1;
        }
            lastheight2 = height2;
            lastheight1 = Math.sin((incX-1)/sinMulti);
        }
        let now = Date.now();
        let dt = now - lastUpdate;
        lastUpdate = now;


        

        //console.log(dt);
        //let texture = new THREE.CanvasTexture( createImage() );
        let waterMaterial = new THREE.MeshLambertMaterial( { color: 0x0000dd } );
        let waterSurface = new THREE.Mesh( waterGeometry, waterMaterial );
        waterSurface.name = "waterSurface";
        waterGeometry.computeFaceNormals();
        //scene.add( waterSurface );

        //new THREE.Face3((i*iMax+j)*6+0, (i*iMax+j)*6+1, (i*iMax+j)*6+2),
        //let pos1 = scene.getObjectByName("waterSurface").geometry.vertices[(shipPosition.z-1)/polygonSize*600+shipPosition.x/polygonSize*60];
        //let pos2 = scene.getObjectByName("waterSurface").geometry.vertices[(shipPosition.z+1)/polygonSize*600+shipPosition.x/polygonSize*60];
        //scene.add(createCube(scene,10,100,10,"#00ff00",pos1.x,pos1.y,pos1.z,0,0,0));
        //scene.add(createCube(scene,10,100,10,"#00ff00",pos2.x,pos2.y,pos2.z,0,0,0));
        //let y1 = scene.getObjectByName("waterSurface").geometry.vertices[(shipPosition.z-10)/polygonSize+shipPosition.x/polygonSize*6].y;
        //let y2 = scene.getObjectByName("waterSurface").geometry.vertices[(shipPosition.z+10)/polygonSize+shipPosition.x/polygonSize*6].y;

        shipRotation = Math.asin(((y1-y2)/20)%Math.PI);

        //console.log((60/(y1-y2)));
        //console.log(Math.asin(60/(y1-y2)));
        //console.log(y1+" "+y2+" "+shipRotation);

        scene.getObjectByName("ship").position.y=(y1+y2)/2;
        scene.getObjectByName("ship").rotation.x=shipRotation;

        camera.rotation.x += Math.PI / 10000 * Math.pow((screenHeight / 2 - mouseY) / 120, 5);// вращение камеры с помощью мыши относительно внутренней оси X
        camera.rotation.y += Math.PI / 10000 * Math.pow((screenWidth / 2 - mouseX) / 120 / screenWidth * screenHeight, 5);// вращение камеры с помощью мыши относительно внутренней оси Y
        if(camera.rotation.x > Math.PI/2)camera.rotation.x = Math.PI/2;
        if(camera.rotation.x < -Math.PI/2)camera.rotation.x = -Math.PI/2;
        renderer.render(scene, camera);

        //scene.remove( waterSurface );
        //scene.remove( pos1 );
        //scene.remove( pos2 );
        // clean up
        waterGeometry.dispose();
        waterMaterial.dispose();
        //texture.dispose();

        /* Источник света рядом с камерой */
        q1.position.x = camera.position.x;
        q1.position.y = camera.position.y;
        q1.position.z = camera.position.z;

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

        /*
        sunAngle += 0.001;
        sun.position.x = 200 * Math.sin(sunAngle);
        sun.position.y = 200 * Math.cos(sunAngle);
        if (sun.position.y <= 0) {
            sunAngle += 0.01;
            sun.position.x = 200 * Math.sin(sunAngle);
            sun.position.y = 200 * Math.cos(sunAngle);
        }*/
    }, 30);
}
