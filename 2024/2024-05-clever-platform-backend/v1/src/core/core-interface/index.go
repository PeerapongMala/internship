package coreInterface

import (
	speech "cloud.google.com/go/speech/apiv1"
	texttospeech "cloud.google.com/go/texttospeech/apiv1"
	"cloud.google.com/go/translate"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/huaweicloud/huaweicloud-sdk-go-obs/obs"
	"github.com/jmoiron/sqlx"
)

type Resource struct {
	PostgresDatabase         *sqlx.DB
	ObsClient                *obs.ObsClient
	ThirdPartyClient         *s3.Client
	Cache                    *helper.Cache
	GoogleTextToSpeechClient *texttospeech.Client
	GoogleTranslateClient    *translate.Client
	GoogleSpeechToTextClient *speech.Client
	RateLimiterManager       *middleware.RateLimiterManager
}
