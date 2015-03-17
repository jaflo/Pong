$(document).ready(function() {
	init();
	animate();
	function init() {
		score = 0;
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
		camera.position.z = 1000;
		scene = new THREE.Scene();
		geometry = new THREE.BoxGeometry(20, 200, 200);
		material = new THREE.MeshLambertMaterial({
			color: 0xffffff,
			//wireframe: true
		});
		paddle1 = new THREE.Mesh(geometry, material);
		paddle1.translateX(-400);
		scene.add(paddle1);
		paddle2 = new THREE.Mesh(geometry, material);
		paddle2.translateX(400);
		scene.add(paddle2);
		geometry = new THREE.BoxGeometry(20, 20, 20);
		ball = new THREE.Mesh(geometry, material);
		scene.add(ball);
		ambientLight = new THREE.AmbientLight(0x0000ff);
		scene.add(ambientLight);
		directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 1, 1).normalize();
		scene.add(directionalLight);
		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		document.body.appendChild(renderer.domElement);
		ballVx = random(7, 10);
		ballVy = random(-1, 1);
	}
	Leap.loop(function(frame) {
		frame.hands.forEach(function(hand, index) {
			var me = index==1 ? paddle1 : paddle2;
			me.position.x = hand.screenPosition()[0]-300;
			//if (Math.abs(me.position.y - ball.position.y)>10)
			me.position.y = -hand.screenPosition()[1]-300;
		});
		if (frame.hands.length !== 2) pause();
		else play();
	}).use('screenPosition', {scale: 1});
	function random(min, max) {
		return Math.random() * (max - min) + min;
	}
	var paused = false;
	function pause() {
		paused = true;
		$("#title").removeClass("up");
	}
	function play() {
		paused = false;
		$("#title").addClass("up");
	}
	function animate() {
		var debug = "", off;
		requestAnimationFrame(animate);
		if (!paused) {
			debug += "V<sub>x</sub>: ";
			debug += ballVx+"<br />V<sub>y</sub>: ";
			debug += ballVy+"<br />";
			debug += Math.round(ball.position.x)+", ";
			debug += Math.round(ball.position.y)+"<br />";
			var paddle = false;
			if (ball.position.x-20 < paddle1.position.x) paddle = paddle1;
			else if (ball.position.x+20 > paddle2.position.x) paddle = paddle2;
			if (paddle) {
				if (ball.position.y < paddle.position.y+100 &&
					ball.position.y > paddle.position.y-100) {
					// Ball has hit a paddle
					ballVx *= -1;
					off = ball.position.y - paddle.position.y;
					ballVy = (off/100);
					score++;
				}
			}
			$("#score").text(score);
			var thresh = 0;
			if (ball.position.x < paddle1.position.x-thresh ||
				ball.position.x > paddle2.position.x+thresh) {
				ball.position.x = ball.position.y = 0;
				ballVx = random(7, 10);
				ballVy = random(-1, 1);
				score = 0;
			}
			ball.position.x += ballVx;
			ball.position.y += ballVy;
		}
		renderer.render(scene, camera);
		//$("#debug").html(debug);
	}
});