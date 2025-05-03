/**
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/westlangley
 * @author Mugen87 / https://github.com/Mugen87
 *
 * OrbitControls.js
 * - You can control a camera using mouse, touch and keyboard events
 */

THREE.OrbitControls = function (object, domElement) {

	var scope = this;

	// API

	this.object = object;
	this.domElement = (domElement !== undefined) ? domElement : document;

	// Set to true to enable damping (inertia)
	this.enableDamping = false;
	this.dampingFactor = 0.25;

	// Set to true to automatically rotate around the object when the mouse is idle
	this.auto-rotate = false;
	this.auto-rotate-speed = 2.0; // 30 seconds for a full rotation when auto-rotating
	this.enableZoom = true;
	this.enablePan = true;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.maxPolarAngle = Math.PI / 2;

	// Internals
	var theta = 0;
	var phi = 0;
	var distance = 0;
	var offset = new THREE.Vector3();
	var quat = new THREE.Quaternion();
	var scale = 1;
	var panOffset = new THREE.Vector3();
	var lastPosition = new THREE.Vector3();
	var spherical = new THREE.Spherical();
	var zoomChanged = false;

	// Update the camera to the correct position
	var update = function () {
		spherical.theta = theta;
		spherical.phi = phi;
		spherical.radius = distance;

		offset.setFromSpherical(spherical);

		// Apply the offset to the camera's position
		object.position.copy(offset).add(object.target);
		object.lookAt(object.target);
	};

	// Set to true to automatically update the camera
	this.update = function () {
		update();
	};

};
