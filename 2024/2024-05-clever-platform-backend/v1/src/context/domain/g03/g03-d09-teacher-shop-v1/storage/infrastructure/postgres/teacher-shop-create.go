package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/jmoiron/sqlx"
)

func (postgresRepository *postgresRepository) TeacherShopCreate(tx *sqlx.Tx, c constant.ShopItemRequest, teacherId string) (*constant.ShopItemEntity, error) {

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
				created_at,
				teacher_store_id,
				limit_per_user
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
				NOW(),
				(SELECT id FROM "teacher_store"."teacher_store" WHERE teacher_id = $9 AND subject_id = $10 LIMIT 1),
				$11
			)
  			RETURNING *`

	r := &constant.ShopItemEntity{}
	err := tx.QueryRowx(
		query,
		c.ItemId,
		c.Stock,
		c.Stock,
		c.Price,
		c.Status,
		c.OpenDate,
		c.ClosedDate,
		c.CreatedBy,
		teacherId,
		c.SubjectId,
		c.LimitPerUser,
	).StructScan(r)

	if err != nil {
		return r, err
	}

	return r, nil
}
