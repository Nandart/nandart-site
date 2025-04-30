// OrbitControls adapted for global THREE usage in non-module environments
(function () {
  class OrbitControls {
    constructor(object, domElement) {
      this.object = object;
      this.domElement = domElement || document;

      this.enabled = true;
      this.target = new THREE.Vector3();
      this.minDistance = 0;
      this.maxDistance = Infinity;

      this.rotateSpeed = 1.0;
      this.zoomSpeed = 1.2;
      this.panSpeed = 0.8;

      this.enableDamping = false;
      this.dampingFactor = 0.05;

      const scope = this;
      let isDragging = false;
      let previousMousePosition = { x: 0, y: 0 };

      function onMouseDown(event) {
        isDragging = true;
        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
      }

      function onMouseMove(event) {
        if (!isDragging) return;
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;

        const angleX = deltaX * 0.005 * scope.rotateSpeed;
        const angleY = deltaY * 0.005 * scope.rotateSpeed;

        scope.object.rotation.y -= angleX;
        scope.object.rotation.x -= angleY;

        previousMousePosition.x = event.clientX;
        previousMousePosition.y = event.clientY;
      }

      function onMouseUp() {
        isDragging = false;
      }

      this.domElement.addEventListener('mousedown', onMouseDown);
      this.domElement.addEventListener('mousemove', onMouseMove);
      this.domElement.addEventListener('mouseup', onMouseUp);
    }

    update() {
      // Damping and other logic if needed in future
    }
  }

  THREE.OrbitControls = OrbitControls;
})();
