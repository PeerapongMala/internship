package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
)

func (postgresRepository *postgresRepository) GetInventoryByStudentId(studentId string) (*constant.InventoryEntity, error) {
	inventory := constant.InventoryEntity{}
	err := postgresRepository.Database.Get(&inventory, `SELECT * FROM "inventory"."inventory" WHERE student_id = $1`, studentId)
	if err != nil {
		// if err == sql.ErrNoRows {
		// 	return nil, nil
		// }
		return nil, err // ข้อผิดพลาดอื่น ๆ ที่ไม่ใช่ ErrNoRows
	}

	return &inventory, nil
}
