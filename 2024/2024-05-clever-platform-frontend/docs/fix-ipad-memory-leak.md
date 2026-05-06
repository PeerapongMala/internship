# แก้ไขปัญหา iPad Gen 6 Crash เมื่อเปลี่ยนตัวละคร

## ปัญหา

- iPad Gen 6 (2GB RAM) crash/refresh เมื่อเปลี่ยนตัวละครไปมาในหน้า **ร้านค้า** และ **คลัง**
- ก่อนแก้: crash หลังเปลี่ยน 2-3 ครั้ง
- สาเหตุ: Memory leak จาก Three.js models และ textures ไม่ถูก dispose

---

## สาเหตุของ Memory Leak (ก่อนแก้)

### ปัญหาที่ 1: ไม่มีการ Dispose Resources

```
ก่อนแก้:
- โหลด Model A → ใช้ memory 5 MB
- โหลด Model B → ใช้ memory 5 MB (Model A ยังอยู่ใน memory)
- โหลด Model C → ใช้ memory 5 MB (Model A, B ยังอยู่)
- ... memory สะสมไปเรื่อยๆ จน crash
```

### ปัญหาที่ 2: สร้าง GLTFLoader ใหม่ทุกครั้ง

```typescript
// ก่อนแก้ - สร้าง loader ใหม่ทุกครั้งที่โหลด model
const loader = new GLTFLoader(); // memory leak!
```

### ปัญหาที่ 3: THREE.Cache ไม่ถูก clear

- Three.js เก็บ cache ของ textures/models ไว้ใน `THREE.Cache`
- ถ้าไม่ clear จะใช้ memory สะสม

---

## การแก้ไข

### 1. Model Cache Limit (Code)

**ไฟล์:** `src/context/global/component/code/atom/cc-a-model-loader/Shop-CustomAvatarModelLoader.ts`

เพิ่มระบบ cache จำกัด 1 model ใน memory:

```typescript
// === MODEL CACHE LIMIT SYSTEM ===
const MAX_MODELS_IN_MEMORY = 1;
const loadedModelsCache: Array<{ name: string; object: THREE.Object3D }> = [];

function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse((child: any) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      // dispose materials and textures
    }
  });
}

function addToModelCache(name: string, object: THREE.Object3D, scene: THREE.Scene) {
  // ถ้าเกิน limit จะลบ model เก่าที่สุดออกอัตโนมัติ
  while (loadedModelsCache.length > MAX_MODELS_IN_MEMORY) {
    const oldest = loadedModelsCache.shift();
    if (oldest) {
      disposeObject3D(oldest.object);
      scene.remove(oldest.object);
      THREE.Cache.clear();
    }
  }
}
```

**Flow การทำงาน:**

```
โหลด Model A → cache: [A] (1 model)
โหลด Model B → ลบ A ออก → cache: [B] (1 model)
โหลด Model C → ลบ B ออก → cache: [C] (1 model)
```

---

### 2. Singleton GLTFLoader Pattern

**ก่อนแก้:** สร้าง loader ใหม่ทุกครั้ง (memory leak)

```typescript
// ❌ ก่อนแก้
function LoadGLTFCharacter() {
  const loader = new GLTFLoader(); // สร้างใหม่ทุกครั้ง!
  loader.load(...);
}
```

**หลังแก้:** ใช้ loader ตัวเดียวซ้ำ

```typescript
// ✅ หลังแก้
let sharedGLTFLoader: GLTFLoader | null = null;

function getSharedGLTFLoader(): GLTFLoader {
  if (!sharedGLTFLoader) {
    sharedGLTFLoader = new GLTFLoader();
  }
  return sharedGLTFLoader;
}

function LoadGLTFCharacter() {
  const loader = getSharedGLTFLoader(); // ใช้ตัวเดิม
  loader.load(...);
}
```

---

### 3. THREE.Cache.clear() Strategy

**เมื่อไหร่ที่ clear cache:**

1. **ก่อนโหลด model ใหม่** - ล้าง cache เก่าก่อน

```typescript
THREE.Cache.clear();
const loader = getSharedGLTFLoader();
loader.load(gltfPath, ...);
```

2. **หลัง dispose model** - ล้าง textures ที่ไม่ใช้

