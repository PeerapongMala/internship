package postgres

import "time"

func (postgresRepository *postgresRepository) TeacherRewardCallBack(id int, subjectId string, Admin *string) error {
	query := `
	UPDATE "teacher_item"."teacher_reward_transaction"
	SET status = $1,
	is_deleted = $2,
	updated_at = $3,
	updated_by = $4,
	admin_login_as = $5
	WHERE id = $6

	`
	_, err := postgresRepository.Database.Exec(query,
		"callback",
		true,
		time.Now().UTC(),
		subjectId,
		Admin,
		id,
	)
	if err != nil {
		return err
	}
	return nil
}
