package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) TeacherItemGroupUpdate(tx *sqlx.Tx, teacherItemGroup *constant.TeacherItemGroupEntity) error {
	baseQuery := `
		UPDATE "teacher_item"."teacher_item_group" tig SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := len(args) + 1

	if teacherItemGroup.UpdatedAt != nil {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		args = append(args, teacherItemGroup.UpdatedAt)
		argsIndex++
	}
	if teacherItemGroup.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		args = append(args, teacherItemGroup.UpdatedBy)
		argsIndex++
	}
	if teacherItemGroup.AdminLoginAs != nil {
		query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
		args = append(args, teacherItemGroup.AdminLoginAs)
		argsIndex++
	}

	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d`, strings.Join(query, ","), argsIndex)
		args = append(args, teacherItemGroup.Id)
		_, err := tx.Exec(baseQuery, args...)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}
