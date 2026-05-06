package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d06-mail-box-v1/constant"

func (postgresRepository *postgresRepository) TeacherRewardReceived(req constant.ReceivedRequest) error {
	query := `
	UPDATE "teacher_item"."teacher_reward_transaction"
	SET status = 'received'
	WHERE id = $1
	AND student_id = $2
	`
	_, err := postgresRepository.Database.Exec(query, req.RewardId, req.StudentId)
	if err != nil {
		return err
	}
	return nil
}