```typescript
disposeObject3D(oldest.object);
scene.remove(oldest.object);
THREE.Cache.clear(); // ล้าง cache หลัง dispose
```

3. **ใน dispose() method ของ GCAThreeModel classes**

```typescript
dispose = () => {
  if (this.mixer) {
    this.mixer.stopAllAction();
    this.mixer.uncacheRoot(this.mixer.getRoot());
    this.mixer = undefined;
  }
  if (this.model) {
    // dispose geometry, materials, textures
    this.model = undefined;
  }
  THREE.Cache.clear(); // ล้าง cache ตอน dispose
};
```

---

### 4. Complete Dispose Process

**ขั้นตอนการ dispose model อย่างถูกต้อง:**

```typescript
function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse((child: any) => {
    // 1. Dispose Geometry
    if (child.geometry) {
      child.geometry.dispose();
    }

    // 2. Dispose Materials & Textures
    if (child.material) {
      if (Array.isArray(child.material)) {
        child.material.forEach((mat: any) => {
          // Dispose all textures in material
          Object.keys(mat).forEach((key) => {
            if (mat[key] && mat[key].isTexture) {
              mat[key].dispose();
            }
          });
          mat.dispose();
        });
      } else {
        Object.keys(child.material).forEach((key) => {
          if (child.material[key] && child.material[key].isTexture) {
            child.material[key].dispose();
          }
        });
        child.material.dispose();
      }
    }
  });
}
```

**สิ่งที่ต้อง dispose:**
| Resource | Method |
|----------|--------|
| Geometry | `geometry.dispose()` |
| Material | `material.dispose()` |
| Texture (map, normalMap, etc.) | `texture.dispose()` |
| AnimationMixer | `mixer.stopAllAction()` + `mixer.uncacheRoot()` |
| THREE Cache | `THREE.Cache.clear()` |

---

### 5. Texture Optimization Timeline

#### ขั้นตอนที่ 1: Original Files (ก่อน optimize)

ไฟล์ GLTF ต้นฉบับจาก Blender มีขนาดใหญ่มาก (texture ไม่ได้ compress)

| Set     | จำนวนไฟล์ | ขนาด       |
| ------- | --------- | ---------- |
| Set 1   | 20        | 318 MB     |
| Set 2   | 20        | 13 MB      |
| Set 3   | 20        | 40 MB      |
| Set 4   | 20        | 14 MB      |
| Set 5   | 20        | 999 MB     |
| **รวม** | **100**   | **1.4 GB** |

#### ขั้นตอนที่ 2: Texture Lossless Compression (JPEG)

แปลง texture เป็น JPEG lossless ใน Blender แล้ว export ใหม่

| Set     | ก่อน       | หลัง       | ลดลง    |
| ------- | ---------- | ---------- | ------- |
| Set 1   | 318 MB     | 27 MB      | 91.5%   |
| Set 2   | 13 MB      | 13 MB      | 0%      |
| Set 3   | 40 MB      | 15 MB      | 62.5%   |
| Set 4   | 14 MB      | 14 MB      | 0%      |
| Set 5   | 999 MB     | 74 MB      | 92.6%   |
| **รวม** | **1.4 GB** | **141 MB** | **90%** |

#### ขั้นตอนที่ 3: GLB Conversion + Texture Resize (256x256)

ใช้ gltf-transform resize texture เป็น max 256x256 และแปลงเป็น GLB format

**คำสั่งที่ใช้:**

```bash
npx @gltf-transform/cli resize input.gltf output.glb --width 256 --height 256
```

| Set     | GLTF (หลัง step 2) | GLB (หลัง step 3) | ลดลง    |
| ------- | ------------------ | ----------------- | ------- |
| Set 1   | 27 MB              | 5.9 MB            | 78%     |
| Set 2   | 13 MB              | 9.1 MB            | 30%     |
| Set 3   | 15 MB              | 4.0 MB            | 73%     |
| Set 4   | 14 MB              | 10 MB             | 29%     |
| Set 5   | 74 MB              | 17 MB             | 77%     |
| **รวม** | **143 MB**         | **46 MB**         | **68%** |

#### สรุป Timeline ทั้งหมด

