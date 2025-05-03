FROM gradle:8.7.0-jdk21 AS build

# Đặt thư mục làm việc
WORKDIR /app

# Copy toàn bộ mã nguồn vào container
COPY . .

# Di chuyển vào thư mục chứa backend
WORKDIR /app/backend/leetcode

# Build project bằng Gradle global (KHÔNG cần ./gradlew)
RUN gradle build --no-daemon

# ----- Runtime stage -----
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy file JAR từ giai đoạn build
COPY --from=build /app/backend/leetcode/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
