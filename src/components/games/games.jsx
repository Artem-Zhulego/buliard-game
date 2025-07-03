// import React, { useEffect, useRef } from 'react';
// import * as THREE from 'three';
// import { useGameStore, useSettingsStore, useUserStore } from '../../store/store';
// import './games.css';
// import Layout from '../Layout';

// import { Line2 } from 'three/examples/jsm/lines/Line2.js';
// import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
// import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

// function Main() {
//     const { games } = useGameStore();
//     const { settings } = useSettingsStore();
//     const { user } = useUserStore();
//     const canvasRef = useRef(null);
//     const whiteBallRef = useRef(null);
//     const lineRef = useRef(null);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const scene = new THREE.Scene();
//         const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
//         const camera = new THREE.OrthographicCamera(-canvas.clientWidth / 2, canvas.clientWidth / 2, canvas.clientHeight / 2, -canvas.clientHeight / 2, 0.1, 1000);

//         const light = new THREE.AmbientLight(0x404040, 2);
//         scene.add(light);

//         const pointLight = new THREE.PointLight(0xffffff, 1, 100);
//         pointLight.position.set(50, 50, 50);
//         scene.add(pointLight);

//         camera.position.set(0, 100, 0);
//         camera.lookAt(0, 0, 0);

//         const resizeRendererToDisplaySize = () => {
//             const { clientWidth: width, clientHeight: height } = canvas;
//             if (canvas.width !== width || canvas.height !== height) {
//                 renderer.setSize(width, height, false);
//                 camera.left = -width / 2;
//                 camera.right = width / 2;
//                 camera.top = height / 2;
//                 camera.bottom = -height / 2;
//                 camera.updateProjectionMatrix();
//             }
//         };

//         const loadTexture = (url) => {
//             return new Promise((resolve, reject) => {
//                 new THREE.TextureLoader().load(
//                     url,
//                     (texture) => {
//                         texture.flipY = false; // Устанавливаем это для правильного отображения
//                         resolve(texture);
//                     },
//                     undefined,
//                     (error) => {
//                         console.error(`Ошибка загрузки текстуры: ${url}`, error);
//                         reject(error);
//                     }
//                 );
//             });
//         };

//         const createBall = (texture, radius, position) => {
//             const geometry = new THREE.SphereGeometry(radius, 16, 16);
//             const material = new THREE.MeshBasicMaterial({ map: texture });
//             const ball = new THREE.Mesh(geometry, material);
//             ball.position.set(position.x, position.y, position.z);
//             return ball;
//         };

//         const loadScene = async () => {
//             const tableTexture = await loadTexture(require('../../assets/table.png'));
//             const tableGeometry = new THREE.PlaneGeometry(canvas.clientWidth, canvas.clientHeight);
//             const tableMaterial = new THREE.MeshBasicMaterial({ map: tableTexture });
//             const table = new THREE.Mesh(tableGeometry, tableMaterial);
//             table.position.set(0, 0, 0);
//             table.rotation.x = -Math.PI / 2;
//             scene.add(table);

//             const whiteBallTexture = await loadTexture(require('../../assets/balls/whiteball.png'));
//             const whiteBall = createBall(whiteBallTexture, 10, { x: 164, y: 0, z: 0 });
//             whiteBallRef.current = whiteBall;
//             scene.add(whiteBall);
//             drawLine();

//             const ballTextures = await Promise.all(
//                 Array.from({ length: 15 }, (_, i) => loadTexture(require(`../../assets/balls/${i + 1}ball.png`)))
//             );

//             const ballRadius = 10;
//             const ballSpacing = ballRadius * 2;
//             const firstBallPosition = { x: -125, y: 8, z: 0 };
//             const rotationAngle = THREE.MathUtils.degToRad(90);

