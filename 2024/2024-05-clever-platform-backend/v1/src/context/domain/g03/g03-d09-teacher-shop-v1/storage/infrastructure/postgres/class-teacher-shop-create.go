package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassTeacherShopCreate(tx *sqlx.Tx, teacherShopItemId int, classId int) error {
	query := `
		INSERT INTO "teacher_store"."class_teacher_shop" (
			"teacher_shop_item_id",
			"class_id"
		)		
		VALUES ($1, $2)
	`
	_, err := tx.Exec(query, teacherShopItemId, classId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