| ขั้นตอน             | ขนาดรวม           | ลดลงจากขั้นก่อนหน้า | ลดลงจาก Original |
| ------------------- | ----------------- | ------------------- | ---------------- |
| 1. Original         | 1,400 MB (1.4 GB) | -                   | -                |
| 2. JPEG Lossless    | 143 MB            | -1,257 MB (90%)     | 90%              |
| 3. GLB + Resize 256 | 46 MB             | -97 MB (68%)        | **96.7%**        |

#### เทียบขนาดแต่ละ Set (Original → JPEG → GLB)

| Set     | Original     | JPEG Lossless | ลด (1→2)  | GLB 256 Final | ลด (2→3)  | ลดจาก Original |
| ------- | ------------ | ------------- | --------- | ------------- | --------- | -------------- |
| Set 1   | 318 MB       | 27 MB         | **91.5%** | 5.9 MB        | **78.1%** | **98.1%**      |
| Set 2   | 13 MB        | 13 MB         | **0%**    | 9.1 MB        | **30.0%** | **30.0%**      |
| Set 3   | 40 MB        | 15 MB         | **62.5%** | 4.0 MB        | **73.3%** | **90.0%**      |
| Set 4   | 14 MB        | 14 MB         | **0%**    | 10 MB         | **28.6%** | **28.6%**      |
| Set 5   | 999 MB       | 74 MB         | **92.6%** | 17 MB         | **77.0%** | **98.3%**      |
| **รวม** | **1,384 MB** | **143 MB**    | **89.7%** | **46 MB**     | **67.8%** | **96.7%**      |

**หมายเหตุ:**

- **ลด (1→2):** Original → JPEG Lossless (ทำใน Blender)
- **ลด (2→3):** JPEG Lossless → GLB 256x256 (ใช้ gltf-transform resize)

```
Original        JPEG Lossless gltf 512*512         GLB 256x256
1,384 MB ────────────────────► 143 MB ────────────────► 46 MB
            -89.7%            -67.8%

            ◄────────────────────────────────────────────────────►
                        -96.7% รวม
```

---

### 6. Code: โหลด GLB สำหรับทุก Set

**ไฟล์ที่แก้:**

- `src/context/global/component/code/atom/cc-a-model-loader/Shop-CustomAvatarModelLoader.ts`
- `src/context/global/component/code/atom/cc-a-model-loader/BlobModelLoader_hide_weapon.ts`

**การแก้ไข:**

```typescript
function getLocalGLTFPath(modelKey: string): string {
  const match = modelKey.match(/set(\d+)_character(\d+)_level(\d+)/i);
  if (match) {
    const [, setNum, charNum, levelNum] = match;
    // All sets use optimized GLB files (smaller textures)
    return `/assets/model/gltf/Set${setNum}/character${charNum}/level${levelNum}.glb`;
  }
  return '/assets/model/gltf/Set1/character1/level1.glb';
}
```

---

## ไฟล์ที่เปลี่ยนแปลง

### Code Files

| ไฟล์                              | การแก้ไข                                               |
| --------------------------------- | ------------------------------------------------------ |
| `Shop-CustomAvatarModelLoader.ts` | เพิ่ม model cache limit + singleton loader + โหลด .glb |
| `BlobModelLoader_hide_weapon.ts`  | โหลด .glb                                              |

### Asset Files

| โฟลเดอร์                         | การแก้ไข                       |
| -------------------------------- | ------------------------------ |
| `public/assets/model/gltf/Set1/` | ลบ .gltf, เพิ่ม .glb (20 ไฟล์) |
| `public/assets/model/gltf/Set2/` | ลบ .gltf, เพิ่ม .glb (20 ไฟล์) |
| `public/assets/model/gltf/Set3/` | ลบ .gltf, เพิ่ม .glb (20 ไฟล์) |
| `public/assets/model/gltf/Set4/` | ลบ .gltf, เพิ่ม .glb (20 ไฟล์) |
| `public/assets/model/gltf/Set5/` | ลบ .gltf, เพิ่ม .glb (20 ไฟล์) |

---

## Standard ที่ใช้ในปัจจุบัน

