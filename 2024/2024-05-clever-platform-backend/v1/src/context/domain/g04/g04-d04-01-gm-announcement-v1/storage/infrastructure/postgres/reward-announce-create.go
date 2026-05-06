package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-01-gm-announcement-v1/constant"

func (postgresRepository *postgresRepository) AddRewardItem(c constant.AddRewardItemRequest) error {
	query := `INSERT INTO "announcement"."announcement_reward_item"(
	"item_id",
	"announcemnet_reward_id",
	"amount",
	"expired_at"
	)
	VALUES ($1,$2,$3,$4)
	`
	_, err := postgresRepository.Database.Exec(
		query,
		c.ItemId,
		c.AnnounceRewardId,
		c.Amount,
		c.ExpiredAt,
	)
	if err != nil {
		return err
	}
	return nil
}

func (postgresRepository *postgresRepository) AddRewardAnnounce(c constant.CreateRewardAnnounceRequest) (int, error) {
	id, err := postgresRepository.AddGlobalAnnounce(constant.CreateGlobalAnnounceRequest{
		SchoolId:     c.SchoolId,
		Scope:        c.Scope,
		Type:         c.Type,
		StartAt:      c.StartAt,
		EndAt:        c.EndAt,
		Title:        c.Title,
		Description:  c.Description,
		Image:        c.Image,
		Status:       c.Status,
		CreatedBy:    c.CreatedBy,
		AdminLoginAs: c.AdminLoginAs,
	})
	if err != nil {
		return 0, err
	}

	query := `INSERT INTO "announcement"."announcement_reward"(
	"announcement_id",
	"subject_id",
	"academic_year"
	)
	VALUES ($1,$2,$3)
	`
	_, err = postgresRepository.Database.Exec(query,
		id,
		c.SubjectId,
		c.AcademicYear,
	)
	if err != nil {
		return 0, err
	}

	return id, nil
}
