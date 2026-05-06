package postgres

import (
	"github.com/jmoiron/sqlx"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
)

func (postgresRepository *postgresRepository) TeacherRewardCreate(tx *sqlx.Tx, req constant.TeacherRewardCreate) error {
	query := `
		INSERT INTO "teacher_item"."teacher_reward_transaction"(
			subject_id,                                        
			teacher_id,                                                      
			student_id,
			class_id,
			item_id,
			amount,
			status,
			created_at,
			created_by,
			admin_login_as,
			is_deleted
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10, $11)
	`
	_, err := tx.Exec(query,
		req.SubjectId,
		req.TeacherId,
		req.StudentId,
		req.ClassId,
		req.ItemId,
		req.Amount,
		req.Status,
		time.Now().UTC(),
		req.CreatedBy,
		req.AdminLoginAs,
		false,
	)
	if err != nil {
		return err
	}
	return nil
}
