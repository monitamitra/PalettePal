FROM openjdk:17-jdk-slim

VOLUME /tmp
COPY target/my-backend-0.0.1-SNAPSHOT.jar app.jar

# Explicitly tell Spring Boot where to bind
ENTRYPOINT ["java", "-jar", "/app.jar", "--server.port=8080", "--server.address=0.0.0.0"]
