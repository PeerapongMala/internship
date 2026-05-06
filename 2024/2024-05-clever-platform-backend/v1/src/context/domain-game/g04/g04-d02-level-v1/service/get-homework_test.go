package service_test

import (
	"testing"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/service"
)

func TestGetHomeworkNextLevel(t *testing.T) {
	tests := []struct {
		name                string
		levelIds            []int
		mapIndexPassLevels  map[int][]int
		expectedNextLevelId int
		expectedTotalLevel  int
		expectedPassLevel   int
		expectedHomeworkIdx int
	}{
		{
			name:                "No passed levels",
			levelIds:            []int{1, 2, 3},
			mapIndexPassLevels:  map[int][]int{},
			expectedNextLevelId: 1,
			expectedTotalLevel:  3,
			expectedPassLevel:   0,
			expectedHomeworkIdx: 1,
		},
		{
			name:                "Some levels passed",
			levelIds:            []int{1, 2, 3},
			mapIndexPassLevels:  map[int][]int{1: {1}},
			expectedNextLevelId: 2,
			expectedTotalLevel:  3,
			expectedPassLevel:   1,
			expectedHomeworkIdx: 1,
		},
		{
			name:                "All levels passed",
			levelIds:            []int{1, 2, 3},
			mapIndexPassLevels:  map[int][]int{1: {1, 2, 3}},
			expectedNextLevelId: -1,
			expectedTotalLevel:  3,
			expectedPassLevel:   3,
			expectedHomeworkIdx: 1,
		},
		{
			name:                "Multiple homework indexes",
			levelIds:            []int{1, 2, 3},
			mapIndexPassLevels:  map[int][]int{1: {1, 2, 3}, 2: {1, 2}},
			expectedNextLevelId: 3,
			expectedTotalLevel:  3,
			expectedPassLevel:   2,
			expectedHomeworkIdx: 2,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			nextLevelId, totalLevel, passLevelCount, homeworkIndex := service.GetHomeworkNextLevel(tt.levelIds, tt.mapIndexPassLevels)
			if nextLevelId != tt.expectedNextLevelId {
				t.Errorf("expected nextLevelId %d, got %d", tt.expectedNextLevelId, nextLevelId)
			}
			if totalLevel != tt.expectedTotalLevel {
				t.Errorf("expected totalLevel %d, got %d", tt.expectedTotalLevel, totalLevel)
			}
			if passLevelCount != tt.expectedPassLevel {
				t.Errorf("expected passLevelCount %d, got %d", tt.expectedPassLevel, passLevelCount)
			}
			if homeworkIndex != tt.expectedHomeworkIdx {
				t.Errorf("expected homeworkIndex %d, got %d", tt.expectedHomeworkIdx, homeworkIndex)
			}
		})
	}
}