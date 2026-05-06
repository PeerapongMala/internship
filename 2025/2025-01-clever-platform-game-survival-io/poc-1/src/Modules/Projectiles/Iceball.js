import ProjectileHandler from "../../Classes/ProjectileHandler";
import * as THREE from "three"; // Ensure THREE is imported

class Iceball extends ProjectileHandler {
    constructor(
        { spawnposition = { x: 0, y: 0, z: 0 }, angle = 0, ProjectileOwner = window.PlayerCharacter, speed = 0.05 } = {}
    ) {
        console.log("subclass ", ProjectileOwner);
        super(spawnposition, 'blue', ProjectileOwner);
        this.damage = 5; // ปรับค่าความเสียหายตามต้องการ
        this.speed = speed; // ปรับค่าความเร็วให้หมุนคงที่
        this.angle = angle; // เก็บค่า angle

        

        this.DisplayModel.OnTouch = function (TouchFrom) {
            if (TouchFrom.IsEnemy) {
                TouchFrom.IsDied = true;
                return;
            }
        };

        this.DisplayModel.OnUpdate = () => {
            if (ProjectileOwner && ProjectileOwner.position) {
                const radius = 5; // รัศมีการหมุน
                this.angle += this.speed; // ปรับมุมตามความเร็วที่กำหนดไว้
                this.DisplayModel.position.x = ProjectileOwner.position.x + radius * Math.cos(this.angle);
                this.DisplayModel.position.z = ProjectileOwner.position.z + radius * Math.sin(this.angle);
            } else {
                console.error("ProjectileOwner or its position is undefined.");
            }
        };
    }
}

export { Iceball };