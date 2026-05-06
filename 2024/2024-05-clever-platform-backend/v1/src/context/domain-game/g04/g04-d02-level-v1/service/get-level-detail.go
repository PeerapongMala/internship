package service

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"

	"github.com/pkg/errors"
)

// ==================== Response ==========================
type LevelDetailResponse struct {
	Data []constant.GameLevelResponse `json:"data"`
	*constant.StatusResponse
}

// ==================== Endpoint ==========================
func (api *APIStruct) GetLevelDetail(context *fiber.Ctx) error {

	subLessonId, err := context.ParamsInt("subLessonId")
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	userId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	resp, err := api.Service.GetLevelDetail(&GetLevelDetailInput{
		SubLessonId: subLessonId,
		UserId:      userId,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(LevelDetailResponse{
		Data: resp,
		StatusResponse: &constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Data retrieved",
		},
	})
}

// ==================== Service ==========================
type GetLevelDetailInput struct {
	SubLessonId int
	UserId      string
}

func (service *serviceStruct) GetLevelDetail(in *GetLevelDetailInput) ([]constant.GameLevelResponse, error) {

	levelDetailEntities, err := service.levelStorage.GetLevelDetailByUserAndSubLessonId(in.UserId, in.SubLessonId)
	if err != nil {
		return nil, err
	}

	resp := []constant.GameLevelResponse{}
	lockNextLevel := false
	for _, entity := range levelDetailEntities {
		lockNextLevel = (entity.IsUnlocked == nil || !*entity.IsUnlocked) && lockNextLevel
		gameRewards, err := service.levelStorage.GetRewardByLevelId(*entity.LevelId)
		if err != nil {
			return nil, err
		}

		for i, _ := range gameRewards {
			total := *gameRewards[i].Amount
			if entity.Star != nil && *entity.Star > 1 {
				gameRewards[i].AmountString = fmt.Sprintf(`%d/%d`, total, total)
				continue
			}
			gameRewards[i].AmountString = fmt.Sprintf(`0/%d`, total)
		}

		arcadeCoin := 0
		totalArcadeCoin := 0
		goldCoin := 0
		totalGoldCoin := 0

		rewards, err := service.levelStorage.GetReward(*entity.LevelId)
		if err != nil {
			return nil, err
		}

		for _, reward := range rewards {
			totalArcadeCoin += *reward.ArcadeCoin
			totalGoldCoin += *reward.GoldCoin
			if entity.Star != nil && *entity.Star >= *reward.StarRequired {
				arcadeCoin += *reward.ArcadeCoin
				goldCoin += *reward.GoldCoin
			}
		}

		resp = append(resp, constant.GameLevelResponse{
			Id:            entity.LevelId,
			Level:         entity.Index,
			Difficulty:    entity.Difficulty,
			QuestionCount: entity.QuestionCount,
			Star:          entity.Star,
			TimeUsed:      entity.TimeUsed,
			Status:        LockStatus(lockNextLevel),
			GameReward:    gameRewards,
			ArcadeCoin:    fmt.Sprintf(`%d/%d`, arcadeCoin, totalArcadeCoin),
			GoldCoin:      fmt.Sprintf(`%d/%d`, goldCoin, totalGoldCoin),
		})

		if (entity.LockNextLevel != nil && !*entity.LockNextLevel) || (entity.Star != nil && *entity.Star > 0) {
			lockNextLevel = false
		} else {
			lockNextLevel = true
		}
	}

	return resp, nil
}

func LockStatus(lockNextLevel bool) *string {
	lock := "lock"
	unlock := "unlock"

	if lockNextLevel {
		return &lock
	}
	return &unlock
}
