package service

import "testing"

func TestAssignRank(t *testing.T) {
	data := []StudentPorphor6Data{
		{ScorePercentage: 90, AverageLearningScore: 4},
		{ScorePercentage: 76, AverageLearningScore: 3.5},
		{ScorePercentage: 77, AverageLearningScore: 3.5},
		{ScorePercentage: 76, AverageLearningScore: 3},
		{ScorePercentage: 78, AverageLearningScore: 3.6},
	}

	// Assign rank for TotalScoreRank (based on ScorePercentage)
	assignRank(&data, "total")

	// Expected TotalScoreRank results
	expectedTotalRanks := []int{1, 4, 3, 4, 2}

	for i, v := range data {
		if v.TotalScoreRank != expectedTotalRanks[i] {
			t.Errorf("TotalScoreRank incorrect for index %d: got %d, expected %d",
				i, v.TotalScoreRank, expectedTotalRanks[i])
		}
	}

	// Assign rank for AverageLearningRank (based on AverageLearningScore)
	assignRank(&data, "average")

	// Expected AverageLearningRank results
	expectedAverageRanks := []int{1, 3, 3, 5, 2}

	for i, v := range data {
		if v.AverageLearningRank != expectedAverageRanks[i] {
			t.Errorf("AverageLearningRank incorrect for index %d: got %d, expected %d",
				i, v.AverageLearningRank, expectedAverageRanks[i])
		}
	}
}