| รายการ                 | ค่า                                                 |
| ---------------------- | --------------------------------------------------- |
| **Format**             | `.glb` (Binary GLTF - embedded ทุกอย่างในไฟล์เดียว) |
| **Texture Resolution** | 256 x 256 pixels (max)                              |
| **ห้าม**               | แยกไฟล์ texture (.png, .jpg) หรือ .bin ออกมา        |

---

## การ Resize GLTF ในอนาคต

ถ้าได้รับไฟล์ `.gltf` ใหม่จาก Blender ให้แปลงเป็น GLB 256x256:

1. เตรียมไฟล์ `.gltf` ที่ต้องการแก้ไข
2. รันคำสั่ง:

```bash
npx @gltf-transform/cli resize input.gltf output.glb --width 256 --height 256
```

3. วางไฟล์ `.glb` ใน `public/assets/model/gltf/SetX/characterX/`
4. **ลบไฟล์ .gltf ต้นฉบับ** (เก็บแค่ .glb)

---

## ผลการทดสอบ

| อุปกรณ์    | RAM  | ผลลัพธ์    | หมายเหตุ                           |
| ---------- | ---- | ---------- | ---------------------------------- |
| iPad Air 2 | 2 GB | ✅ ผ่าน    | ไม่ crash แล้ว                     |
| iPad Gen 6 | 2 GB | ⏳ รอทดสอบ | ถ้ายัง crash ให้ทำตามตารางด้านล่าง |

### ถ้า iPad Gen 6 ยัง Crash ให้ทำตามลำดับ

**ข้อจำกัด:**

- ✅ ต้องเป็น GLB embedded ไฟล์เดียว (ห้ามแยกไฟล์)
- ✅ สีห้ามเพี้ยน
- ❌ ห้ามลด texture resolution (เบลอเกินไป)

| ลำดับ | วิธี                             | ผลกระทบ                    | วิธีทำ                                             |
| ----- | -------------------------------- | -------------------------- | -------------------------------------------------- |
| 1     | ใช้ **KTX2 (ETC1S)** compression | ⚠️ อาจมี artifact เล็กน้อย | ต้องติดตั้ง KTX-Software + เพิ่ม KTX2Loader ในโค้ด |
| 2     | ลด **Polygon**                   | ✅ ไม่กระทบ texture        | ทำใน Blender (Decimate modifier)                   |

**KTX2 ต้องการ:**

1. ติดตั้ง [KTX-Software 4.3.0+](https://github.com/KhronosGroup/KTX-Software/releases)
2. รันคำสั่ง: `npx @gltf-transform/cli etc1s input.glb output.glb`
3. เพิ่ม KTX2Loader ในโค้ด Three.js

---

## สถานะปัจจุบัน

| รายการ      | ค่า                      |
| ----------- | ------------------------ |
| Format      | GLB embedded (ไฟล์เดียว) |
| Texture     | 256x256 (max)            |
| Model Cache | 1 model                  |

## ผลลัพธ์ที่คาดหวัง

- iPad Gen 6 สามารถเปลี่ยนตัวละครได้มากขึ้นโดยไม่ crash
- Memory usage ลดลงเพราะ:
  1. Model cache จำกัด 1 model ใน memory
  2. ทุก Set ใช้ GLB format พร้อม texture 256x256

---

## สรุป Memory Flow (หลังแก้)

```
┌─────────────────────────────────────────────────────────────────┐
│                    Memory Management Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User เลือกตัวละคร                                            │
│         │                                                        │
│         ▼                                                        │
│  2. THREE.Cache.clear() ← ล้าง cache ก่อนโหลด                    │
│         │                                                        │
│         ▼                                                        │
│  3. getSharedGLTFLoader() ← ใช้ loader ตัวเดิม (singleton)       │
│         │                                                        │
│         ▼                                                        │
│  4. โหลด .glb file (ทุก Set ใช้ GLB format)                      │
│         │                                                        │
│         ▼                                                        │
│  5. addToModelCache() ← เพิ่มเข้า cache                          │
│         │                                                        │
│         ▼                                                        │
│  6. ตรวจสอบ cache > 1 model?                                     │
│         │                                                        │
│         ├── ใช่ → disposeObject3D() + scene.remove()             │
│         │         + THREE.Cache.clear()                          │
│         │                                                        │
│         └── ไม่ → แสดง model ปกติ                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## วันที่แก้ไข

- 24 มกราคม 2026
