package postgres

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (repo *postgresRepository) TeacherGetByUserIdAndClassroom(tx *sqlx.Tx, classRoomId int, userId string) (*constant.UserEntity, error) {
	query := `
		SELECT
			u.*
		FROM "school"."class_teacher" ct
		JOIN "user"."user" u ON ct.teacher_id = u.id
		WHERE ct.class_id = $1
		AND ct.teacher_id = $2
	`
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		queryMethod = tx.QueryRowx
	} else {
		queryMethod = repo.Database.QueryRowx
	}

	t := constant.UserEntity{}
	err := queryMethod(query, classRoomId, userId).StructScan(&t)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // return empty teacher if not found
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &t, nil
}

func (repo *postgresRepository) TeacherListGetByClassroom(classRoomId int) ([]*constant.UserEntity, error) {
	query := `
		SELECT
			u.*
		FROM "school"."class_teacher" ct
		JOIN "user"."user" u ON ct.teacher_id = u.id
		WHERE ct.class_id = $1
	`

	t := []*constant.UserEntity{}
	err := repo.Database.Select(&t, query, classRoomId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // return empty teacher if not found
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return t, nil
}
