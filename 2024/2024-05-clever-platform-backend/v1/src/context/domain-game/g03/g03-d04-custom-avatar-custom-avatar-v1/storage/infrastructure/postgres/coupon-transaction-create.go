package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"time"
)

func (postgresRepository *postgresRepository) CouponTransactionCreate(tx *sqlx.Tx, itemId int, userId string) error {
	query := `
		WITH "current_class" AS (
			SELECT
				"cs"."class_id"
			FROM "school"."class_student" cs
			INNER JOIN "class"."class" c ON "cs"."class_id" = "c"."id"
			WHERE "cs"."student_id" = $2
			ORDER BY "c"."academic_year" DESC
			LIMIT 1
		)
		INSERT INTO "teacher_item"."coupon_transaction" (
			"item_id",
			"user_id",
			"class_id",
			"status",
			"created_at"
		)
		SELECT 
    		$1::integer,     
    		$2,      
    		"class_id",
    		$3,
			$4
		FROM "current_class"
	`
	_, err := tx.Exec(query, itemId, userId, "pending", time.Now().UTC())
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
