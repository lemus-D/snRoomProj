AFRAME.registerComponent('ghost-logic', {
  init: function() {
    // 1. GET REFERENCES
    this.target = document.querySelector('#my-target');
    this.content = document.querySelector('#my-content');
    this.statusDiv = document.querySelector('#debug-status');
    
    this.isTracking = false;

    // 2. EVENT: FOUND
    this.target.addEventListener("targetFound", () => {
      this.isTracking = true;
      this.content.object3D.visible = true;
      
      // Debug UI Update
      if(this.statusDiv) {
          this.statusDiv.innerHTML = "STATUS: FOUND! (Syncing)";
          this.statusDiv.style.background = "green";
      }

      // INSTANT SNAP
      const p = this.target.object3D.position;
      const r = this.target.object3D.rotation;
      this.content.object3D.position.set(p.x, p.y, p.z);
      this.content.object3D.rotation.set(r.x, r.y, r.z);
    });

    // 3. EVENT: LOST
    this.target.addEventListener("targetLost", () => {
      this.isTracking = false;
      
      // Debug UI Update
      if(this.statusDiv) {
          this.statusDiv.innerHTML = "STATUS: GHOST MODE (Persisting)";
          this.statusDiv.style.background = "orange";
      }
    });
  },

  tick: function() {
    // 4. THE LOOP
    const prevPos = [];
    const prevRot = [];

    if (this.isTracking) {
      const targetPos = this.target.object3D.position;
      const targetRot = this.target.object3D.rotation;

      prevPos.push(targetPos);
      prevRot.push(targetRot);

      this.content.object3D.position.lerp(targetPos, 0.1); 
      this.content.object3D.rotation.x = targetRot.x;
      this.content.object3D.rotation.y = targetRot.y;
      this.content.object3D.rotation.z = targetRot.z;
    } else if (prevPos[0] != null) {
      this.content.object3D.position.lerp(prevPos[prevPos.length -1], 0.1); 
      this.content.object3D.rotation.x = prevRot[prevRot.length -1 ].x;
      this.content.object3D.rotation.y = prevRot[prevRot.length -1 ].y;
      this.content.object3D.rotation.z = prevRot[prevRot.length -1 ].z;
    }
  }
});