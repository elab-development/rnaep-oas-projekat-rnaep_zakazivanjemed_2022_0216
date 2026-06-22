FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY target/medical-records-service-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", \
  "-Dspring.data.mongodb.host=mongodb", \
  "-Dspring.data.mongodb.port=27017", \
  "-Dspring.data.mongodb.database=medical_records_db", \
  "-Dspring.data.mongodb.username=root", \
  "-Dspring.data.mongodb.password=root", \
  "-Dspring.data.mongodb.authentication-database=admin", \
  "-jar", "app.jar"]
