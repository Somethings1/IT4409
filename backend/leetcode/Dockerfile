# ----- Build stage -----
FROM gradle:8.7.0-jdk21 AS build

# Đặt thư mục làm việc
WORKDIR /app

# Chỉ copy các file cấu hình trước để tận dụng cache
COPY backend/leetcode/build.gradle backend/leetcode/settings.gradle backend/leetcode/gradle.properties ./backend/leetcode/
COPY gradle ./gradle
COPY gradlew ./

# Tải về các dependency trước
WORKDIR /app/backend/leetcode
RUN gradle dependencies --no-daemon

# Copy toàn bộ mã nguồn vào container
WORKDIR /app
COPY . .

# Build project bằng Gradle global
WORKDIR /app/backend/leetcode
RUN gradle build --no-daemon

# ----- Runtime stage -----
FROM eclipse-temurin:21-jre-alpine

# Tạo user không phải root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy file JAR từ giai đoạn build
COPY --from=build /app/backend/leetcode/build/libs/*.jar app.jar

# Chuyển quyền sở hữu file cho user không phải root
RUN chown appuser:appgroup app.jar

# Chạy ứng dụng với user không phải root
USER appuser

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]