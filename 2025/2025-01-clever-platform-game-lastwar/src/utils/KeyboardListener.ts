import { Cube } from './CubeUtility';

interface KeyState {
  pressed: boolean;
}

interface KeyStates {
  a: KeyState;
  d: KeyState;
  s: KeyState;
  w: KeyState;
  [key: string]: KeyState;
}

export class KeyboardListener {
  public cube: Cube;
  public keys: KeyStates;
  private isEnabled: boolean;

  constructor(cube: Cube) {
    this.cube = cube;
    this.isEnabled = true;
    this.keys = {
      a: { pressed: false },
      d: { pressed: false },
      s: { pressed: false },
      w: { pressed: false },
    };

    this.init();
  }

  public processUpdate(): void {
    if (!this.isEnabled) return;

    this.cube.velocity.x = 0;
    this.cube.velocity.z = 0;

    if (this.keys.a.pressed) this.cube.velocity.x = -0.05;
    else if (this.keys.d.pressed) this.cube.velocity.x = 0.05;

    if (this.keys.s.pressed) this.cube.velocity.z = 0.05;
    else if (this.keys.w.pressed) this.cube.velocity.z = -0.05;
  }

  private init(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    switch (event.key.toLowerCase()) {
      case 'a':
      case 'd':
      case 's':
      case 'w':
        this.keys[event.key.toLowerCase()].pressed = true;
        break;
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    if (!this.isEnabled) return;

    switch (event.key.toLowerCase()) {
      case 'a':
      case 'd':
      case 's':
      case 'w':
        this.keys[event.key.toLowerCase()].pressed = false;
        break;
    }
  }

  public enable(): void {
    this.isEnabled = true;
  }

  public disable(): void {
    this.isEnabled = false;
    Object.keys(this.keys).forEach((key) => {
      this.keys[key].pressed = false;
    });
  }

  public cleanup(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}
