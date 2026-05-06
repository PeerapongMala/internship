package postgres

import (
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudyGroupTeacherShopCreate(tx *sqlx.Tx, teacherShopItemId int, studyGroupId int) error {
	query := `
		INSERT INTO "teacher_store"."study_group_teacher_shop" (
			"teacher_shop_item_id",
			"study_group_id"
		)		
		VALUES ($1, $2)
	`
	_, err := tx.Exec(query, teacherShopItemId, studyGroupId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return nil
}
