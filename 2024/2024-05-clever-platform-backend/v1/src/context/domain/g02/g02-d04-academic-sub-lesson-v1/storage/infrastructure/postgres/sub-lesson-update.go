package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) SubLessonUpdate(tx *sqlx.Tx, subLesson *constant.SubLessonEntity) (*constant.SubLessonEntity, error) {
	baseQuery := `
		UPDATE "subject"."sub_lesson" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if subLesson.Index != 0 {
		query = append(query, fmt.Sprintf(` "index" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subLesson.Index)
	}
	if subLesson.Name != nil {
		query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subLesson.Name)
	}
	if subLesson.IndicatorId != 0 {
		query = append(query, fmt.Sprintf(` "indicator_id" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subLesson.IndicatorId)
	}
	if subLesson.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subLesson.Status)
	}
	if !subLesson.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subLesson.UpdatedAt)
	}
	if subLesson.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, subLesson.UpdatedBy)
	}
	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, subLesson.AdminLoginAs)

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, subLesson.Id)

	subLessonEntity := constant.SubLessonEntity{}
	err := tx.QueryRowx(baseQuery, args...).StructScan(&subLessonEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &subLessonEntity, nil
}
