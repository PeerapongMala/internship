package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ShopTransactionCreate(tx *sqlx.Tx, transaction *constant.TeacherStoreTransactionEntity) error {
	query := `
		INSERT INTO "teacher_store"."teacher_store_transaction" (
			"teacher_store_item_id",
			"student_id",
			"status",
			"bought_at"
		)
		VALUES ($1, $2, $3, $4)
	`
	_, err := tx.Exec(query, transaction.TeacherStoreItemId, transaction.StudentId, transaction.Status, transaction.BoughtAt)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
