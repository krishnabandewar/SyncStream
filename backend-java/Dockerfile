FROM amazoncorretto:8

WORKDIR /app

# Copy the build artifact
# In a real pipeline, we would run 'mvn package' first
COPY target/backend-java-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
