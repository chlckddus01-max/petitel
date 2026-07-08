# 저장소 루트에 둔다 — Railway 등 대부분의 플랫폼이 "Root Directory"를 따로 설정하지 않아도
# 저장소 최상단의 Dockerfile을 기본으로 인식하기 때문에, 모노레포(frontend/backend 공존) 구조에서
# 별도 UI 설정 없이도 빌드되게 하려는 목적. 그래서 COPY 경로에 backend/를 직접 명시한다.

FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY backend/gradlew backend/settings.gradle backend/build.gradle ./
COPY backend/gradle gradle
RUN chmod +x gradlew

COPY backend/src src
RUN ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
