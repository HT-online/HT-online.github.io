"use strict";

// задаём размеры игрового поля
let screenWidth = 1080;
let screenHeight = 720;
let fogColor = 'lightblue';
let destroyerHP = 1;
let enemyHP = 3;
let end = true, endStart = false;
let endCount = 0;
let clear = false;

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

function spawnEnemy(enemyShipPosition, shipPosition, halfField) {
  enemyShipPosition.set(shipPosition.x,0,shipPosition.z);
  let x,z;
  x = Math.random();
  z = Math.random();
  if(x>0.5)enemyShipPosition.x += halfField;
  if(z>0.5)enemyShipPosition.z += halfField;
}
class cannonBall{
  constructor(player, scene, x, y, z, radius, angle) {
    this.player = player;
    this.ball = createSphere(scene, radius, "#333333", 6);
    this.ball.position.x=x;
    this.ball.position.y=y;
    this.ball.position.z=z;
    this.angle = angle;
  }
}
let cannonBalls = [];

function cannonShoot(player,scene,ship,x,y,z,shipAngle) {
  if(player)
    cannonBalls.push(new cannonBall(player,scene,ship.position.x+x,ship.position.y+y,ship.position.z+z, 3, shipAngle));
  else
    cannonBalls.push(new cannonBall(player,scene,ship.position.x+x,ship.position.y+y,ship.position.z+z, 5, shipAngle));
}

window.onload = function () {

    let iw = window.innerWidth;
    let ih = window.innerHeight;
    //iw = screenWidth;
    //ih = screenHeight;
    let destroyerIsLoaded = false;
    /* Создание сцены */
    let scene = new THREE.Scene();
    /* Создание визуализатора */
    let renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(fogColor);
    renderer.setSize(iw*0.8, ih*0.8);
    //renderer.setSize(screenWidth, screenHeight);
    document.getElementById("gameBox").append(renderer.domElement);

    let manager = new THREE.LoadingManager();
    let loader  = new THREE.ImageLoader( manager );

    manager.onProgress = function ( item, loaded, total ) {	};


    let textureBody = new THREE.Texture();
    let textureHead = new THREE.Texture();

    let onProgress = function ( xhr ) {
  		if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
				//console.log( Math.round(percentComplete, 2) + '% downloaded' );
			}
  	};

  let onError = function ( xhr ) { };

  //let Galleon = new THREE.Group();
  //create_geometry_0(Galleon);
  /*
  create_geometry_1(Galleon);
  create_geometry_2(Galleon);
  create_geometry_3(Galleon);
  create_geometry_4(Galleon);
  create_geometry_5(Galleon);
  create_geometry_6(Galleon);
  create_geometry_7(Galleon);
  create_geometry_8(Galleon);
  create_geometry_9(Galleon);
  create_geometry_10(Galleon);
  create_geometry_11(Galleon);
  create_geometry_12(Galleon);
  create_geometry_13(Galleon);
  create_geometry_14(Galleon);
  create_geometry_15(Galleon);
  create_geometry_16(Galleon);
  create_geometry_17(Galleon);
  create_geometry_18(Galleon);
  create_geometry_19(Galleon);
  create_geometry_20(Galleon);  
  create_geometry_21(Galleon);*/
  //scene.add(Galleon);

  //Galleon.scale.set(0.0001,0.0001,0.0001);
/*
  loader.load( 'galeon/ship_Galleon.jpg', function ( image ) {
    galeonTexture.image = image;
    galeonTexture.needsUpdate = true;
  });

  loader.load( 'textures/handgun_C.jpg', function ( image ) {
    textureHead.image = image;
    textureHead.needsUpdate = true;
  });*/
