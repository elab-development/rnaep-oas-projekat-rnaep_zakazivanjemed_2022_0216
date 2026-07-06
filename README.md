# MedConnect — Sistem za zakazivanje medicinskih pregleda

MedConnect je mikroservisna aplikacija za zakazivanje medicinskih pregleda koja omogućava pacijentima da pretražuju lekare, zakazuju, menjaju i otkazuju termine, dok lekari i administratori upravljaju rasporedima, ustanovama i medicinskim nalazima.

---

## Arhitektura sistema

Sistem se sastoji od sledećih mikroservisa:

| Servis | Port | Opis |
|--------|------|------|
| API Gateway | 8080 | Centralno rutiranje zahteva |
| User Service | 8081 | Upravljanje korisnicima, lekarima i ustanovama |
| Appointment Service | 8082 | Zakazivanje i upravljanje terminima |
| Medical Records Service | 8083 | Medicinska dokumentacija (MongoDB) |
| Notification Service | 8084 | Email/SMS notifikacije putem Kafka |
| Frontend | 3000 | React aplikacija |

### Infrastruktura

- **MySQL** (port 3307) — baza za User Service
- **MySQL** (port 3308) — baza za Appointment Service
- **MongoDB** (port 27017) — baza za Medical Records Service
- **Apache Kafka** (port 29092) — message broker (KRaft mod, bez Zookeeper-a)
- **Redis** (port 6379) — keširanje
- **Prometheus** (port 9090) — prikupljanje metrike
- **Grafana** (port 3001) — vizualizacija metrike

---

## Preduslovi

