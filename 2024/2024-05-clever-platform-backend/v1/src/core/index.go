package core

import (
	"context"
	"log"
	"os"
	"strconv"
	"time"

	speech "cloud.google.com/go/speech/apiv1"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"google.golang.org/api/option"

	texttospeech "cloud.google.com/go/texttospeech/apiv1"
	"cloud.google.com/go/translate"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/global"
	coreInterface "github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/core-interface"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/requestid"
	"github.com/gofiber/swagger"
	"github.com/huaweicloud/huaweicloud-sdk-go-obs/obs"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
	zlog "github.com/rs/zerolog"
	zlog_log "github.com/rs/zerolog/log"
)

func Init() {
	// env
	err := godotenv.Load("./.env")
	if err != nil {
		// log.Fatalf("unable to load .env file: %v", err)
	}

	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "5050"
	}

	// Resource
	resource := coreInterface.Resource{}

	// Huawei OBS
	ak := os.Getenv("OBS_ACCESS_KEY_ID")
	sk := os.Getenv("OBS_SECRET_ACCESS_KEY")
	endPoint := os.Getenv("OBS_ENDPOINT")

	var obsClient *obs.ObsClient
	if ak != "" && sk != "" && endPoint != "" {
		obsClient, err = obs.New(ak, sk, endPoint)
		if err != nil {
			log.Fatal(err)
		}
	}

	// THIRD PARTY STORAGE
	ak = os.Getenv("THIRD_PARTY_STORAGE_ACCESS_KEY_ID")
	sk = os.Getenv("THIRD_PARTY_STORAGE_SECRET_ACCESS_KEY")
	endPoint = os.Getenv("THIRD_PARTY_STORAGE_ENDPOINT")

	var thirdPartyClient *s3.Client
	if ak != "" && sk != "" && endPoint != "" {
		customResolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
			return aws.Endpoint{
				URL:           endPoint,
				SigningRegion: "auto",
			}, nil
		})

		cfg, err := config.LoadDefaultConfig(
			context.TODO(),
			config.WithEndpointResolverWithOptions(customResolver),
			config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(ak, sk, "")),
			config.WithRegion("auto"),
		)
		if err != nil {
			log.Fatal(err)
		}

		thirdPartyClient = s3.NewFromConfig(cfg, func(o *s3.Options) {
			o.UsePathStyle = true
		})
	}

	// Google Cloud
	isGcpIntegratedString := os.Getenv("GCP_INTEGRATED")
	isGcpIntegrated, err := strconv.ParseBool(isGcpIntegratedString)
	if err != nil {
		log.Fatal("Unable to read GCP_INTEGRATED from .env")
	}

	if isGcpIntegrated {
		gcpCredFile := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
		gcpCreds := os.Getenv("GCP_CREDENTIALS")

		var translateClient *translate.Client
		var textToSpeechClient *texttospeech.Client
		var speechClient *speech.Client
		ctx := context.Background()
		if gcpCredFile == "" {
			translateClient, err = translate.NewClient(ctx, option.WithCredentialsJSON([]byte(gcpCreds)))
			if err != nil {
				log.Fatal(err)
			}
			defer translateClient.Close()

			ctx = context.Background()
			textToSpeechClient, err = texttospeech.NewClient(ctx, option.WithCredentialsJSON([]byte(gcpCreds)))
			if err != nil {
				log.Fatal(err)
			}
			defer textToSpeechClient.Close()

			ctx = context.Background()
			speechClient, err = speech.NewClient(ctx, option.WithCredentialsJSON([]byte(gcpCreds)))
			if err != nil {
				log.Fatal(err)
			}
			defer speechClient.Close()
		} else {
			translateClient, err = translate.NewClient(ctx)
			if err != nil {
				log.Fatal(err)
			}
			defer translateClient.Close()

			ctx = context.Background()
			textToSpeechClient, err = texttospeech.NewClient(ctx)
			if err != nil {
				log.Fatal(err)
			}
			defer textToSpeechClient.Close()

			ctx = context.Background()
			speechClient, err = speech.NewClient(ctx)
			if err != nil {
				log.Fatal(err)
			}
			defer speechClient.Close()
		}

		resource.GoogleTextToSpeechClient = textToSpeechClient
		resource.GoogleTranslateClient = translateClient
		resource.GoogleSpeechToTextClient = speechClient
	}

	// postgresDatabase connection
	var postgresDatabase *sqlx.DB
	postgresURL := os.Getenv("POSTGRES_URL")

	postgresDatabase, err = sqlx.Connect("pgx", postgresURL)
	if err != nil {
		log.Fatal(err)
	}
	defer postgresDatabase.Close()

	maxConnStr := os.Getenv("MAX_DB_CONN")
	if maxConnStr != "" {
		maxConn, err := strconv.Atoi(maxConnStr)
		if err != nil {
			log.Fatal(err)
		}
		postgresDatabase.SetMaxOpenConns(maxConn)
		postgresDatabase.SetMaxIdleConns(maxConn / 8)
		postgresDatabase.SetConnMaxIdleTime(5 * time.Minute)
	}

	resource.PostgresDatabase = postgresDatabase
	resource.ObsClient = obsClient
	resource.ThirdPartyClient = thirdPartyClient

	//auto migrate
	autoMigrateDB(postgresDatabase, PORT)

	// Start socket handler
	go service.SocketHandler()
	go service.SocketHandlerUpdateChatlist()

	// middleware
	middleware.Init()

	// server
	app := fiber.New()

	// CORS
	originsStr := os.Getenv("CORS_ALLOW_ORIGINS")
	if originsStr == "" {
		// Fallback for development if ENV not set, but not recommended for prod
		log.Println("CORS_ALLOW_ORIGINS env var not set. No specific origins will be allowed for CORS requests.")
		originsStr = "*"
	}
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("CORS_ALLOW_ORIGINS"),
	}))

	rateLimitMiddleware, err := middleware.NewRateLimiterManager()
	if err != nil {
		log.Fatal(err)
	}
	resource.RateLimiterManager = rateLimitMiddleware

	// log
	app.Use(requestid.New())
	zlog_log.Logger = zlog.New(os.Stdout)
	app.Use(middleware.RequestLogger)

	// app.Use(cache.New())
	resource.Cache = helper.NewCache(5 * time.Second)

	global.Init(app, resource)

	//app.Use(rateLimitMiddleware.RateLimit())
	app.Get("/swagger/*", swagger.New(swagger.Config{
		DefaultModelsExpandDepth: -1,
	}))

	// go func() {
	err = app.Listen(":" + PORT)
	if err != nil {
		log.Fatal(err)
	}
	// }()

	// swaggerApp := fiber.New()
	// swaggerApp.Get("/swagger/*", swagger.New(swagger.Config{
	// 	DefaultModelsExpandDepth: -1,
	// }))

	// SWAGGER_PORT := os.Getenv("SWAGGER_PORT")
	// if SWAGGER_PORT == "" {
	// 	SWAGGER_PORT = "5051"
	// }

	// err = swaggerApp.Listen(":" + SWAGGER_PORT)
	// if err != nil {
	// 	log.Fatal(err)
	// }
}
