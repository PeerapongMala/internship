package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
)

func (p *postgresRepository) GetInventoryInfoByUserId(userId string) (*constant.InventoryEntity, error) {
	var inventory constant.InventoryEntity
	query := `
        	SELECT 
            		inv.id,
            		stu.student_id,
            		inv.gold_coin,
            		inv.arcade_coin,
            		inv.ice
        	FROM 
            		"user"."student" stu
        	JOIN 
            		"inventory"."inventory" inv 
            	ON 	stu.user_id = inv.student_id
        	WHERE 
            		stu.user_id = $1;
    	`
	err := p.Database.Get(&inventory, query, userId)
	if err != nil {
		return nil, err
	}
	return &inventory, nil
}
