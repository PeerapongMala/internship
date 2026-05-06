package postgres

import (
	"fmt"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateGlobalAnnounce(c constant.UpdateGlobalAnnounceRequest) error {
	query := `UPDATE "announcement"."announcement" SET `
	args := []interface{}{}
	argsI := 1
	comma := ""

	if c.SchoolId != 0 {
		query += fmt.Sprintf(`%sschool_id = $%d`, comma, argsI)
		args = append(args, c.SchoolId)
		argsI++
		comma = ", "
	}
	if c.Scope != "" {
		query += fmt.Sprintf(`%sscope = $%d`, comma, argsI)
		args = append(args, c.Scope)
		argsI++
		comma = ", "
	}
	if c.Type != "" {
		query += fmt.Sprintf(`%stype = $%d`, comma, argsI)
		args = append(args, c.Type)
		argsI++
		comma = ", "
	}
	if !c.StartAt.IsZero() {
		query += fmt.Sprintf(`%sstarted_at = $%d`, comma, argsI)
		args = append(args, c.StartAt)
		argsI++
		comma = ", "
	}
	if !c.EndAt.IsZero() {
		query += fmt.Sprintf(`%sended_at = $%d`, comma, argsI)
		args = append(args, c.EndAt)
		argsI++
		comma = ", "
	}
	if c.Title != "" {
		query += fmt.Sprintf(`%stitle = $%d`, comma, argsI)
		args = append(args, c.Title)
		argsI++
		comma = ", "
	}
	if c.Description != "" {
		query += fmt.Sprintf(`%sdescription = $%d`, comma, argsI)
		args = append(args, c.Description)
		argsI++
		comma = ", "
	}
	if c.Image != nil {
		query += fmt.Sprintf(`%simage_url = $%d`, comma, argsI)
		args = append(args, c.Image)
		argsI++
		comma = ", "
	}
	if c.Status != "" {
		query += fmt.Sprintf(`%sstatus = $%d`, comma, argsI)
		args = append(args, c.Status)
		argsI++
		comma = ", "
	}
	if c.AdminLoginAs != nil {
		query += fmt.Sprintf(`%sadmin_login_as = $%d`, comma, argsI)
		args = append(args, c.AdminLoginAs)
		argsI++
		comma = ", "
	}

	query += fmt.Sprintf(`%supdated_at = $%d`, comma, argsI)
	args = append(args, time.Now().UTC())
	argsI++
	comma = ", "

	if c.UpdatedBy != "" {
		query += fmt.Sprintf(`%supdated_by = $%d`, comma, argsI)
		args = append(args, c.UpdatedBy)
		argsI++
	}

	query += fmt.Sprintf(` WHERE id = $%d`, argsI)
	args = append(args, c.Id)

	result, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		return err
	}

	RowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if RowsAffected == 0 {
		return fmt.Errorf("Announce id is not exist")
	}

	return nil
}
