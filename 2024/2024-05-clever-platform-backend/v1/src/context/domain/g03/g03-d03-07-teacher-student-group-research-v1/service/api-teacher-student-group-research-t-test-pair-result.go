package service

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"gonum.org/v1/gonum/stat/distuv"
	"math"
	"net/http"
	"strconv"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetTTestPairResult(ctx *fiber.Ctx) (err error) {

	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetTTestPairModelStatListAndCsvParams{}, helper.ParseOptions{Query: true, Params: true})
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

	result, err := api.Service.GetTTestPairResult(teacherId, studyGroupId, in)
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

func (service serviceStruct) GetTTestPairResult(teacherId string, studyGroupId int, in *constant.GetTTestPairModelStatListAndCsvParams) (constant.GetTTestPairResultResult, error) {

	studentIds, err := service.storage.GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId, teacherId)
	if err != nil {
		return constant.GetTTestPairResultResult{}, errors.New(fmt.Sprintf("get study group from id error: %s", err.Error()))
	}

	if studentIds == nil || len(studentIds) == 0 {
		return constant.GetTTestPairResultResult{}, nil
	}

	ents, err := service.storage.GetTTestPairModelStatListByParams(studentIds, in)
	if err != nil {
		return constant.GetTTestPairResultResult{}, err
	}

	sigma := 0.05

	totalStudents := float64(len(ents))

	var sumPreTestScore, sumPostTestScore []float64
	totalPreTestScore, totalPostTestScore := 0, 0
	for _, ent := range ents {
		if ent.PreTestScore != nil {
			sumPreTestScore = append(sumPreTestScore, float64(*ent.PreTestScore))
			totalPreTestScore += *ent.PreTestScore
		}

		if ent.PostTestScore != nil {
			sumPostTestScore = append(sumPostTestScore, float64(*ent.PostTestScore))
			totalPostTestScore += *ent.PostTestScore
		}
	}

	//meanPreTestScore, stdX := stat.MeanStdDev(sumPreTestScore, nil)
	//meanPostTestScore, stdY := stat.MeanStdDev(sumPostTestScore, nil)
	meanPreTestScore := 0.00
	meanPostTestScore := 0.00
	if totalStudents != 0 {
		meanPreTestScore = sanitizeFloat(float64(totalPreTestScore)) / totalStudents
		meanPostTestScore = sanitizeFloat(float64(totalPostTestScore)) / totalStudents
	}

	mean := constant.TestStat{
		PretestScore:  &meanPreTestScore,
		PostTestScore: &meanPostTestScore,
	}

	stdX, stdY := 0.00, 0.00
	variance := calVariance(ents, mean, totalStudents)
	stdX = sanitizeFloat(math.Sqrt(helper.Deref(variance.PretestScore)))
	stdY = sanitizeFloat(math.Sqrt(helper.Deref(variance.PostTestScore)))

	observationValue := totalStudents - 1
	observation := constant.TestStat{
		PretestScore:  &observationValue,
		PostTestScore: &observationValue,
	}

	personCorrelation := calPersonCorrelation(ents, mean, variance)
	hypothesizedMeanDifference := calHypothesizedMeanDifference(mean)

	df := totalStudents - 2

	normalTStat := calTStat(mean, variance, totalStudents)
	pOneTail, pTwoTail, tCriticalOneTail, tCriticalTwoTail := 0.00, 0.00, 0.00, 0.00
	if df > 0 {

		if math.IsNaN(helper.Deref(normalTStat)) {
			zero := 0.00
			normalTStat = &zero
		}

		alpha := 0.05
		tDist := distuv.StudentsT{Mu: 0, Sigma: 1, Nu: df, Src: nil}

		pOneTail = sanitizeFloat(tDist.CDF(helper.Deref(normalTStat)))
		pTwoTail = sanitizeFloat(2 * (1 - tDist.CDF(math.Abs(helper.Deref(normalTStat)))))
		tCriticalOneTail = sanitizeFloat(math.Abs(tDist.Quantile(alpha)))
		tCriticalTwoTail = sanitizeFloat(math.Abs(tDist.Quantile(alpha / 2)))
	}

	resData := constant.GetTTestPairResultResult{
		Mean:                       mean,
		Variance:                   variance,
		Observations:               observation,
		PearsonCorrelation:         personCorrelation,
		HypothesizedMeanDifference: hypothesizedMeanDifference,
		DF:                         &df,
		TStat:                      normalTStat,
		POneTail:                   &pOneTail,
		TCriticalOneTail:           &tCriticalOneTail,
		PTwoTail:                   &pTwoTail,
		TCriticalTwoTail:           &tCriticalTwoTail,
		TestScore: struct {
			N    constant.TestStat `json:"n"`
			Mean constant.TestStat `json:"mean"`
			SD   constant.TestStat `json:"sd"`
			T    *float64          `json:"t"`
			DF   *float64          `json:"df"`
			SIG  float64           `json:"sig"`
		}{
			N: constant.TestStat{
				PretestScore:  &totalStudents,
				PostTestScore: &totalStudents,
			},
			Mean: mean,
			SD: constant.TestStat{
				PretestScore:  &stdX,
				PostTestScore: &stdY,
			},
			T:   normalTStat,
			DF:  &df,
			SIG: sigma,
		},
	}

	return resData, nil
}

