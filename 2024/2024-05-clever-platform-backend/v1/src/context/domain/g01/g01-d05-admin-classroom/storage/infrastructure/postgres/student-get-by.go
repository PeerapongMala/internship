package postgres

import (
	"database/sql"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (repo *postgresRepository) StudentGetByUserIdAndClassroom(tx *sqlx.Tx, classRoomId int, userId string) (*constant.UserEntity, error) {
	query := `
		SELECT
			u.*
		FROM school.class_student cs
		JOIN "user".student s ON cs.student_id = s.user_id
		JOIN "user"."user" u ON u.id = s.user_id
		WHERE cs.class_id = $1
		AND cs.student_id = $2
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
			return nil, nil // return empty Student if not found
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return &t, nil
}

func (repo *postgresRepository) StudentListGetByClassroom(classRoomId int) ([]*constant.UserEntity, error) {
	query := `
		SELECT
			u.*
		FROM school.class_student cs
		JOIN "user".student s ON cs.student_id = s.user_id
		JOIN "user"."user" u ON u.id = s.user_id
		WHERE cs.class_id = $1
	`

	t := []*constant.UserEntity{}
	err := repo.Database.Select(&t, query, classRoomId)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil // return empty student if not found
		}
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return t, nil
}
