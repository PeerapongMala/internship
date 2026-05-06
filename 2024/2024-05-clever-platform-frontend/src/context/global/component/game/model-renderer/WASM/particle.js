let wasm;

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_2.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}
/**
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const ParticleType = Object.freeze({
    Explosion: 0, "0": "Explosion",
    Smoke: 1, "1": "Smoke",
    Fire: 2, "2": "Fire",
    Spark: 3, "3": "Spark",
    Ember: 4, "4": "Ember",
});

const ParticleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_particle_free(ptr >>> 0, 1));

export class Particle {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParticleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_particle_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get x() {
        const ret = wasm.__wbg_get_particle_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set x(arg0) {
        wasm.__wbg_set_particle_x(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get y() {
        const ret = wasm.__wbg_get_particle_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set y(arg0) {
        wasm.__wbg_set_particle_y(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get z() {
        const ret = wasm.__wbg_get_particle_z(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set z(arg0) {
        wasm.__wbg_set_particle_z(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get vx() {
        const ret = wasm.__wbg_get_particle_vx(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set vx(arg0) {
        wasm.__wbg_set_particle_vx(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get vy() {
        const ret = wasm.__wbg_get_particle_vy(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set vy(arg0) {
        wasm.__wbg_set_particle_vy(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get vz() {
        const ret = wasm.__wbg_get_particle_vz(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set vz(arg0) {
        wasm.__wbg_set_particle_vz(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get ax() {
        const ret = wasm.__wbg_get_particle_ax(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set ax(arg0) {
        wasm.__wbg_set_particle_ax(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get ay() {
        const ret = wasm.__wbg_get_particle_ay(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set ay(arg0) {
        wasm.__wbg_set_particle_ay(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get az() {
        const ret = wasm.__wbg_get_particle_az(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set az(arg0) {
        wasm.__wbg_set_particle_az(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get rotation() {
        const ret = wasm.__wbg_get_particle_rotation(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set rotation(arg0) {
        wasm.__wbg_set_particle_rotation(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get rotation_speed() {
        const ret = wasm.__wbg_get_particle_rotation_speed(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set rotation_speed(arg0) {
        wasm.__wbg_set_particle_rotation_speed(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get life() {
        const ret = wasm.__wbg_get_particle_life(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set life(arg0) {
        wasm.__wbg_set_particle_life(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get max_life() {
        const ret = wasm.__wbg_get_particle_max_life(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set max_life(arg0) {
        wasm.__wbg_set_particle_max_life(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get opacity() {
        const ret = wasm.__wbg_get_particle_opacity(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set opacity(arg0) {
        wasm.__wbg_set_particle_opacity(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get fade_rate() {
        const ret = wasm.__wbg_get_particle_fade_rate(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set fade_rate(arg0) {
        wasm.__wbg_set_particle_fade_rate(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get scale() {
        const ret = wasm.__wbg_get_particle_scale(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set scale(arg0) {
        wasm.__wbg_set_particle_scale(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get initial_scale() {
        const ret = wasm.__wbg_get_particle_initial_scale(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set initial_scale(arg0) {
        wasm.__wbg_set_particle_initial_scale(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get scale_rate() {
        const ret = wasm.__wbg_get_particle_scale_rate(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set scale_rate(arg0) {
        wasm.__wbg_set_particle_scale_rate(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get r() {
        const ret = wasm.__wbg_get_particle_r(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set r(arg0) {
        wasm.__wbg_set_particle_r(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get g() {
        const ret = wasm.__wbg_get_particle_g(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set g(arg0) {
        wasm.__wbg_set_particle_g(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get b() {
        const ret = wasm.__wbg_get_particle_b(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set b(arg0) {
        wasm.__wbg_set_particle_b(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get frame() {
        const ret = wasm.__wbg_get_particle_frame(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set frame(arg0) {
        wasm.__wbg_set_particle_frame(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get animation_speed() {
        const ret = wasm.__wbg_get_particle_animation_speed(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set animation_speed(arg0) {
        wasm.__wbg_set_particle_animation_speed(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get frame_time() {
        const ret = wasm.__wbg_get_particle_frame_time(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set frame_time(arg0) {
        wasm.__wbg_set_particle_frame_time(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {ParticleType}
     */
    get particle_type() {
        const ret = wasm.__wbg_get_particle_particle_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {ParticleType} arg0
     */
    set particle_type(arg0) {
        wasm.__wbg_set_particle_particle_type(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {boolean}
     */
    get active() {
        const ret = wasm.__wbg_get_particle_active(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set active(arg0) {
        wasm.__wbg_set_particle_active(this.__wbg_ptr, arg0);
    }
}

const ParticleSystemFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_particlesystem_free(ptr >>> 0, 1));

export class ParticleSystem {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParticleSystemFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_particlesystem_free(ptr, 0);
    }
    /**
     * @param {number} particle_count
     * @param {number} sprite_sheet_width
     * @param {number} sprite_sheet_height
     */
    constructor(particle_count, sprite_sheet_width, sprite_sheet_height) {
        const ret = wasm.particlesystem_new(particle_count, sprite_sheet_width, sprite_sheet_height);
        this.__wbg_ptr = ret >>> 0;
        ParticleSystemFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @param {number} z
     */
    set_position(x, y, z) {
        wasm.particlesystem_set_position(this.__wbg_ptr, x, y, z);
    }
    /**
     * @param {number} gravity
     */
    set_gravity(gravity) {
        wasm.particlesystem_set_gravity(this.__wbg_ptr, gravity);
    }
    /**
     * @param {number} x
     * @param {number} z
     */
    set_wind(x, z) {
        wasm.particlesystem_set_wind(this.__wbg_ptr, x, z);
    }
    create() {
        wasm.particlesystem_create(this.__wbg_ptr);
    }
    /**
     * @param {number} delta_time
     * @returns {boolean}
     */
    update(delta_time) {
        const ret = wasm.particlesystem_update(this.__wbg_ptr, delta_time);
        return ret !== 0;
    }
    dispose() {
        wasm.particlesystem_dispose(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    get_current_frame() {
        const ret = wasm.particlesystem_get_current_frame(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {boolean}
     */
    is_active() {
        const ret = wasm.particlesystem_is_active(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get_particle_count() {
        const ret = wasm.particlesystem_get_particle_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    get_active_particle_count() {
        const ret = wasm.particlesystem_get_active_particle_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {Float32Array}
     */
    get_particle_buffer() {
        const ret = wasm.particlesystem_get_particle_buffer(this.__wbg_ptr);
        return ret;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.call(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_crypto_574e78ad8b13b65f = function(arg0) {
        const ret = arg0.crypto;
        return ret;
    };
    imports.wbg.__wbg_getRandomValues_b8f5dbd5f3995a9e = function() { return handleError(function (arg0, arg1) {
        arg0.getRandomValues(arg1);
    }, arguments) };
    imports.wbg.__wbg_msCrypto_a61aeb35a24c1329 = function(arg0) {
        const ret = arg0.msCrypto;
        return ret;
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354 = function(arg0, arg1, arg2) {
        const ret = new Float32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
        const ret = new Uint8Array(arg0 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_node_905d3e251edff8a2 = function(arg0) {
        const ret = arg0.node;
        return ret;
    };
    imports.wbg.__wbg_process_dc0fbacc7c1c06f7 = function(arg0) {
        const ret = arg0.process;
        return ret;
    };
    imports.wbg.__wbg_randomFillSync_ac0988aba3254290 = function() { return handleError(function (arg0, arg1) {
        arg0.randomFillSync(arg1);
    }, arguments) };
    imports.wbg.__wbg_require_60cc747a6bc5215a = function() { return handleError(function () {
        const ret = module.require;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
        const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_versions_c01dfd4722a88165 = function(arg0) {
        const ret = arg0.versions;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_2;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_string = function(arg0) {
        const ret = typeof(arg0) === 'string';
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('particle_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
