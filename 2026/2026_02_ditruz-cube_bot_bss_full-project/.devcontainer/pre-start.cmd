@echo off
setlocal
set "GIT_SH="
for /f "delims=" %%G in ('where git 2^>nul') do if not defined GIT_SH set "GIT_SH=%%~dpG..\bin\sh.exe"
if not defined GIT_SH (
    echo [pre-start] ERROR: git not found in PATH
    exit /b 1
)
if not exist "%GIT_SH%" (
    echo [pre-start] ERROR: sh.exe not found at %GIT_SH%
    exit /b 1
)
"%GIT_SH%" "%~dp0pre-start.sh"
