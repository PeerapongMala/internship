package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"

	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetAchivementByUserAndSubLessonId(userId string, subLessonId int) ([]constant.SpecialRewardWithDataEntity, error) {
	query := `
		SELECT 
			lsr.id AS level_special_reward_id,
			lsr.amount,
			i.type,
			i.name,
			i.description,
			i.image_url,
			b.template_path,
			b.badge_description,
			lpl.played_at AS "received_at",
			l2.id  AS lesson_id,
			l2."name" AS lesson_name,
			sl.id AS sub_lesson_id,
			sl."name" AS sub_lesson_name,
			l.id AS level_id,
			l."index" AS level_index
		FROM level.level_special_reward lsr 
		LEFT JOIN item.item i 
		ON lsr.level_id = i.id
		LEFT JOIN level.level_play_Log lpl 
		ON lsr.level_id = lpl.level_id
		LEFT JOIN level."level" l 
		ON l.id = lsr.level_id 
		LEFT JOIN subject.sub_lesson sl 
		ON sl.id = l.sub_lesson_id
		LEFT JOIN subject.lesson l2
		ON l2.id = sl.lesson_id
		LEFT JOIN item.badge b
		ON lsr.item_id = b.item_id
		WHERE l.status = 'enabled'
		AND l.sub_lesson_id = $1
		AND (lpl.student_id IS NULL OR lpl.student_id = $2)
	`

	entities := []constant.SpecialRewardWithDataEntity{}
	err := postgresRepository.Database.Select(&entities, query, subLessonId, userId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return entities, nil
}
