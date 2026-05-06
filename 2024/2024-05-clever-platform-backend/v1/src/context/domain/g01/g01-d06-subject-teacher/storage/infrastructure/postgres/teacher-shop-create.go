package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d06-subject-teacher/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) TeacherShopCreate(tx *sqlx.Tx, teacherShops []constant.TeacherItemGroupEntity) error {
	if len(teacherShops) <= 0 {
		return nil
	}

	log.Println("test")
	args := []interface{}{}
	query := []string{}
	for i, teacherShop := range teacherShops {
		query = append(query, fmt.Sprintf(` ($%d, $%d)`, i*2+1, i*2+2))
		args = append(args, teacherShop.SubjectId, teacherShop.TeacherId)
	}

	insertQuery := fmt.Sprintf(`
		INSERT INTO "teacher_store"."teacher_store" (
			"subject_id",
			"teacher_id"
		)
		VALUES %s
		ON CONFLICT ("subject_id", "teacher_id") DO NOTHING
	`, strings.Join(query, ","))
	_, err := tx.Exec(insertQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
