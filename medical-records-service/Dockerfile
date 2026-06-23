FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/medical-records-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", \
  "-Dspring.data.mongodb.uri=mongodb://root:root@mongodb:27017/medical_records_db?authSource=admin", \
  "-jar", "app.jar"]