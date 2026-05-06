package postgres

import (
	"fmt"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
)

func (postgresRepository *postgresRepository) AnnouncementUpdate(req constant.TeacherAnnounceUpdate) error {
	query := `UPDATE "announcement"."announcement" SET `
	args := []interface{}{}
	argsI := 1
	comma := ""

	if req.SchoolId != 0 {
		query += fmt.Sprintf(`%sschool_id = $%d`, comma, argsI)
		args = append(args, req.SchoolId)
		argsI++
		comma = ", "
	}
	if req.Scope != "" {
		query += fmt.Sprintf(`%sscope = $%d`, comma, argsI)
		args = append(args, req.Scope)
		argsI++
		comma = ", "
	}
	if req.Type != "" {
		query += fmt.Sprintf(`%stype = $%d`, comma, argsI)
		args = append(args, req.Type)
		argsI++
		comma = ", "
	}
	if !req.StartAt.IsZero() {
		query += fmt.Sprintf(`%sstarted_at = $%d`, comma, argsI)
		args = append(args, req.StartAt)
		argsI++
		comma = ", "
	}
	if !req.EndAt.IsZero() {
		query += fmt.Sprintf(`%sended_at = $%d`, comma, argsI)
		args = append(args, req.EndAt)
		argsI++
		comma = ", "
	}
	if req.Title != "" {
		query += fmt.Sprintf(`%stitle = $%d`, comma, argsI)
		args = append(args, req.Title)
		argsI++
		comma = ", "
	}
	if req.Description != "" {
		query += fmt.Sprintf(`%sdescription = $%d`, comma, argsI)
		args = append(args, req.Description)
		argsI++
		comma = ", "
	}
	if req.Image != nil {
		query += fmt.Sprintf(`%simage_url = $%d`, comma, argsI)
		args = append(args, req.Image)
		argsI++
		comma = ", "
	}
	if req.Status != "" {
		query += fmt.Sprintf(`%sstatus = $%d`, comma, argsI)
		args = append(args, req.Status)
		argsI++
		comma = ", "
	}
	if req.AdminLoginAs != nil {
		query += fmt.Sprintf(`%sadmin_login_as = $%d`, comma, argsI)
		args = append(args, req.AdminLoginAs)
		argsI++
		comma = ", "
	}

	query += fmt.Sprintf(`%supdated_at = $%d`, comma, argsI)
	args = append(args, time.Now().UTC())
	argsI++
	comma = ", "

	if req.UpdatedBy != "" {
		query += fmt.Sprintf(`%supdated_by = $%d`, comma, argsI)
		args = append(args, req.UpdatedBy)
		argsI++
	}

	query += fmt.Sprintf(` WHERE id = $%d`, argsI)
	args = append(args, req.Id)

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
