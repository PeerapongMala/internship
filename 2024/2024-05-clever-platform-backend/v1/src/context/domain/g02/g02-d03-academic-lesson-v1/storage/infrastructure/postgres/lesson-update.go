package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) LessonUpdate(tx *sqlx.Tx, lesson *constant.LessonEntity) (*constant.LessonEntity, error) {
	baseQuery := `
		UPDATE "subject"."lesson" SET
`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if lesson.Index != 0 {
		query = append(query, fmt.Sprintf(` "index" = $%d`, argsIndex))
		argsIndex++
		args = append(args, lesson.Index)
	}
	if lesson.SubjectId != 0 {
		query = append(query, fmt.Sprintf(` "subject_id" = $%d`, argsIndex))
		argsIndex++
		args = append(args, lesson.SubjectId)
	}
	if lesson.Name != "" {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, lesson.Name)
	}
	if lesson.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, lesson.Status)
	}
	if !lesson.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, lesson.UpdatedAt)
	}
	if lesson.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, lesson.UpdatedBy)
	}
	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, lesson.AdminLoginAs)

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, lesson.Id)

	lessonEntity := constant.LessonEntity{}
	err := tx.QueryRowx(baseQuery, args...).StructScan(&lessonEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &lessonEntity, nil
}
