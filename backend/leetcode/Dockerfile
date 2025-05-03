# Giai đoạn build - dùng Gradle + JDK 21
FROM gradle:8.7.0-jdk21 AS build

# Copy mã nguồn vào container
COPY --chown=gradle:gradle . /home/gradle/project
WORKDIR /home/gradle/project

# Build ứng dụng (tạo file JAR)
RUN gradle build --no-daemon

# Giai đoạn chạy - dùng JRE 21 nhẹ
FROM eclipse-temurin:21-jre-alpine

# Tạo thư mục app và copy JAR
WORKDIR /app
COPY --from=build /home/gradle/project/build/libs/*.jar app.jar

# Expose cổng nếu Spring Boot chạy trên 8080
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]
