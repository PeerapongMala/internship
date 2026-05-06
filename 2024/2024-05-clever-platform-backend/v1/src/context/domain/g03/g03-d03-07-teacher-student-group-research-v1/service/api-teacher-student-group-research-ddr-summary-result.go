package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"net/http"
	"sort"
	"strconv"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetDDRSummaryResult(ctx *fiber.Ctx) (err error) {

	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetDDRParams{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(ctx, err)
	}

	teacherId, ok := ctx.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studyGroupStr := ctx.Params("studyGroupId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	studyGroupId, err := strconv.Atoi(studyGroupStr)
	if err != nil {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	result, err := api.Service.GetDDRSummaryResult(teacherId, studyGroupId, in)
	if err != nil {
		var httpError helper.HttpError
		if errors.As(err, &httpError) {
			return helper.RespondHttpError(ctx, httpError)
		}
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return ctx.Status(http.StatusOK).JSON(constant.Response{
		StatusCode: http.StatusOK,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service serviceStruct) GetDDRSummaryResult(teacherId string, studyGroupId int, in *constant.GetDDRParams) (constant.GetDDRSummaryResult, error) {
	if in.LevelId == 0 {
		return constant.GetDDRSummaryResult{}, nil
	}

	//Check Permission and Get StudentIds
	studentIds, err := service.storage.GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId, teacherId)
	if err != nil {
		return constant.GetDDRSummaryResult{}, errors.New(fmt.Sprintf("get study group from id error: %s", err.Error()))
	}

	studentQuestionEnts, err := service.storage.GetQuestionStatByLevelIDAndStudentIds(in.LevelId, studentIds, in.Search)
	if err != nil {
		return constant.GetDDRSummaryResult{}, err
	}

	//highRankStudents := make([]constant.StudentQuestionStatEntity, 0)
	//lowRankStudents := make([]constant.StudentQuestionStatEntity, 0)

	n := len(studentQuestionEnts)

	// If odd, remove the middle student
	if n%2 == 1 {
		n--
	}

	// Split students into high and low rank groups
	halfSize := n / 2
	highRankStudentIDs := make([]string, halfSize)
	lowRankStudentIDs := make([]string, halfSize)

	sortStudentEnts := studentQuestionEnts

	sort.Slice(sortStudentEnts, func(i, j int) bool {
		return sortStudentEnts[i].ScoreSum > sortStudentEnts[j].ScoreSum
	})

	for i := 0; i < halfSize; i++ {
		highRankStudentIDs[i] = sortStudentEnts[i].StudentID
		lowRankStudentIDs[i] = sortStudentEnts[i+halfSize].StudentID
	}

	// Initialize data maps
	studentQuestionStats := make(map[string][]constant.QuestionScoreStat, len(studentQuestionEnts))
	totalQuestion := len(studentQuestionEnts[0].Questions)
	questionTotalScores := make(map[int]int)
	questionCorrectCounts := make(map[int]int)

	// Process question data
	if totalQuestion > 0 {
		for i := range totalQuestion {
			for _, studentQ := range studentQuestionEnts {
				if len(studentQ.Questions) <= i {
					continue
				}

				score := helper.Deref(studentQ.Questions[i].Score)
				studentQuestionStats[studentQ.StudentID] = append(studentQuestionStats[studentQ.StudentID], constant.QuestionScoreStat{
					QuestionIndex: studentQ.Questions[i].QuestionIndex,
					Score:         score,
				})

				questionTotalScores[studentQ.Questions[i].QuestionIndex] += score
				if score > 0 {
					questionCorrectCounts[studentQ.Questions[i].QuestionIndex]++
				}
			}
		}
	}

	// Compute high and low rank score aggregates
	highRankScores := make(map[int]float64, len(questionTotalScores))
	lowRankScores := make(map[int]float64, len(questionTotalScores))

	for _, studentID := range highRankStudentIDs {
		for _, questionStat := range studentQuestionStats[studentID] {
			highRankScores[questionStat.QuestionIndex] += float64(questionStat.Score)
		}
	}
	for _, studentID := range lowRankStudentIDs {
		for _, questionStat := range studentQuestionStats[studentID] {
			lowRankScores[questionStat.QuestionIndex] += float64(questionStat.Score)
		}
	}

	// Extract and sort question indices
	sortedQuestionIndices := make([]int, 0, len(questionTotalScores))
	for questionIndex := range questionTotalScores {
		sortedQuestionIndices = append(sortedQuestionIndices, questionIndex)
	}
	sort.Ints(sortedQuestionIndices)

	// Compute Difficulty & B-Index metrics
	bIndexScores := make(map[int]float64, len(questionTotalScores))
	difficultyScores := make(map[int]float64, len(questionTotalScores))

	numHighRankStudents := float64(len(highRankStudentIDs))
	numLowRankStudents := float64(len(lowRankStudentIDs))
	numTotalStudents := float64(len(studentQuestionStats))

	for _, questionIndex := range sortedQuestionIndices {
		highRankScores[questionIndex] /= numHighRankStudents
		lowRankScores[questionIndex] /= numLowRankStudents
		difficultyScores[questionIndex] = float64(questionCorrectCounts[questionIndex]) / numTotalStudents
		bIndexScores[questionIndex] = highRankScores[questionIndex] - lowRankScores[questionIndex]
	}

	// Compile final aggregated statistics
	sumTotalScore := 0
	aggregatedQuestionScores := make([]constant.QuestionScoreStat, 0, len(questionTotalScores))
	highRankAggregates := make([]constant.QuestionCalStatScore, 0, len(questionTotalScores))
	lowRankAggregates := make([]constant.QuestionCalStatScore, 0, len(questionTotalScores))
	difficultyAggregates := make([]constant.QuestionCalStatScore, 0, len(questionTotalScores))
	bIndexAggregates := make([]constant.QuestionCalStatScore, 0, len(questionTotalScores))

	for _, questionIndex := range sortedQuestionIndices {
		sumTotalScore += questionTotalScores[questionIndex]

		aggregatedQuestionScores = append(aggregatedQuestionScores, constant.QuestionScoreStat{
			QuestionIndex: questionIndex,
			Score:         questionTotalScores[questionIndex],
		})
		highRankAggregates = append(highRankAggregates, constant.QuestionCalStatScore{
			QuestionIndex: questionIndex,
			Score:         sanitizeFloat(highRankScores[questionIndex]),
		})
		lowRankAggregates = append(lowRankAggregates, constant.QuestionCalStatScore{
			QuestionIndex: questionIndex,
			Score:         sanitizeFloat(lowRankScores[questionIndex]),
		})
		difficultyAggregates = append(difficultyAggregates, constant.QuestionCalStatScore{
			QuestionIndex: questionIndex,
			Score:         sanitizeFloat(difficultyScores[questionIndex]),
		})
		bIndexAggregates = append(bIndexAggregates, constant.QuestionCalStatScore{
			QuestionIndex: questionIndex,
			Score:         sanitizeFloat(bIndexScores[questionIndex]),
		})
	}

	for i, question := range bIndexAggregates {
		if question.Score < 0 {
			bIndexAggregates[i].Score = 0
		}
		if question.Score > 1 {
			bIndexAggregates[i].Score = 1
		}
	}

	// Return the final result
	return constant.GetDDRSummaryResult{
		SumStat: constant.SumQuestionStat{
			QuestionData: aggregatedQuestionScores,
			XSum:         sumTotalScore,
			PowXSum:      sumTotalScore * sumTotalScore,
		},
		HiRankCorrectAnswer:  highRankAggregates,
		LowRankCorrectAnswer: lowRankAggregates,
		Difficulty:           difficultyAggregates,
		BIndex:               bIndexAggregates,
	}, nil
}
