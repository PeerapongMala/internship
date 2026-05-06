package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
)

func (postgresRepository *postgresRepository) CreateSubjectCheckIn(subjectCheckIn *constant.SubjectCheckinEntity) error {

	_, err := postgresRepository.Database.Exec(`
	INSERT INTO 
	"streak_login"."subject_checkin" (student_id, subject_id, last_checkin, current_streak, highest_streak)
	VALUES ($1, $2, $3, $4, $5)
	`,
		subjectCheckIn.StudentId,
		subjectCheckIn.SubjectId,
		subjectCheckIn.LastCheckin,
		subjectCheckIn.CurrentStreak,
		subjectCheckIn.HighestStreak,
	)
	if err != nil {
		return err
	}
	return nil
}