//             let ballIndex = 0;
//             for (let col = 0; col < 5; col++) {
//                 const offsetZ = (col + 1) * ballRadius;
//                 for (let row = 0; row <= col; row++) {
//                     const ballX = firstBallPosition.x - (col * ballSpacing);
//                     const ballY = firstBallPosition.y;
//                     const ballZ = firstBallPosition.z + (row * ballSpacing) - offsetZ;
//                     const ball = createBall(ballTextures[ballIndex], ballRadius, { x: ballX, y: ballY, z: ballZ });
//                     ball.rotateX(rotationAngle);
//                     scene.add(ball);
//                     ballIndex++;
//                 }
//             }
            
//             const animate = () => {
//                 requestAnimationFrame(animate);
//                 resizeRendererToDisplaySize();
//                 renderer.render(scene, camera);
//             };
//             animate();
//         };

//         loadScene();

//         window.addEventListener('resize', resizeRendererToDisplaySize);

//         const drawLine = (angleOffset = Math.PI / 2) => {
//             if (!whiteBallRef.current) return;
        
//             const whiteBall = whiteBallRef.current;
//             const whiteBallPos = whiteBall.position.clone();
        
//             const direction = new THREE.Vector3(
//                 -Math.sin(angleOffset),
//                 0,
//                 0
//             ).normalize();
        
//             const lineLength = 1000;
//             const lineEnd = whiteBallPos.clone().add(direction.multiplyScalar(lineLength));
        
//             console.log('White Ball Position:', whiteBallPos);
//             console.log('Line End Position:', lineEnd);
        
//             if (lineRef.current) {
//                 const geometry = lineRef.current.geometry;
//                 geometry.setPositions([whiteBallPos.x, whiteBallPos.y, whiteBallPos.z, lineEnd.x, lineEnd.y, lineEnd.z]);
//                 geometry.attributes.position.needsUpdate = true;
//             } else {
//                 const geometry = new LineGeometry();
//                 geometry.setPositions([whiteBallPos.x, whiteBallPos.y, whiteBallPos.z, lineEnd.x, lineEnd.y, lineEnd.z]);
        
//                 const material = new LineMaterial({
//                     color: 0xffffff,
//                     linewidth: 3,
//                     dashed: false,
//                     resolution: new THREE.Vector2(window.innerWidth, window.innerHeight)
//                 });
        
//                 const newLine = new Line2(geometry, material);
//                 newLine.computeLineDistances();
//                 lineRef.current = newLine;
//                 scene.add(newLine);
//             }
//         };
        
//         let lastTouchX = null;
//         let lastTouchY = null;
//         let currentAngleOffset = Math.PI / 2; // Начальный угол
        
//         const calculateNewAngleOffset = (event) => {
//             const rect = canvas.getBoundingClientRect();
//             const touchX = event.touches[0].clientX - rect.left;
//             const touchY = event.touches[0].clientY - rect.top;
        
//             if (lastTouchX === null || lastTouchY === null) {
//                 lastTouchX = touchX;
//                 lastTouchY = touchY;
//                 return currentAngleOffset; // Возвращаем текущий угол
//             }
        
//             const deltaX = touchX - lastTouchX;
//             const deltaY = touchY - lastTouchY;
        
//             // Вычисляем угол на основе дельты по Y и X
//             const angleChange = Math.atan2(deltaY, deltaX);
//             currentAngleOffset = angleChange; // Устанавливаем текущий угол на новое значение
        
//             lastTouchX = touchX;
//             lastTouchY = touchY;
        
//             return currentAngleOffset; // Возвращаем обновленный угол
//         };
        
//         const onTouchMove = (event) => {
//             event.preventDefault();
//             const newAngleOffset = calculateNewAngleOffset(event);
//             drawLine(newAngleOffset); // Рисуем линию с обновленным углом
//         };
        

//         canvas.addEventListener('touchmove', onTouchMove);
//         return () => {
//             renderer.dispose();
//             window.removeEventListener('resize', resizeRendererToDisplaySize);
//             canvas.removeEventListener('touchmove', onTouchMove);
//         };
//     }, []);

//     return (
//         <Layout>
//             <div className="games">
//                 <canvas ref={canvasRef}></canvas>
//             </div>
//         </Layout>
//     );
// }
 
// export default Main;
