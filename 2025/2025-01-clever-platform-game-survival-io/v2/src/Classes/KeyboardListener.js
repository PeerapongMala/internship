class Keyboard {
  constructor(character) {
    this.character = character;
    this.keys = {
      a: { pressed: false },
      d: { pressed: false },
      s: { pressed: false },
      w: { pressed: false },
    };
    this.isJumping = false;
    this.velocityY = 0; // ความเร็วในแนวตั้ง
    this.gravity = -0.002; // แรงโน้มถ่วง

    this.init();
  }

  init() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    switch (event.code) {
      case 'KeyA':
        this.keys.a.pressed = true;
        break;
      case 'KeyD':
        this.keys.d.pressed = true;
        break;
      case 'KeyS':
        this.keys.s.pressed = true;
        break;
      case 'KeyW':
        this.keys.w.pressed = true;
        break;
      case 'Space':
        if (!this.isJumping) {
          this.velocityY = 0.08; // ความเร็วเริ่มต้นในการกระโดด
          this.isJumping = true;
        }
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.code) {
      case 'KeyA':
        this.keys.a.pressed = false;
        break;
      case 'KeyD':
        this.keys.d.pressed = false;
        break;
      case 'KeyS':
        this.keys.s.pressed = false;
        break;
      case 'KeyW':
        this.keys.w.pressed = false;
        break;
    }
  }

  keyboardProcessUpdate() {
    if (!this.character) return; // Ensure character is defined

    if (this.keys.a.pressed) this.character.position.x -= 0.1;
    if (this.keys.d.pressed) this.character.position.x += 0.1;
    if (this.keys.s.pressed) this.character.position.z += 0.1;
    if (this.keys.w.pressed) this.character.position.z -= 0.1;

    // Apply gravity and update character position
    this.velocityY += this.gravity;
    this.character.position.y += this.velocityY;

    // Check if character is on the ground
    if (this.character.position.y <= 0) {
      this.character.position.y = 0;
      this.isJumping = false;
      this.velocityY = 0;
    }
  }
}

export { Keyboard };