Pre pokretanja sistema, potrebno je imati instalirano:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (verzija 24+)
- [Git](https://git-scm.com/)
- Java 21 (samo za lokalni razvoj bez Dockera)
- Node.js 18+ (samo za lokalni razvoj bez Dockera)

---

## Pokretanje sistema pomoću Docker-a

### 1. Kloniranje repozitorijuma

```bash
git clone https://github.com/elab-development/rnaep-oas-projekat-rnaep_zakazivanjemed_2022_0216.git
cd rnaep-oas-projekat-rnaep_zakazivanjemed_2022_0216
```

### 2. Kreiranje .env fajla

U korenskom direktorijumu projekta kreirajte `.env` fajl sa sledećim sadržajem:

```bash
MAIL_USERNAME=vas.email@gmail.com
MAIL_PASSWORD=vas_gmail_app_password
```

> **Napomena:** Za `MAIL_PASSWORD` koristite Gmail App Password, a ne vašu Gmail lozinku.  
> App Password možete generisati na: Google nalog → Security → 2-Step Verification → App passwords

### 3. Pokretanje svih servisa

```bash
docker compose up --build -d
```

Ovo će automatski pokrenuti sve baze podataka, message broker, mikroservise, monitoring i frontend. Proces može trajati nekoliko minuta pri prvom pokretanju.

### 4. Provera statusa servisa

```bash
docker compose ps
```

Svi servisi treba da imaju status `running`.

### 5. Pristup aplikaciji

- **Frontend aplikacija:** http://localhost:3000
- **API Gateway:** http://localhost:8080
- **Grafana (monitoring):** http://localhost:3001 (admin/admin)
- **Prometheus:** http://localhost:9090

---

## Zaustavljanje sistema

```bash
docker compose down
```

Za zaustavljanje i brisanje svih podataka (baze):

```bash
docker compose down -v
```

---

## Lokalni razvoj (bez Dockera)

### Preduslovi

Pokrenite infrastrukturne servise:

```bash
docker compose up mysql-user mysql-appointment mongodb redis kafka -d
```

### Pokretanje mikroservisa

Pokrenite svaki servis iz IntelliJ IDEA ili iz terminala:

```bash
# User Service
cd user-service && ./mvnw spring-boot:run

# Appointment Service
cd appointment-service && ./mvnw spring-boot:run

# Medical Records Service
cd medical-records-service && ./mvnw spring-boot:run

# Notification Service
cd notification-service && ./mvnw spring-boot:run

# API Gateway
cd api-gateway && ./mvnw spring-boot:run
```

### Pokretanje frontenda

```bash
cd medical-platform-ui
npm install
npm run dev
```

Frontend će biti dostupan na: http://localhost:5173

---

## Korisničke uloge

| Uloga | Opis |
|-------|------|
| **Pacijent** | Registracija, pretraga lekara, zakazivanje/izmena/otkazivanje termina, pregled medicinske istorije |
| **Doktor** | Upravljanje rasporedom rada, pregled termina, unos medicinskih nalaza |
| **Admin** | Kreiranje profila lekara, upravljanje ustanovama, dodeljivanje specijalnosti i ustanova |

### Kreiranje Admin naloga

Admin nalog se kreira putem API poziva (nije dostupan kroz UI registraciju):

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"ime":"Admin","prezime":"Admin","email":"admin@test.com","lozinka":"admin123","uloga":"ADMIN"}'
```

### Privremena lozinka za lekare

Kada admin kreira profil lekara, automatski se dodeljuje privremena lozinka u formatu `{ime}123`.  
Primer: lekar sa imenom "Ivana" dobija lozinku `Ivana123`.

---

## Email notifikacije

Sistem automatski šalje email/SMS notifikacije u sledećim situacijama:

- Potvrda zakazanog termina
- Podsetnik 24 sata pre termina
- Obaveštenje o otkazivanju termina
- Potvrda izmene termina
- Obaveštenje da je medicinski nalaz spreman

---

## Seminarski rad — napredni koncepti

Projekat je proširen sa pet naprednih mikroservisnih koncepata.

### 1. Arhitektura vođena događajima (Apache Kafka)

Asinhrona komunikacija je migrirana sa RabbitMQ na Apache Kafka (KRaft mod). Poruke se razmenjuju kao JSON događaji.

**Topici (6):** `appointment-created`, `appointment-cancelled`, `appointment-rescheduled`, `appointment-reminder`, `appointment-completed`, `medical-record-created`.

**Produceri i consumeri:**
- **Appointment Service** — producer (događaji o terminima) i consumer (sluša `appointment-failed` za Saga kompenzaciju).
- **Notification Service** — consumer (email/SMS) i producer (`appointment-reminder`).
- **Medical Records Service** — hibridni modul (Processor).

**Hibridni modul (Processor):** Medical Records Service konzumira `appointment-completed`, kreira nacrt medicinskog kartona u MongoDB i objavljuje novi događaj `medical-record-created`, koji Notification Service hvata i obaveštava pacijenta da je nalaz spreman.

### 2. CI/CD (GitHub Actions)

Workflow `.github/workflows/ci.yml` okida se na `push` i `pull_request` (grane `main`, `develop`):
- **test** — pokreće `mvn verify` za svih 5 Java servisa (matrix strategija).
- **build** — gradi Docker image za svaki mikroservis, uključujući frontend.

### 3. Bezbednost aplikacije

- **IDOR** — svaki servis validira JWT (koji nosi `userId`); zaštićeni endpointi identitet uzimaju iz tokena, ne iz URL-a, uz proveru vlasništva nad resursom.
- **CORS** — centralizovano na API Gateway-u; dozvoljeni samo domeni klijentske aplikacije. Neautorizovani origin dobija `403`.
- **SQL Injection** — Spring Data JPA parametrizovani upiti; `@Query` koristi imenovane parametre bez konkatenacije.
- **CSRF** — bezstanjska JWT autentikacija preko `Authorization: Bearer` header-a; klasičan CSRF nije primenjiv jer se ne koriste sesijski kolačići.
- **XSS** — React enkodira izlaz (JSX); backend dodatno sanitizuje tekstualni unos pre upisa u bazu.

### 4. Monitoring (Prometheus + Grafana)

Svi Java servisi izlažu metriku preko Actuator/Micrometer endpointa `/actuator/prometheus`. Prometheus skuplja metriku sa svih 5 servisa, a Grafana prikazuje dashboard sa statusom servisa (UP/DOWN), brojem HTTP zahteva, JVM memorijom i CPU iskorišćenošću. Konfiguracija je u folderu `monitoring/`.

### 5. Saga patern

Implementiran je **choreography-based Saga** patern za konzistentnost pri zakazivanju termina, gde transakcija obuhvata dva servisa sa odvojenim bazama (MySQL i MongoDB), pa klasična ACID transakcija nije moguća.

**Tok:** Appointment Service upisuje termin (`ZAKAZAN`) i objavljuje `appointment-created` → Medical Records Service pokušava pripremu zapisa; pri grešci objavljuje kompenzacioni događaj `appointment-failed` → Appointment Service izvršava **kompenzacionu akciju** i postavlja termin na `OTKAZAN`. Time nema „polovične" transakcije.

---

## Tehnološki stack

**Backend:**
- Java 21, Spring Boot 4.1
- Spring Cloud Gateway 5.0.2
- Spring Data JPA (MySQL), Spring Data MongoDB
- Spring Kafka (Apache Kafka)
- JWT autentifikacija, Spring Security
- Micrometer + Prometheus (monitoring)

**Frontend:**
- React 18, TypeScript, Vite
- Tailwind CSS
- Axios, React Router

**Infrastruktura:**
- Docker, Docker Compose
- MySQL 8, MongoDB 7, Redis 7, Apache Kafka 3.8
- Prometheus, Grafana
- GitHub Actions (CI/CD)