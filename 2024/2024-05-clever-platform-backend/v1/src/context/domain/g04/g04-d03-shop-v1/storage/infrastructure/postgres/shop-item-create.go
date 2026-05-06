package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
)

func (postgresRepository *postgresRepository) AddShopItem(c constant.ShopItemRequest) (r constant.ShopItemEntity, err error) {

	query := `INSERT INTO "teacher_store"."teacher_store_item"
			(
				item_id,
				initial_stock,
				stock,
				price,
				status,
				open_date,
				closed_date,
				created_by,
				created_at
			)
			VALUES
			(
				$1,
				$2,
				$3,
				$4,
				$5,
				$6,
				$7,
				$8,
				NOW()
			)
  			RETURNING *`
	err = postgresRepository.Database.QueryRowx(query,
		c.ItemId,
		c.Stock,
		c.Stock,
		c.Price,
		c.Status,
		c.OpenDate,
		c.ClosedDate,
		c.CreatedBy).StructScan(&r)

	if err != nil {
		return r, err
	}

	return r, nil

}
