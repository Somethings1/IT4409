FROM eclipse-temurin:21 AS build

WORKDIR /app
COPY . .

WORKDIR /app/leetcode/backend

RUN chmod +x ./gradlew
RUN ./gradlew build --no-daemon

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/leetcode/backend/gradle/wrapper/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
