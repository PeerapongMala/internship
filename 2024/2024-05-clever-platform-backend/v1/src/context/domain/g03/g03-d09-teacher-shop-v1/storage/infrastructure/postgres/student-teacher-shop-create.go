package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudentTeacherShopCreate(tx *sqlx.Tx, teacherShopItemId int, studentId string) error {
	query := `
		INSERT INTO "teacher_store"."student_teacher_shop" (
			"teacher_shop_item_id",
			"user_id"
		)		
		VALUES ($1, $2)
	`
	_, err := tx.Exec(query, teacherShopItemId, studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
