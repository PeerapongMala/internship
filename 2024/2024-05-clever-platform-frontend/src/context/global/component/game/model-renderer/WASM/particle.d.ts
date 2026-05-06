/* tslint:disable */
/* eslint-disable */
export enum ParticleType {
  Explosion = 0,
  Smoke = 1,
  Fire = 2,
  Spark = 3,
  Ember = 4,
}
export class Particle {
  private constructor();
  free(): void;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  ax: number;
  ay: number;
  az: number;
  rotation: number;
  rotation_speed: number;
  life: number;
  max_life: number;
  opacity: number;
  fade_rate: number;
  scale: number;
  initial_scale: number;
  scale_rate: number;
  r: number;
  g: number;
  b: number;
  frame: number;
  animation_speed: number;
  frame_time: number;
  particle_type: ParticleType;
  active: boolean;
}
export class ParticleSystem {
  free(): void;
  constructor(particle_count: number, sprite_sheet_width: number, sprite_sheet_height: number);
  set_position(x: number, y: number, z: number): void;
  set_gravity(gravity: number): void;
  set_wind(x: number, z: number): void;
  create(): void;
  update(delta_time: number): boolean;
  dispose(): void;
  get_current_frame(): number;
  is_active(): boolean;
  get_particle_count(): number;
  get_active_particle_count(): number;
  get_particle_buffer(): Float32Array;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_particle_free: (a: number, b: number) => void;
  readonly __wbg_get_particle_x: (a: number) => number;
  readonly __wbg_set_particle_x: (a: number, b: number) => void;
  readonly __wbg_get_particle_y: (a: number) => number;
  readonly __wbg_set_particle_y: (a: number, b: number) => void;
  readonly __wbg_get_particle_z: (a: number) => number;
  readonly __wbg_set_particle_z: (a: number, b: number) => void;
  readonly __wbg_get_particle_vx: (a: number) => number;
  readonly __wbg_set_particle_vx: (a: number, b: number) => void;
  readonly __wbg_get_particle_vy: (a: number) => number;
  readonly __wbg_set_particle_vy: (a: number, b: number) => void;
  readonly __wbg_get_particle_vz: (a: number) => number;
  readonly __wbg_set_particle_vz: (a: number, b: number) => void;
  readonly __wbg_get_particle_ax: (a: number) => number;
  readonly __wbg_set_particle_ax: (a: number, b: number) => void;
  readonly __wbg_get_particle_ay: (a: number) => number;
  readonly __wbg_set_particle_ay: (a: number, b: number) => void;
  readonly __wbg_get_particle_az: (a: number) => number;
  readonly __wbg_set_particle_az: (a: number, b: number) => void;
  readonly __wbg_get_particle_rotation: (a: number) => number;
  readonly __wbg_set_particle_rotation: (a: number, b: number) => void;
  readonly __wbg_get_particle_rotation_speed: (a: number) => number;
  readonly __wbg_set_particle_rotation_speed: (a: number, b: number) => void;
  readonly __wbg_get_particle_life: (a: number) => number;
  readonly __wbg_set_particle_life: (a: number, b: number) => void;
  readonly __wbg_get_particle_max_life: (a: number) => number;
  readonly __wbg_set_particle_max_life: (a: number, b: number) => void;
  readonly __wbg_get_particle_opacity: (a: number) => number;
  readonly __wbg_set_particle_opacity: (a: number, b: number) => void;
  readonly __wbg_get_particle_fade_rate: (a: number) => number;
  readonly __wbg_set_particle_fade_rate: (a: number, b: number) => void;
  readonly __wbg_get_particle_scale: (a: number) => number;
  readonly __wbg_set_particle_scale: (a: number, b: number) => void;
  readonly __wbg_get_particle_initial_scale: (a: number) => number;
  readonly __wbg_set_particle_initial_scale: (a: number, b: number) => void;
  readonly __wbg_get_particle_scale_rate: (a: number) => number;
  readonly __wbg_set_particle_scale_rate: (a: number, b: number) => void;
  readonly __wbg_get_particle_r: (a: number) => number;
  readonly __wbg_set_particle_r: (a: number, b: number) => void;
  readonly __wbg_get_particle_g: (a: number) => number;
  readonly __wbg_set_particle_g: (a: number, b: number) => void;
  readonly __wbg_get_particle_b: (a: number) => number;
  readonly __wbg_set_particle_b: (a: number, b: number) => void;
  readonly __wbg_get_particle_frame: (a: number) => number;
  readonly __wbg_set_particle_frame: (a: number, b: number) => void;
  readonly __wbg_get_particle_animation_speed: (a: number) => number;
  readonly __wbg_set_particle_animation_speed: (a: number, b: number) => void;
  readonly __wbg_get_particle_frame_time: (a: number) => number;
  readonly __wbg_set_particle_frame_time: (a: number, b: number) => void;
  readonly __wbg_get_particle_particle_type: (a: number) => number;
  readonly __wbg_set_particle_particle_type: (a: number, b: number) => void;
  readonly __wbg_get_particle_active: (a: number) => number;
  readonly __wbg_set_particle_active: (a: number, b: number) => void;
  readonly __wbg_particlesystem_free: (a: number, b: number) => void;
  readonly particlesystem_new: (a: number, b: number, c: number) => number;
  readonly particlesystem_set_position: (a: number, b: number, c: number, d: number) => void;
  readonly particlesystem_set_gravity: (a: number, b: number) => void;
  readonly particlesystem_set_wind: (a: number, b: number, c: number) => void;
  readonly particlesystem_create: (a: number) => void;
  readonly particlesystem_update: (a: number, b: number) => number;
  readonly particlesystem_dispose: (a: number) => void;
  readonly particlesystem_get_current_frame: (a: number) => number;
  readonly particlesystem_is_active: (a: number) => number;
  readonly particlesystem_get_particle_count: (a: number) => number;
  readonly particlesystem_get_active_particle_count: (a: number) => number;
  readonly particlesystem_get_particle_buffer: (a: number) => any;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
