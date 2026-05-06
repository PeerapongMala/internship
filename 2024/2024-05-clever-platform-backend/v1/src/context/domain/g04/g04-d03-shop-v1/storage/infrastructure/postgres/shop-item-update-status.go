package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"

func (repository *postgresRepository) UpdateShopItemStatus(storeItemId int, c constant.ShopItemStatusRequest) (r constant.ShopItemEntity, err error) {
	query := `
			UPDATE "teacher_store"."teacher_store_item" 
			SET status = $1 
			WHERE id =$2
			RETURNING *
		`
	err = repository.Database.QueryRowx(query, c.Status, storeItemId).StructScan(&r)
	if err != nil {
		return r, err
	}

	return r, nil
}
