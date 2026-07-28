@REM Maven Wrapper for Windows
@echo off
setlocal EnableDelayedExpansion

set "DIRNAME=%~dp0"
if "%DIRNAME:~-1%" == "\" set "DIRNAME=%DIRNAME:~0,-1%"

set "WRAPPER_JAR=%DIRNAME%\.mvn\wrapper\maven-wrapper.jar"

@REM Download maven-wrapper.jar if not present
if not exist "%WRAPPER_JAR%" (
    echo Downloading maven-wrapper.jar...
    powershell -Command "& { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; Invoke-WebRequest -Uri 'https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper-distribution/3.3.2/maven-wrapper-distribution-3.3.2-bin.zip' -OutFile '%DIRNAME%\.mvn\wrapper\mw.zip'; Expand-Archive -Path '%DIRNAME%\.mvn\wrapper\mw.zip' -DestinationPath '%DIRNAME%\.mvn\wrapper\tmp' -Force; Copy-Item '%DIRNAME%\.mvn\wrapper\tmp\*\maven-wrapper.jar' '%WRAPPER_JAR%' -Force; Remove-Item '%DIRNAME%\.mvn\wrapper\mw.zip', '%DIRNAME%\.mvn\wrapper\tmp' -Recurse -Force }"
)

@REM Run Maven
java "-Dmaven.multiModuleProjectDirectory=%DIRNAME%" -classpath "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*
