package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"

func (postgresRepository *postgresRepository) TeacherShopUpdateStatus(storeItemId int, c constant.ShopItemStatusRequest) (r constant.ShopItemEntity, err error) {
	query := `
			UPDATE "teacher_store"."teacher_store_item" 
			SET 
				status = $1 ,
				updated_at= NOW(),
				updated_by= $2
			WHERE id = $3 
			RETURNING *
		`
	err = postgresRepository.Database.QueryRowx(query, c.Status, c.UpdatedBy, storeItemId).StructScan(&r)
	if err != nil {
		return r, err
	}

	return r, nil
}
