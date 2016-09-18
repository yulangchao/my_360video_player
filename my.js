		
		var texture_placeholder,
		isUserInteracting = false,
		onMouseDownMouseX = 0, onMouseDownMouseY = 0,
		lon = 0, onMouseDownLon = 0,
		lat = 0, onMouseDownLat = 0,
		phi = 0, theta = 0;

		window.onload = function() {
			
			var URL = window.URL || window.webkitURL;

			var video = document.createElement("video");
			video.width = 320;
			video.height = 240;
			

			
			var width = 800;
			var height = 600;
			var fov = 45;
			var near = 1;
			var far = 10000;


			var container, mesh;

			container = document.getElementById( 'webgl' );
			
		    var	renderer = new THREE.WebGLRenderer();
			var camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
			
			camera.target = new THREE.Vector3( 0, 0, 0 );
			
			var scene = new THREE.Scene();
			
			scene.add(camera);
			//camera.position.z = 600;
			
			renderer.setSize( width, height );
			document.getElementById("webgl").appendChild(renderer.domElement);
			
			var light = new THREE.AmbientLight(0xffffff);
			scene.add(light);
			var texture = new THREE.Texture(video);
			var material = new THREE.MeshLambertMaterial({
				map: texture,
				side: THREE.DoubleSide
			});
			mesh=new THREE.Mesh(new THREE.SphereGeometry( 955, 50, 50 ),material);
			mesh.scale.x = -2;
			scene.add(mesh);	
			

			document.addEventListener( 'mousedown', onDocumentMouseDown, false );
			document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			document.addEventListener( 'mouseup', onDocumentMouseUp, false );
			window.addEventListener( 'resize', onWindowResize, false );
			

		//---------------------------------------------------------------------------------	
			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseDown( event ) {

				event.preventDefault();

				isUserInteracting = true;

				onPointerDownPointerX = event.clientX;
				onPointerDownPointerY = event.clientY;

				onPointerDownLon = lon;
				onPointerDownLat = lat;

			}

			function onDocumentMouseMove( event ) {

				if ( isUserInteracting ) {

					lon = ( onPointerDownPointerX - event.clientX ) * 0.1 + onPointerDownLon;
					lat = ( event.clientY - onPointerDownPointerY ) * 0.1 + onPointerDownLat;

				}
			}

			function onDocumentMouseUp( event ) {

				isUserInteracting = false;

			}

				
			function render() {
				if (video.readyState == video.HAVE_ENOUGH_DATA) {
					texture.needsUpdate = true;
				}
				renderer.clear();
				
				lat = Math.max( - 85, Math.min( 85, lat ) );
				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );

				camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
				camera.target.y = 500 * Math.cos( phi );
				camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

				camera.lookAt(camera.target );
					
				renderer.render(scene, camera);	
			}
			
			function animate() {
				requestAnimationFrame(animate);
				render();
				
			}
			
			animate();
			
			var file = document.getElementById("file");
			var old_url;
			document.getElementById("submit").onclick = function() {
				if (file.files.length) {
					if (old_url) {
						URL.revokeObjectURL(old_url);
					}
					old_url = URL.createObjectURL(file.files[0]);
					video.src = old_url;
					video.load();
					video.play();
				}
			};
			document.getElementById("play").onclick = function() {
				video.play();
			};
			document.getElementById("pause").onclick = function() {
				video.pause();
			};
		}
			