func calVariance(ents []constant.TTestPairModelStatEntity, mean constant.TestStat, total float64) constant.TestStat {
	var preTestSigma, postTestSigma float64

	for _, ent := range ents {
		preTestSigma += math.Pow(float64(helper.Deref(ent.PreTestScore))-helper.Deref(mean.PretestScore), 2)
		postTestSigma += math.Pow(float64(helper.Deref(ent.PostTestScore))-helper.Deref(mean.PostTestScore), 2)
	}

	preTestScore := sanitizeFloat(preTestSigma / (total - 1))
	postTestScore := sanitizeFloat(postTestSigma / (total - 1))

	return constant.TestStat{
		PretestScore:  &preTestScore,
		PostTestScore: &postTestScore,
	}
}

func calPersonCorrelation(ents []constant.TTestPairModelStatEntity, mean, variance constant.TestStat) *float64 {
	if len(ents) == 0 {
		zero := float64(0)
		return &zero
	}

	var coVariance float64
	for _, ent := range ents {
		coVariance += (float64(helper.Deref(ent.PreTestScore)) - helper.Deref(mean.PretestScore)) * (float64(helper.Deref(ent.PostTestScore)) - helper.Deref(mean.PostTestScore))
	}
	if len(ents) != 1 {
		coVariance /= float64(len(ents)) - 1
	} else {
		coVariance /= float64(len(ents))
	}

	value := sanitizeFloat(coVariance / math.Sqrt(helper.Deref(variance.PretestScore)) * math.Sqrt(helper.Deref(variance.PostTestScore)))

	return &value
}

func calHypothesizedMeanDifference(mean constant.TestStat) *float64 {

	value := sanitizeFloat(helper.Deref(mean.PretestScore) - helper.Deref(mean.PostTestScore))

	return &value
}

func calTStat(mean, variance constant.TestStat, total float64) *float64 {

	value := (helper.Deref(mean.PretestScore) - helper.Deref(mean.PostTestScore)) /
		math.Sqrt((helper.Deref(variance.PretestScore)+helper.Deref(variance.PostTestScore))/total)

	value = sanitizeFloat(value)

	return &value
}

func sanitizeFloat(f float64) float64 {
	if math.IsNaN(f) || math.IsInf(f, 0) {
		return 0 // or any fallback value you want
	}
	return f
}

func variance(data []float64, mean float64) float64 {
	if len(data) <= 1 {
		return 0
	}
	sumSq := 0.0
	for _, v := range data {
		sumSq += math.Pow(v-mean, 2)
	}
	return sumSq / float64(len(data)-1)
}

func tStat(ents []constant.TTestPairModelStatEntity) float64 {
	diff := 0
	diffArr := make([]float64, len(ents))
	if len(ents) == 0 {
		return float64(diff)
	}

	for _, ent := range ents {
		diff += helper.Deref(ent.PostTestScore) - helper.Deref(ent.PreTestScore)
		diffArr = append(diffArr, float64(diff))
	}

	meanDiff := float64(diff / len(ents))
	stdDev := math.Sqrt(variance(diffArr, meanDiff))
	n := float64(len(diffArr))
	stdErr := stdDev / math.Sqrt(n)
	tStat := meanDiff / stdErr

	return tStat
}