/*
  let objLoader = new THREE.OBJLoader();
  objLoader.load('medieval_boat/Medieval Boat.obj',function( object ){
    object.scale.set(0.01,0.01,0.01);
    let texture = THREE.TextureLoader('medieval_boat/Wood 1.jpg');
    //let material = new THREE.MeshLambertMaterial( { map: texture } );
    let material = new THREE.MeshLambertMaterial( { color: "#FF0000" } );
    //object.material.map = material;
    scene.add(object);
  },null,null);
*/

  
  let enemyShip = new THREE.Object3D();
  enemyShip.rotation.order = 'YXZ';
  scene.add( enemyShip );

  let fbxLoader = new THREE.FBXLoader();
  fbxLoader.load( 'oss/source/Old_Style_Ship.fbx', function ( object ) {
    object.position.set(0, 10, 6);
    object.traverse( function ( child ) {
      if ( child.isMesh ) {
        child.material.normalMap = THREE.ImageUtils.loadTexture('oss/textures/boat_Albedo.png');
        child.castShadow = true;
        child.receiveShadow = false;
        child.flatshading = true;
      }
    } );
    enemyShip.add(object);
    enemyShip.scale.set(0.05,0.05,0.05);  
  } );

  /*
  let mtfLoader = new THREE.MTLLoader();
  mtfLoader.load('medieval_boat/Medieval Boat.mtl', function (materials) {
      materials.preload();
      new THREE.OBJLoader().setMaterials(materials).load(OBJFile, function (object) {
              object.position.y = - 95;
              var texture = new THREE.TextureLoader().load(JPGFile);
  
              object.traverse(function (child) {   // aka setTexture
                  if (child instanceof THREE.Mesh) {
                      child.material.map = texture;
                  }
              });
              scene.add(object);
          });
  });*/


  let helpMaterial1 = new THREE.MeshLambertMaterial({color: "#ff0000"});
  let helpMaterial2 = new THREE.MeshLambertMaterial({color: "#ff0000"});
  helpMaterial1.transparent = true;
  helpMaterial1.opacity = 0;
  helpMaterial2.transparent = true;
  helpMaterial2.opacity = 0;
  let helpGeometry = new  THREE.CubeGeometry(100,10,60);
  let helpCube1 = new THREE.Mesh(helpGeometry, helpMaterial1);
  helpCube1.position.set(80,0,-1.5);
  let helpCube2 = new THREE.Mesh(helpGeometry, helpMaterial2);
  helpCube2.position.set(-80,0,-1.5);



  let meshes = [];
  let destroyer = new THREE.Object3D();

  destroyer.rotation.order = 'YXZ';
  scene.add( destroyer );
  let gltfLoader = new THREE.GLTFLoader();

  gltfLoader.load( 'destroyer/scene.gltf', function ( object ) {
    object.scene.position.set(0,40,10);
    destroyer.add( object.scene );
    destroyer.add( helpCube1 );
    destroyer.add( helpCube2 );
    object.scene.scale.set(80,80,80);
    destroyerIsLoaded = true;
  }, onProgress, onError );
    
    
    let btn_w, btn_a, btn_s, btn_d, btn_bsp, btn_sft, btn_mouse, btn_q, btn_e;// Определение переменных для кнопок
    btn_bsp = btn_sft = btn_w = btn_a = btn_s = btn_d = btn_mouse = btn_q = btn_e = false;// Инициализация переменных для кнопок

    /* Создание камеры */
    let camera = new THREE.PerspectiveCamera(100, screenWidth / screenHeight, 0.1, 1000);
    /* Назначение порядка вращения камеры */
    camera.rotation.order = 'YXZ';
    // Начальные координаты камеры
    /*
    camera.position.z = 400;
    camera.position.x = 600;
    camera.position.y = 70;*/

    camera.rotation.y = Math.PI;
    // Создание источника свята рядом с камерой
    let q1 = createLight(scene, "#FFFFFF", 1);
    // Координаты солнца (не солнца)
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



    /* Функции для опряделения нажатых кнопок */
    window.onkeydown = function (event) {
        switch (event.keyCode) {
            case 87: { btn_w = true; break;}
            case 65: { btn_a = true; break;}
            case 83: { btn_s = true; break; }
            case 68: { btn_d = true; break; }
            case 32: { btn_bsp = true; break; }
            case 16: { btn_sft = true; break; }
            case 69: { btn_e = true; break; }
            case 81: { btn_q = true; break; }
        }
    }
    window.onkeyup = function (event) {
        switch (event.keyCode) {
            case 87: { btn_w = false; break; }
            case 65: { btn_a = false; break; }
            case 83: { btn_s = false; break; }
            case 68: { btn_d = false; break; }
            case 32: { btn_bsp = false; break; }
            case 16: { btn_sft = false; break; }
            case 69: { btn_e = false; break; }
            case 81: { btn_q = false; break; }
        }
    }

    const rect = gameBox.getBoundingClientRect();// Рамка canvas
    let mouseX = screenWidth / 2, mouseY = screenHeight / 2;// Начальные координаты курсора

    /* Переназначение координат мыши относительно canvas при движении мыши */
    gameBox.addEventListener('mousemove', e => {
        mouseX = Math.min(e.clientX - rect.left, iw*0.8);
        mouseY = Math.min(e.clientY - rect.top, ih*0.8);
    });

    gameBox.addEventListener('mousedown', e => {
      btn_mouse = true;
    });
    gameBox.addEventListener('mouseup', e => {
      btn_mouse = false;
    });
 

    // Example text options : {'font' : 'helvetiker','weight' : 'normal', 'style' : 'normal','size' : 100,'curveSegments' : 300};

    


    let chunkAmount = 8;
    let mult = 2;// Мультипликатор скорости движения камеры
    let sunAngle = 0;
    let incX=0.0,incZ=0.0;
    let multiX=1, multiY=1, waveMulti=30;// Грубо говоря амплитуда
    let sinMulti=10;// Грубо говоря скорость
    let iMax=10,jMax=10;
    let polygonSize = 10;
    let halfField = chunkAmount*iMax*polygonSize/2;
    let fps=60;// надеюсь
    let shipRotation = new THREE.Vector3(0,0,0);
    let shipPosition = new THREE.Vector3(halfField,0,halfField);
    //let enemyShipPosition = new THREE.Vector3(400,0,300);
    let enemyShipPosition = new THREE.Vector3(halfField*2,0,0);
    let enemyShipRotation = new THREE.Vector3(0,4,0);
    let shipSpeed = 0.01, enemySpeed = 0.0;
    let lastUpdate = 0;
    let destroyerCDR = 0, destroyerCDL = 0, enemyCDR = 0, enemyCDL = 0;

    camera.position.z = halfField-50;
    camera.position.x = halfField;
    camera.position.y = 170;
    //createCube(scene,20,10,60,"#00FF00",shipPosition.x,shipPosition.y,shipPosition.z,0,0,0,"ship");
    //createCube(scene,6,100,6,"#00FF00",0,0,0,0,0,0);
    let y1,y2,y3,y4,y5,y6;
  

      /*
	  textGeometry = new THREE.TextGeometry( "text", null );
    textMaterial = new THREE.MeshPhongMaterial({color:0xff0000});
    textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);*/

	  let waterSurface = new THREE.Mesh();// = new THREE.Mesh( waterGeometry, waterMaterial );
    waterSurface.name = "waterSurface";
		
		let waterMaterial = new THREE.MeshLambertMaterial( { color: 0x000066 } );
		waterSurface.material = waterMaterial;
		scene.add( waterSurface );
  
    //let ground = createCube(scene,1000,1,1000,"#00FF00",0,-0.5,0,0,0,0);
    
    //let spookyFog = new THREE.Fog( fogColor, halfField*0.4,halfField*0.7);
    let spookyFog = new THREE.Fog( "#aaaaaa", 8, halfField);
    scene.fog = spookyFog;
    /*
		let CUBE1 = createCube(scene,10,100,10,"#00FF00",0,0,0,0,0,0);
		let CUBE2 = createCube(scene,10,100,10,"#FF0000",0,0,0,0,0,0);
    let CUBE3 = createCube(scene,10,100,10,"#AAAA00",0,0,0,0,0,0);
    let CUBE4 = createCube(scene,10,100,10,"#28004c",0,0,45,0,0,0);
		let CUBE5 = createCube(scene,10,100,10,"#fe3523",0,0,-40,0,0,0);
    let CUBE6 = createCube(scene,10,100,10,"#bf3eff",0,0,6,0,0,0);
    let CUBE7 = createCube(scene,100,10,10,"#AAAAAA",0,-10,6,0,0,0);
*/
    //let CUBE8 = createCube(scene,100,10,100,"#AAAAAA",halfField,100,halfField,0,0,0);



    let waterMeshChunks = new Array (chunkAmount);
    for (let i=0; i < waterMeshChunks.length; i++) {
      waterMeshChunks[i] = new Array(chunkAmount);
    }
    let waterGeometryChunks = new Array (chunkAmount);
    for (let i=0; i < waterGeometryChunks.length; i++) {
      waterGeometryChunks[i] = new Array(chunkAmount);
    }
  
		for(let i=0;i<waterMeshChunks.length;i++)
			for(let j=0;j<waterMeshChunks.length;j++){
        waterMeshChunks[i][j] = new THREE.Mesh();
				waterMeshChunks[i][j].material = waterMaterial;
				scene.add( waterMeshChunks[i][j] );
      }
      
      enemyShip.position.z = 50;
      enemyShip.position.x = 50;
      enemyShip.position.y = 10;





    /* Анимация мира */
    setInterval(function () {
    if(destroyerIsLoaded)if(!end){

			for(let i=0;i<waterGeometryChunks.length;i++)
			  for(let j=0;j<waterGeometryChunks.length;j++){
          waterGeometryChunks[i][j] = new THREE.Geometry();
        }

      //enemyShipPosition.z+=0.05;
      let speedX=0.1;//Math.random()*0.5;
      let speedZ=speedX;//Math.random()*0.5;
      incX+=speedX;
      incZ+=speedZ;
      //if(incX>2*Math.PI)incX-=2*Math.PI;
      //if(incZ>2*Math.PI)incZ-=2*Math.PI;
      let height1=0, lastheight1 = 0, height2=0, lastheight2 = 0;
      lastheight1 = Math.sin((incX-1)/sinMulti)*multiX;
			for(let a=0;a<waterMeshChunks.length;a++){
				for(let b=0;b<waterMeshChunks.length;b++){
          lastheight1 = Math.sin((b*jMax-1+incX)/sinMulti)*multiX;
          lastheight2 = Math.sin((a*iMax-1+incZ)/sinMulti)*multiY;
      		for(let i=0; i<iMax; i++){
            height2 = Math.sin((a*iMax+i+incZ)/sinMulti)*multiY;
        		for(let j=0; j<jMax; j++){
				      height1 = Math.sin((b*jMax+j+incX)/sinMulti)*multiX;
              
              /*
            	if(Math.abs(polygonSize*(b*jMax+j)+(destroyer.position.x-halfField) - shipPosition.x - 23*Math.sin(shipRotation.y)) < polygonSize/2 && Math.abs(polygonSize*(a*iMax+i)+(destroyer.position.z-halfField) - shipPosition.z - 23*Math.cos(shipRotation.y)) < polygonSize/2){
                //y1 = (lastheight1*lastheight2+height1*height2)/2*waveMulti;
                y1 = height1*height2*waveMulti;
								CUBE1.position.x = polygonSize*(b*jMax+j)+(destroyer.position.x-halfField) + 23*Math.sin(shipRotation.y);
								CUBE1.position.y = y1;
								CUBE1.position.z = polygonSize*(a*iMax+i)+(destroyer.position.z-halfField) + 23*Math.cos(shipRotation.y);
            	}
              if(Math.abs(polygonSize*(b*jMax+j)+(destroyer.position.x-halfField) - shipPosition.x + 20*Math.sin(shipRotation.y)) < polygonSize/2 && Math.abs(polygonSize*(a*iMax+i)+(destroyer.position.z-halfField) - shipPosition.z + 20*Math.cos(shipRotation.y)) < polygonSize/2){
                //y2 = (lastheight1*lastheight2+height1*height2)/2*waveMulti;
                y2 = height1*height2*waveMulti;
								CUBE2.position.x = polygonSize*(b*jMax+j)+(destroyer.position.x-halfField) - 20*Math.sin(shipRotation.y);
								CUBE2.position.y = y2;
								CUBE2.position.z = polygonSize*(a*iMax+i)+(destroyer.position.z-halfField) - 20*Math.cos(shipRotation.y);
            	}
            	if(Math.abs(polygonSize*(b*jMax+j)+(destroyer.position.x-halfField) - shipPosition.x - 5*Math.sin(shipRotation.y)) < polygonSize && Math.abs(polygonSize*(a*iMax+i)+(destroyer.position.z-halfField) - shipPosition.z - 5*Math.cos(shipRotation.y)) < polygonSize){
                //y3 = (lastheight1*lastheight2+height1*height2)/2*waveMulti;
                y3 = height1*height2*waveMulti;
								CUBE3.position.x = polygonSize*(b*jMax+j)+(destroyer.position.x-halfField) + 5*Math.sin(shipRotation.y);
								CUBE3.position.y = y3;
								CUBE3.position.z = polygonSize*(a*iMax+i)+(destroyer.position.z-halfField) + 5*Math.cos(shipRotation.y);
              }

              //
              // ! E N E M Y !
              //

            	if(Math.abs(polygonSize*(b*jMax+j) - halfField - enemyShip.position.x + destroyer.position.x + 22*Math.sin(enemyShip.rotation.y)) < polygonSize && Math.abs(polygonSize*(a*iMax+i) - halfField - enemyShip.position.z + destroyer.position.z + 20*Math.cos(enemyShip.rotation.y)) < polygonSize){
                y4 = height1*height2*waveMulti;
								CUBE4.position.x = polygonSize*(b*jMax+j)+(destroyer.position.x-halfField) - 22*Math.sin(enemyShip.rotation.y);
								CUBE4.position.y = y4;
								CUBE4.position.z = polygonSize*(a*iMax+i)+(destroyer.position.z-halfField) - 22*Math.cos(enemyShip.rotation.y);
              }
              
              if(Math.abs(polygonSize*(b*jMax+j) - halfField - enemyShip.position.x + destroyer.position.x - 20*Math.sin(enemyShip.rotation.y)) < polygonSize && Math.abs(polygonSize*(a*iMax+i) - halfField - enemyShip.position.z + destroyer.position.z - 20*Math.cos(enemyShip.rotation.y)) < polygonSize){
                y5 = height1*height2*waveMulti;
								CUBE5.position.x = polygonSize*(b*jMax+j)+(destroyer.position.x-halfField) + 20*Math.sin(enemyShip.rotation.y);
								CUBE5.position.y = y5;
								CUBE5.position.z = polygonSize*(a*iMax+i)+(destroyer.position.z-halfField) + 20*Math.cos(enemyShip.rotation.y);
            	}
            	if(Math.abs(polygonSize*(b*jMax+j) - halfField - enemyShip.position.x + destroyer.position.x) < polygonSize && Math.abs(polygonSize*(a*iMax+i) - halfField - enemyShip.position.z + destroyer.position.z) < polygonSize){
                y6 = height1*height2*waveMulti;
								CUBE6.position.x = polygonSize*(b*jMax+j)+(destroyer.position.x-halfField);
								CUBE6.position.y = y6;
								CUBE6.position.z = polygonSize*(a*iMax+i)+(destroyer.position.z-halfField);
              }
              */
          		waterGeometryChunks[a][b].vertices.push(
            		new THREE.Vector3(polygonSize*(j+b*jMax)+(destroyer.position.x-halfField), lastheight1*lastheight2*waveMulti, polygonSize*(i+a*iMax)+(destroyer.position.z-halfField)),
            		new THREE.Vector3(polygonSize*(j+b*jMax)+(destroyer.position.x-halfField), height2*lastheight1*waveMulti, polygonSize*(i+1+a*iMax)+(destroyer.position.z-halfField)),
            		new THREE.Vector3(polygonSize*(j+1+b*jMax)+(destroyer.position.x-halfField), height1*height2*waveMulti, polygonSize*(i+1+a*iMax)+(destroyer.position.z-halfField)),

            		new THREE.Vector3(polygonSize*(j+b*jMax)+(destroyer.position.x-halfField), lastheight1*lastheight2*waveMulti, polygonSize*(i+a*iMax)+(destroyer.position.z-halfField)),
            		new THREE.Vector3(polygonSize*(j+1+b*jMax)+(destroyer.position.x-halfField), lastheight2*height1*waveMulti, polygonSize*(i+a*iMax)+(destroyer.position.z-halfField)),
            		new THREE.Vector3(polygonSize*(j+1+b*jMax)+(destroyer.position.x-halfField), height1*height2*waveMulti, polygonSize*(i+1+a*iMax)+(destroyer.position.z-halfField))
          		);
          		waterGeometryChunks[a][b].faces.push(
            		new THREE.Face3((i*iMax+j)*6+0, (i*iMax+j)*6+1, (i*iMax+j)*6+2),
            		new THREE.Face3((i*iMax+j)*6+3, (i*iMax+j)*6+5, (i*iMax+j)*6+4)
          		);
          		lastheight1 = height1;
        		}
            lastheight1 = Math.sin((b*jMax-1+incX)/sinMulti)*multiX;
            lastheight2 = height2;
      		}
      		waterGeometryChunks[a][b].computeFaceNormals();
					waterMeshChunks[a][b].geometry = waterGeometryChunks[a][b];
				}
			}
			
			


      let l1=0,l2=0,l0;
      l0 = Math.sqrt(Math.pow((enemyShipPosition.x-shipPosition.x),2) + Math.pow((enemyShipPosition.z-shipPosition.z),2));
      l1 = Math.sqrt(Math.pow((enemyShipPosition.x-shipPosition.x-100*Math.cos(shipRotation.y)),2) + Math.pow((enemyShipPosition.z-shipPosition.z-100*Math.sin(shipRotation.y)),2));
      l2 = Math.sqrt(Math.pow((enemyShipPosition.x-shipPosition.x+100*Math.cos(shipRotation.y)),2) + Math.pow((enemyShipPosition.z-shipPosition.z+100*Math.sin(shipRotation.y)),2));
      //console.log("l0 "+ l0);
      //console.log("l1 "+ l1);
      //console.log("l2 "+ l2);
      
      if(enemyHP > 0){
      if(l1>30 && l2>30){
        enemySpeed += 0.01;
        if(enemySpeed>0.5)enemySpeed=0.5;
      if(l1 < l2){
        //console.log("LEFT 1");
        //if(enemySpeed > 0.5)enemySpeed=0.5;
        let supposedAngle = Math.atan2(enemyShipPosition.x-shipPosition.x-100*Math.cos(shipRotation.y), enemyShipPosition.z-shipPosition.z-100*Math.sin(shipRotation.y));
        if(supposedAngle<0)supposedAngle+=2*Math.PI;
        supposedAngle %=Math.PI*2;
        if( Math.abs( supposedAngle - enemyShipRotation.y ) > enemySpeed/70 ){
          if(supposedAngle > enemyShipRotation.y)enemyShipRotation.y += enemySpeed/70;
            else enemyShipRotation.y -= enemySpeed/70;
        }else enemyShipRotation.y = supposedAngle;
        enemyShipPosition.x -= Math.sin(enemyShipRotation.y)*enemySpeed;
        enemyShipPosition.z -= Math.cos(enemyShipRotation.y)*enemySpeed;

      }else{
        
        let supposedAngle = Math.atan2(enemyShipPosition.x-shipPosition.x+100*Math.cos(shipRotation.y), enemyShipPosition.z-shipPosition.z+100*Math.sin(shipRotation.y));
        if(supposedAngle<0)supposedAngle+=2*Math.PI;
        //console.log("LEFT 22222 " + supposedAngle);
        if( Math.abs( supposedAngle - enemyShipRotation.y ) > enemySpeed/70 ){
          if(supposedAngle > enemyShipRotation.y)enemyShipRotation.y += enemySpeed/70;
            else enemyShipRotation.y -= enemySpeed/70;
        }else enemyShipRotation.y = supposedAngle;
        enemyShipPosition.x -= Math.sin(enemyShipRotation.y)*enemySpeed;
        enemyShipPosition.z -= Math.cos(enemyShipRotation.y)*enemySpeed;

      }
      }
      
      else{
        if(Math.abs( enemyShipRotation.y - Math.PI - shipRotation.y ) > 10/180*Math.PI){
          //enemySpeed += 0.003;
          //console.log(enemyShipRotation.y - shipRotation.y);
          //if(shipRotation.y < 0)shipRotation.y+=2*Math.PI;
          if( Math.abs( enemyShipRotation.y+Math.PI - shipRotation.y ) > enemySpeed/70 ){
            if(shipRotation.y+Math.PI > enemyShipRotation.y)enemyShipRotation.y += enemySpeed/70;
              else enemyShipRotation.y -= enemySpeed/70;
            }else enemyShipRotation.y = shipRotation+Math.PI;
            enemyShipPosition.x -= Math.sin(enemyShipRotation.y)*enemySpeed;
            enemyShipPosition.z -= Math.cos(enemyShipRotation.y)*enemySpeed;
        }else{
          //console.log("OK");
          if(destroyerHP > 0){
          if(l1<l2 && Date.now() - enemyCDR > 2000){
            cannonShoot(0,scene,enemyShip,0,0,0,enemyShipRotation.y+Math.PI/2);
            enemyCDR = Date.now();
          }
          if(l2<l1 && Date.now() - enemyCDL > 2000){
            cannonShoot(0,scene,enemyShip,0,0,0,enemyShipRotation.y-Math.PI/2);
            enemyCDL = Date.now();
          }}
          enemySpeed -= 0.1;
          if(enemySpeed<0)enemySpeed=0;
        }
      }
      }


      //enemyShipPosition.x
        

      //new THREE.Face3((i*iMax+j)*6+0, (i*iMax+j)*6+1, (i*iMax+j)*6+2),
      //let pos1 = scene.getObjectByName("waterSurface").geometry.vertices[(shipPosition.z-1)/polygonSize*600+shipPosition.x/polygonSize*60];
      //let pos2 = scene.getObjectByName("waterSurface").geometry.vertices[(shipPosition.z+1)/polygonSize*600+shipPosition.x/polygonSize*60];
      //scene.add(createCube(scene,10,100,10,"#00ff00",pos1.x,pos1.y,pos1.z,0,0,0));
      //scene.add(createCube(scene,10,100,10,"#00ff00",pos2.x,pos2.y,pos2.z,0,0,0));
      //let y1 = scene.getObjectByName("waterSurface").geometry.vertices[(shipPosition.z-10)/polygonSize+shipPosition.x/polygonSize*6].y;
      //let y2 = scene.getObjectByName("waterSurface").geometry.vertices[(shipPosition.z+10)/polygonSize+shipPosition.x/polygonSize*6].y;


      y1 = Math.sin(((halfField - 23*Math.sin(shipRotation.y))/polygonSize + incX)/sinMulti)*multiX  *  Math.sin(((halfField - 23*Math.cos(shipRotation.y))/polygonSize + incZ)/sinMulti)*multiY  *  waveMulti;
      y2 = Math.sin(((halfField + 20*Math.sin(shipRotation.y))/polygonSize + incX)/sinMulti)*multiX  *  Math.sin(((halfField + 20*Math.cos(shipRotation.y))/polygonSize + incZ)/sinMulti)*multiY  *  waveMulti;
      y3 = Math.sin(((halfField - 5*Math.sin(shipRotation.y))/polygonSize + incX)/sinMulti)*multiX  *  Math.sin(((halfField - 5*Math.cos(shipRotation.y))/polygonSize + incZ)/sinMulti)*multiY  *  waveMulti;


      y4 = Math.sin(((halfField + enemyShip.position.x - destroyer.position.x + 22*Math.sin(enemyShip.rotation.y))/polygonSize + incX)/sinMulti)*multiX  *  Math.sin(((halfField + enemyShip.position.z - destroyer.position.z + 22*Math.cos(enemyShip.rotation.y))/polygonSize + incZ)/sinMulti)*multiY  *  waveMulti;
      y5 = Math.sin(((halfField + enemyShip.position.x - destroyer.position.x - 20*Math.sin(enemyShip.rotation.y))/polygonSize + incX)/sinMulti)*multiX  *  Math.sin(((halfField + enemyShip.position.z - destroyer.position.z - 20*Math.cos(enemyShip.rotation.y))/polygonSize + incZ)/sinMulti)*multiY  *  waveMulti;
      y6 = Math.sin(((halfField + enemyShip.position.x - destroyer.position.x)/polygonSize + incX)/sinMulti)*multiX  *  Math.sin(((halfField + enemyShip.position.z - destroyer.position.z)/polygonSize + incZ)/sinMulti)*multiY  *  waveMulti;

      /*
      CUBE1.position.y = y1;
      CUBE2.position.y = y2;
      CUBE3.position.y = y3;

      CUBE4.position.y = y4;
      CUBE5.position.y = y5;
      CUBE6.position.y = y6;*/
      //y3=y1+y2;
      //y3/=2;
      if(!btn_sft){
        camera.position.x += shipSpeed * Math.sin(shipRotation.y);
        camera.position.z += shipSpeed * Math.cos(shipRotation.y);
      }

      shipPosition.x += shipSpeed * Math.sin(shipRotation.y);
      shipPosition.y = (y1+y2+y3)/3+10;
      shipPosition.z += shipSpeed * Math.cos(shipRotation.y);
      incX -= (shipSpeed * Math.sin(shipRotation.y))/polygonSize;
      incZ -= (shipSpeed * Math.cos(shipRotation.y))/polygonSize;

      destroyer.position.x = shipPosition.x;
      destroyer.position.z = shipPosition.z;
      if(destroyerHP > 0)
      if( Math.abs( destroyer.position.y - shipPosition.y ) > 0.6 ){
        if(destroyer.position.y > shipPosition.y)destroyer.position.y -= 0.6;
          else destroyer.position.y += 0.6;
      }
      else 
      destroyer.position.y = shipPosition.y;

      enemyShipPosition.y = (y4+y5+y6)/3+10;
      enemyShip.position.x = enemyShipPosition.x;
      enemyShip.position.z = enemyShipPosition.z;
      if(enemyHP > 0)
      if( Math.abs( enemyShip.position.y - enemyShipPosition.y ) > 1 ){
        if(enemyShip.position.y > enemyShipPosition.y)enemyShip.position.y -= 1;
          else enemyShip.position.y += 1;
      }
      else 
      enemyShip.position.y = enemyShipPosition.y;
      
      shipRotation.x = Math.asin(((y1-y3)/18)%(2*Math.PI))+Math.asin(((y3-y2)/25)%(2*Math.PI))/10;
      enemyShipRotation.x = (Math.asin(((y6-y4)/22)%(2*Math.PI))+Math.asin(((y5-y6)/20)%(2*Math.PI)))/2;

      destroyer.rotation.x = shipRotation.x;
      destroyer.rotation.y = shipRotation.y;

      enemyShip.rotation.x = enemyShipRotation.x;
      enemyShip.rotation.y = enemyShipRotation.y;

      /*
      camera.rotation.x += Math.PI / 10000 * Math.pow((screenHeight / 2 - mouseY) / 120, 5);// вращение камеры с помощью мыши относительно внутренней оси X
      camera.rotation.y += Math.PI / 10000 * Math.pow((screenWidth / 2 - mouseX) / 120 / screenWidth * screenHeight, 5);// вращение камеры с помощью мыши относительно внутренней оси
      */
      camera.rotation.x += Math.PI / 10000 * Math.pow((ih*0.8 / 2 - mouseY) /ih/0.8*screenHeight/ 120, 5);// вращение камеры с помощью мыши относительно внутренней оси X
      camera.rotation.y += Math.PI / 10000 * Math.pow((iw*0.8 / 2 - mouseX) /iw/0.8*screenWidth/ 120 / iw * ih, 5);// вращение камеры с помощью мыши относительно внутренней оси Y
      if(camera.rotation.x > Math.PI/2)camera.rotation.x = Math.PI/2;
      if(camera.rotation.x < -Math.PI/2)camera.rotation.x = -Math.PI/2;

			//waterGeometry.dispose();
			//waterSurface.geometry.dispose();
      //scene.remove( waterSurface );
      //scene.remove( pos1 );
      //scene.remove( pos2 );
      //clean up
	    //waterSurface.dispose();
			//renderer.dispose();
			//waterSurface.geometry = null;
      //waterGeometry.dispose();
      //texture.dispose();

      /* Источник света рядом с камерой */
      q1.position.x = camera.position.x;
      q1.position.y = camera.position.y;
      q1.position.z = camera.position.z;

      /* Движение камеры учитывая вращение камеры относительно внутренней оси Y */

      /*
      if(destroyer.rotation.y>Math.PI*2) destroyer.rotation.y-=Math.PI*2;
      if(destroyer.rotation.y<0)destroyer.rotation.y+=Math.PI*2;

      if(camera.rotation.y>Math.PI*2) camera.rotation.y-=Math.PI*2;
      if(camera.rotation.y<0)camera.rotation.y+=Math.PI*2;
      
      //if(camera.rotation.y<-Math.PI*2)camera.rotation.y+=Math.PI*2;
      if(btn_mouse){
        //if( (camera.rotation.y < Math.PI + destroyer.rotation.y && camera.rotation.y > 0 ) || (camera.rotation.y > Math.PI*2 - destroyer.rotation.y && camera.rotation.y < Math.PI*2) ){
        //if( destroyer.rotation.y + Math.PI < Math.PI*2 && destroyer.rotation.y + Math.PI - camera.rotation.y > 0 || destroyer.rotation.y + Math.PI > Math.PI*2 && destroyer.rotation.y + Math.PI - camera.rotation.y > 0 ){
        //if( destroyer.rotation.y + Math.PI - camera.rotation.y > 0){// Math.PI*2 && destroyer.rotation.y + Math.PI - camera.rotation.y > 0 || destroyer.rotation.y + Math.PI > Math.PI*2 && destroyer.rotation.y + Math.PI - camera.rotation.y > 0 ){
        if(  destroyer.rotation.y + Math.PI - camera.rotation.y > 0 && destroyer.rotation.y + Math.PI < 2*Math.PI && camera.rotation.y > Math.PI 
          || destroyer.rotation.y + Math.PI - camera.rotation.y < 0 && destroyer.rotation.y + Math.PI < 2*Math.PI && camera.rotation.y < Math.PI 
          || destroyer.rotation.y + Math.PI - camera.rotation.y < 0 && destroyer.rotation.y + Math.PI > 2*Math.PI && camera.rotation.y > Math.PI 
          || destroyer.rotation.y + Math.PI - camera.rotation.y > 0 && destroyer.rotation.y + Math.PI > 2*Math.PI && camera.rotation.y < Math.PI ){
        
        //if( destroyer.rotation.y + Math.PI - camera.rotation.y > 0 && destroyer.rotation.y + Math.PI < 2*Math.PI || destroyer.rotation.y + Math.PI - camera.rotation.y < 0 && destroyer.rotation.y + Math.PI > 2*Math.PI ){
          helpCube2.material.opacity = 0.3;
          helpCube1.material.opacity = 0;
          console.log(camera.rotation.y+' '+(Math.PI + destroyer.rotation.y)+' true');
        }else{
            helpCube1.material.opacity = 0.3;
            helpCube2.material.opacity = 0;
            console.log(camera.rotation.y+' '+(Math.PI + destroyer.rotation.y)+' false');
        }
      }else{
        helpCube1.material.opacity = 0;
        helpCube2.material.opacity = 0;
      }*/

      /*
			if(btn_bsp){
        if( camera.rotation.y>destroyer.rotation.y && camera.rotation.y<destroyer.rotation.y+Math.PI ){
          helpCube2.material.opacity = 0.93;
          helpCube1.material.opacity = 0;
          console.log('1');
        }else{
          helpCube1.material.opacity = 0.93;
          helpCube2.material.opacity = 0;
          console.log('2');
        }
      }*/

      /*
      CUBE1.position.x = destroyer.position.x + 15*Math.cos(destroyer.rotation.y) + 25*Math.sin(destroyer.rotation.y);
      CUBE1.position.z = destroyer.position.z + 15*Math.sin(destroyer.rotation.y) + 25*Math.cos(destroyer.rotation.y);

      CUBE2.position.x = destroyer.position.x - 15*Math.cos(destroyer.rotation.y) - 35*Math.sin(destroyer.rotation.y);
      CUBE2.position.z = destroyer.position.z - 15*Math.sin(destroyer.rotation.y) - 35*Math.cos(destroyer.rotation.y);
     */
      /*
      CUBE4.position.x = enemyShip.position.x + 10*Math.cos(destroyer.rotation.y) + 25*Math.sin(enemyShip.rotation.y);
      CUBE4.position.z = enemyShip.position.z + 10*Math.sin(destroyer.rotation.y) + 25*Math.cos(enemyShip.rotation.y);

      CUBE5.position.x = enemyShip.position.x - 10*Math.cos(destroyer.rotation.y) - 35*Math.sin(enemyShip.rotation.y);
      CUBE5.position.z = enemyShip.position.z - 10*Math.sin(destroyer.rotation.y) - 35*Math.cos(enemyShip.rotation.y);*/

      for(let i=0;i<cannonBalls.length;i++){
        let angle = cannonBalls[i].angle
        cannonBalls[i].ball.position.x+=Math.sin(angle)*10;
        cannonBalls[i].ball.position.z+=Math.cos(angle)*10;
        cannonBalls[i].ball.position.y-=0.5;
        //console.log('> '+(enemyShip.position.x - 20*Math.sin(enemyShip.rotation.y)));
        //console.log('< '+(enemyShip.position.x + 20*Math.sin(enemyShip.rotation.y)));
        if(cannonBalls[i].player){
        if( cannonBalls[i].ball.position.x > enemyShip.position.x + 10*Math.cos(destroyer.rotation.y) + 25*Math.sin(enemyShip.rotation.y) && enemyShip.position.x - 10*Math.cos(destroyer.rotation.y) - 35*Math.sin(enemyShip.rotation.y)
        &&  cannonBalls[i].ball.position.z > enemyShip.position.z + 10*Math.sin(destroyer.rotation.y) + 25*Math.cos(enemyShip.rotation.y) && enemyShip.position.z - 10*Math.sin(destroyer.rotation.y) - 35*Math.cos(enemyShip.rotation.y)
        &&  cannonBalls[i].ball.position.y > enemyShip.position.y-15
        ){
          //console.log("HITT");
          enemyHP--;
          scene.remove( cannonBalls[i].ball );
          cannonBalls[i].ball.geometry.dispose();
          cannonBalls[i].ball.material.dispose();
          cannonBalls.splice(i, 1);
        }}else{
          if( cannonBalls[i].ball.position.x > destroyer.position.x + 15*Math.cos(destroyer.rotation.y+Math.PI) + 25*Math.sin(destroyer.rotation.y+Math.PI) && cannonBalls[i].ball.position.x < destroyer.position.x - 15*Math.cos(destroyer.rotation.y+Math.PI) - 35*Math.sin(destroyer.rotation.y+Math.PI)
          &&  cannonBalls[i].ball.position.z > destroyer.position.z + 15*Math.sin(destroyer.rotation.y+Math.PI) + 25*Math.cos(destroyer.rotation.y+Math.PI) && cannonBalls[i].ball.position.z < destroyer.position.z - 15*Math.cos(destroyer.rotation.y+Math.PI) - 35*Math.cos(destroyer.rotation.y+Math.PI) 
          &&  cannonBalls[i].ball.position.y > destroyer.position.y-25
          ){
            //console.log("SSS PPP AAA NNN III AAA RRR DDD SSS");
            destroyerHP--;
            scene.remove( cannonBalls[i].ball );
            cannonBalls[i].ball.geometry.dispose();
            cannonBalls[i].ball.material.dispose();
            cannonBalls.splice(i, 1);
          }
        }
      }
      if(btn_q && Date.now() - destroyerCDL > 2000){
        cannonShoot(1,scene,destroyer,0,0,0,destroyer.rotation.y+Math.PI/2);
        destroyerCDL = Date.now();
      }
      if(btn_e && Date.now() - destroyerCDR > 2000){
        cannonShoot(1,scene,destroyer,0,0,0,destroyer.rotation.y+Math.PI*3/2);
        destroyerCDR = Date.now();
      }
/*
      if(Date.now() - lastUpdate>10000){
      console.log( Date.now()-lastUpdate);
      lastUpdate = Date.now();}*/
			if(btn_sft){
        if (btn_w) {
          camera.position.x -= 1 * mult * Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
          camera.position.y += 1 * mult * Math.sin(camera.rotation.x);
          camera.position.z -= 1 * mult * Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
        }
        if (btn_a) {
          camera.position.x -= 1 * mult * Math.cos(camera.rotation.y);
          camera.position.z += 1 * mult * Math.sin(camera.rotation.y);
        }
        if (btn_s) {
          camera.position.x += 1 * mult * Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
          camera.position.y -= 1 * mult * Math.sin(camera.rotation.x);
          camera.position.z += 1 * mult * Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
        }
        if (btn_d) {
          camera.position.x += 1 * mult * Math.cos(camera.rotation.y);
          camera.position.z -= 1 * mult * Math.sin(camera.rotation.y);
        }
			}else{
			  if (btn_w) {
          //camera.position.x = destroyer.position.x-60*Math.sin(shipRotation.y);//+= (destroyer.position.x-camera.position.x)%100;
          //camera.position.y = destroyer.position.y+100;
          //camera.position.z = destroyer.position.z-60*Math.cos(shipRotation.y);
          if(shipSpeed < 0.6)
          shipSpeed += 0.01;
        }
        if (btn_a) shipRotation.y+=shipSpeed/70;
        if (btn_d) shipRotation.y-=shipSpeed/70;
      }

      if(btn_sft || !btn_w){
        if(shipSpeed > 0) shipSpeed -= 0.01;
        if(shipSpeed < 0) shipSpeed = 0;
      }

        /*
        sunAngle += 0.001;
        sun.position.x = 200 * Math.sin(sunAngle);
        sun.position.y = 200 * Math.cos(sunAngle);
        if (sun.position.y <= 0) {
            sunAngle += 0.01;
            sun.position.x = 200 * Math.sin(sunAngle);
            sun.position.y = 200 * Math.cos(sunAngle);
        }*/
      //}
      renderer.render(scene, camera);

			for(let i=0;i<waterMeshChunks.length;i++)
				for(let j=0;j<waterMeshChunks.length;j++){
					waterGeometryChunks[i][j].dispose();
					waterMeshChunks[i][j].geometry.dispose();
        }
	
      if(enemyHP <= 0){enemyShip.position.y-=0.1;}
      if(destroyerHP <= 0){destroyer.position.y-=0.1;}
      if(endStart && Date.now() - endCount > 10000)end = true;
      if(enemyHP <= 0 && !endStart){
        endStart = true;
        endCount = Date.now();
      }
    }else{
      camera.rotation.x += Math.PI / 10000 * Math.pow((ih*0.8 / 2 - mouseY) /ih/0.8*screenHeight/ 120, 5);// вращение камеры с помощью мыши относительно внутренней оси X
      camera.rotation.y += Math.PI / 10000 * Math.pow((iw*0.8 / 2 - mouseX) /iw/0.8*screenWidth/ 120 / iw * ih, 5);// вращение камеры с помощью мыши относительно внутренней оси Y
      if(camera.rotation.x > Math.PI/2)camera.rotation.x = Math.PI/2;
      if(camera.rotation.x < -Math.PI/2)camera.rotation.x = -Math.PI/2;

      if (btn_w) {
        camera.position.x -= 1 * mult * Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
        camera.position.y += 1 * mult * Math.sin(camera.rotation.x);
        camera.position.z -= 1 * mult * Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
      }
      if (btn_a) {
        camera.position.x -= 1 * mult * Math.cos(camera.rotation.y);
        camera.position.z += 1 * mult * Math.sin(camera.rotation.y);
      }
      if (btn_s) {
        camera.position.x += 1 * mult * Math.sin(camera.rotation.y)*Math.cos(camera.rotation.x);
        camera.position.y -= 1 * mult * Math.sin(camera.rotation.x);
        camera.position.z += 1 * mult * Math.cos(camera.rotation.y)*Math.cos(camera.rotation.x);
      }
      if (btn_d) {
        camera.position.x += 1 * mult * Math.cos(camera.rotation.y);
        camera.position.z -= 1 * mult * Math.sin(camera.rotation.y);
      }

      renderer.render(scene, camera);

      if(!clear){
        
        while(scene.children.length > 0){
          scene.remove(scene.children[0]);
        }
      var tloader = new THREE.FontLoader();

      tloader.load( 'fonts/optimer_regular.typeface.json', function ( font ) {
  
      var textGeo = new THREE.TextGeometry( " HAPPY BIRTHDAY MAX (prosto russian ne rabotaet :D )", {
  
          font: font,
  
          size: 200,
          height: 50,
          curveSegments: 12,
  
          bevelThickness: 2,
          bevelSize: 5,
          bevelEnabled: true
  
      } );
  
      var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );
  
      var tmesh = new THREE.Mesh( textGeo, textMaterial );
      tmesh.position.set( 100,100,100 );
      tmesh.scale.set(0.1,0.1,0.1);
      scene.add( tmesh );
      createCube(scene,100,10,1000,"#000000",400,0,0,0,0,0);
  
      });
      //camera.rotation.y += Math.PI;
      camera.position.set(400,100,500);
      clear = true;
    }
  }
}, 30);
}
