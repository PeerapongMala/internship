package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateSubjectCheckin(subjectCheckin *constant.SubjectCheckinEntity) error {
	// log.Println("UpdateSubjectCheckin", subjectCheckin)
	_, err := postgresRepository.Database.Exec(`
	UPDATE 
		"streak_login"."subject_checkin" 
	SET 
		last_checkin = $1, 
		current_streak = $2, 
		highest_streak = $3,
		miss_login_day = $4
	WHERE student_id = $5 
	AND subject_id = $6
	`,
		subjectCheckin.LastCheckin,
		subjectCheckin.CurrentStreak,
		subjectCheckin.HighestStreak,
		subjectCheckin.MissLoginDay,
		subjectCheckin.StudentId,
		subjectCheckin.SubjectId,
	)
	if err != nil {
		return err
	}
	return nil
}
