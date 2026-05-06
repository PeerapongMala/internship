import * as THREE from 'three';

type Particle = {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  alive: boolean;
  age: number;
  maxAge: number;
  size: number;
  color: THREE.Color;
  rotationSpeed: number; // หมุนนิดๆ ให้ดูมีชีวิต
  angle: number; // สำหรับหัวใจ
};

export function CreateNewExplosionCakeLove(position: THREE.Vector3, scene: THREE.Scene) {
  const numParticles = 250;

  const pastelColors = [
    new THREE.Color(0xffb3ba), // ชมพู
    new THREE.Color(0xbae1ff), // ฟ้า
    new THREE.Color(0xd5b3ff), // ม่วง
    new THREE.Color(0xbaffc9), // เขียวมิ้นต์
    new THREE.Color(0xfff5ba), // เหลืองครีม
  ];

  //  สร้าง particle ให้กระจายตามรูปหัวใจ
  const particles: Particle[] = [];
  for (let i = 0; i < numParticles; i++) {
    const t = (i / numParticles) * Math.PI * 2; //สำหรับหัวใจ
    const heartScale = 0.4; // ขนาดหัวใจ

    // สมการหัวใจ (scaled ลง + ปรับให้ดูเป็นธรรมชาติ)
    const x = 16 * Math.pow(Math.sin(t), 3) * heartScale;
    const y =
      (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) *
      heartScale;

    // กระจายแบบ radial ออกจากศูนย์กลาง + randomness นิดหน่อย
    const spread = Math.random() * 0.3;
    const angle = Math.random() * Math.PI * 2;
    const offsetX = Math.cos(angle) * spread;
    const offsetZ = Math.sin(angle) * spread;

    const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
    particles.push({
      position: new THREE.Vector3(
        position.x + x + offsetX,
        position.y + y + (Math.random() * 0.3 - 0.15),
        position.z + offsetZ,
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        Math.random() * 1.2 + 0.3, // ลอยขึ้นช้าๆ
        (Math.random() - 0.5) * 0.8,
      ),
      alive: true,
      age: 0,
      maxAge: Math.random() * 2.5 + 1.5, // ลอยนานขึ้น
      size: Math.random() * 0.12 + 0.08,
      color: color.clone(),
      rotationSpeed: (Math.random() - 0.5) * 0.5, // หมุนนิดๆ
      angle: t, // เก็บค่ามุมไว้ใช้ถ้าอยาก animate หัวใจต่อ
    });
  }

  //  Geometry + Attributes
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(numParticles * 3);
  const colors = new Float32Array(numParticles * 3);
  const sizes = new Float32Array(numParticles);

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  //  Shader Material พร้อม texture กลม
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: { value: createCircleTexture() },
      opacity: { value: 1.0 },
      time: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      uniform float time;
      varying vec3 vColor;
      void main() {
        vColor = color;
        // หมุนนิดๆ รอบแกน Y
        float angle = time * 0.5;
        mat3 rotY = mat3(
          cos(angle), 0, -sin(angle),
          0, 1, 0,
          sin(angle), 0, cos(angle)
        );
        vec3 p = position * rotY;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform sampler2D pointTexture;
      uniform float opacity;
      varying vec3 vColor;
      void main() {
        vec4 tex = texture2D(pointTexture, gl_PointCoord);
        if (tex.r < 0.1) discard;
        gl_FragColor = vec4(vColor, opacity * tex.r);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particlePoints = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particlePoints);

  //  Texture กลมนุ่ม
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.7, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  //  Animation Loop
  let lastTime = performance.now();
  function animate() {
    const currentTime = performance.now();
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    let aliveCount = 0;
    const gravity = new THREE.Vector3(0, -2.0, 0);

    for (let i = 0; i < numParticles; i++) {
      const p = particles[i];
      if (!p.alive) continue;

      p.velocity.multiplyScalar(0.993); // ช้าลงแบบเนียน
      p.velocity.addScaledVector(gravity, delta);
      p.position.addScaledVector(p.velocity, delta);
      p.age += delta;

      if (p.age > p.maxAge) {
        p.alive = false;
      } else {
        positions[aliveCount * 3] = p.position.x;
        positions[aliveCount * 3 + 1] = p.position.y;
        positions[aliveCount * 3 + 2] = p.position.z;

        colors[aliveCount * 3] = p.color.r;
        colors[aliveCount * 3 + 1] = p.color.g;
        colors[aliveCount * 3 + 2] = p.color.b;

        const lifeRatio = 1 - p.age / p.maxAge;
        sizes[aliveCount] = p.size * (0.6 + 0.4 * lifeRatio);

        aliveCount++;
      }
    }

    particleGeometry.setDrawRange(0, aliveCount);
    particleGeometry.attributes.position.needsUpdate = true;
    particleGeometry.attributes.color.needsUpdate = true;
    particleGeometry.attributes.size.needsUpdate = true;

    // fade ทั้งกลุ่มแบบนุ่ม
    particleMaterial.uniforms.opacity.value = Math.max(
      0.1,
      (aliveCount / numParticles) * 0.9,
    );
    particleMaterial.uniforms.time.value += delta; // หมุนนิดๆ

    if (aliveCount > 0) {
      requestAnimationFrame(animate);
    } else {
      scene.remove(particlePoints);
      particleGeometry.dispose();
      particleMaterial.dispose();
    }
  }
  // ใส่ก่อน animate()
  const candle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.3, 8),
    new THREE.MeshBasicMaterial({ color: 0xffee99 }),
  );
  candle.position.copy(position);
  candle.position.y += 0.5;
  scene.add(candle);

  // แล้วลบออกตอน animate เริ่มทำงาน
  setTimeout(() => {
    scene.remove(candle);
  }, 300); // ให้เห็นเทียนแวบๆ ก่อนระเบิด

  animate();
}
