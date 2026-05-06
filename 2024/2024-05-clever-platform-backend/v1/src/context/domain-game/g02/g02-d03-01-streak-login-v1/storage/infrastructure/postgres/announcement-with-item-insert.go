package postgres

import (
	"log"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AnnouncementWithItemInsert(entity *constant.ItemToMailBoxDTO) (err error) {

	tx, err := postgresRepository.Database.Beginx()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	defer tx.Rollback()

	query1 := `
		INSERT INTO announcement.announcement (
			scope,
			type,
			started_at,
			ended_at,
			title,
			description,
			status,
			created_at,
			created_by
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)		
		RETURNING id;
	`

	query2 := `
			INSERT INTO announcement.announcement_reward (
			announcement_id,	
			subject_id
		)
		VALUES ($1, $2);
	`

	query3 := `
		INSERT INTO announcement.announcement_reward_item (item_id, announcemnet_reward_id, amount, expired_at)
		VALUES ($1, $2, $3, $4);
	`

	var insertId int
	now := time.Now()
	endAt := now.AddDate(0, 0, 30)

	announcementEntity := &constant.AnnouncementEntity{
		Scope: createStringPointer("User"),
		Type: createStringPointer("reward"),
		StartedAt: &now,
		EndedAt: &endAt,
		Title: createStringPointer("Login Reward"),
		Description: createStringPointer("Reward from Login reward"),
		Status: createStringPointer("enabled"),
		CreatedAt: &now,
		CreatedBy: &entity.StudentId,
	}

	err = tx.QueryRowx(
		query1,
		announcementEntity.Scope,
		announcementEntity.Type,	
		announcementEntity.StartedAt,	
		announcementEntity.EndedAt,	
		announcementEntity.Title,	
		announcementEntity.Description,
		announcementEntity.Status,
		announcementEntity.CreatedAt,	
		announcementEntity.CreatedBy,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	announcementRewardEntity := &constant.AnnouncementRewardEntity{
		AnnouncementId: &insertId,	
		SubjectId: &entity.SubjectId,
	}

	err = tx.QueryRowx(	
		query2,	
		announcementRewardEntity.AnnouncementId,	
		announcementRewardEntity.SubjectId,	
	).Err()

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	announcementRewardItemEntity := constant.AnnouncementRewardItemEntity{
		ItemId: createIntPointer(entity.ItemId),	
		AnnouncementRewardId: &insertId,	
		Amount: createIntPointer(entity.ItemAmount),
		ExpiredAt: &endAt,
	}

	err = tx.QueryRowx(	
		query3,	
		announcementRewardItemEntity.ItemId,
		announcementRewardItemEntity.AnnouncementRewardId,
		announcementRewardItemEntity.Amount,
		announcementRewardItemEntity.ExpiredAt,
	).Err()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err	
	}

	err = tx.Commit()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err	
	}

	return nil
}

func createStringPointer(value string) *string {
	return &value
}

func createIntPointer(value int) *int {
	return &value
}