# 🚖 Putra Student Cab — Fare Estimator #

A Jakarta EE 10 web application for estimating campus ride fares at Universiti Putra Malaysia (UPM). Students can select a pickup and destination point on an interactive map, view the calculated route, and get an estimated fare instantly.

---

## 👥 Group 2 ##
| Name |
| Muhamad Towa bin Muhamad Buhari |
| Nabil Thaqif bin Saharuddin |
| Izz Hakimee Hiroshi bin Ludinata |
| Ammar Nazran bin Ahmad Nazri |

---

## ✅ Prerequisites ##

Make sure the following are installed before running the project:

| Tool | Version |
|------|---------|
| JDK | 21 |
| Apache TomEE | 10.1.5 (Plume or Plus) |
| MySQL / XAMPP | MariaDB 10.4+ |
| Apache NetBeans | 21+ |
| Maven | Bundled with NetBeans |

> TomEE **Plume** or **Plus** edition is required — not Web Profile. Plume/Plus includes JPA and EJB support.

---

## 🗄️ Database Setup ##

1. Start **XAMPP** and make sure **MySQL** is running.
2. Open **phpMyAdmin** at `http://localhost/phpmyadmin`.
3. Create a new database named `putra_student_cab`.
4. Select the database, go to the **Import** tab, and import the file: putra_student_cab.sql

---

## ⚙️ TomEE Datasource Configuration ##

Open `src/main/webapp/META-INF/context.xml` and make sure it contains:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Context path="/PutraStudentCab">
    <Resource name="jdbc/PutraStudentCabDS"
              type="javax.sql.DataSource"
              driverClassName="com.mysql.cj.jdbc.Driver"
              url="jdbc:mysql://localhost:3306/putra_student_cab?serverTimezone=UTC"
              username="root"
              password=""
              maxActive="10"
              maxIdle="5"/>
</Context>
```

> If your MySQL has a password, update the `password` field accordingly.

---

## 🚀 Running the Project ##

1. Open the project in **Apache NetBeans**.
2. Right-click the project → **Clean and Build**.
3. Make sure your TomEE 10.1.5 server is added under **Tools → Servers**.
4. Right-click the project → **Run**.
5. The app will open at: [(http://localhost:8080/PutraStudentCab/)](http://localhost:8080/PutraStudentCab/)

---

## 🗺️ How to Use ##

1. Type a pickup location in the **Pickup Location** search box and select from the suggestions.
2. Type a destination in the **Destination** search box and select from the suggestions.
3. Alternatively, **click directly on the map** to set points.
4. The route will be drawn automatically with distance and duration shown.
5. Click **Calculate Fare** to get the estimated fare.
6. Click **Reset** to start over.

---

## 🏗️ Project Structure ##
PutraStudentCab/

├── src/main/java/com/upm/putrastudentcab/

│   ├── ejb/

│   │   ├── FareCalculatorBean.java      # Fare calculation logic

│   │   ├── FareCalculatorLocal.java

│   │   ├── TripServiceBean.java         # Persists trip to database

│   │   └── TripServiceLocal.java

│   ├── entity/

│   │   └── Trip.java                    # JPA entity

│   └── ws/

│       ├── ApplicationConfig.java       # JAX-RS config

│       └── FareResource.java            # REST endpoint POST /api/fare

├── src/main/resources/META-INF/

│   └── persistence.xml

└── src/main/webapp/

├── index.xhtml                      # Main UI (JSF + Leaflet.js)

├── resources/js/map.js              # Map, search, routing logic

├── META-INF/context.xml             # TomEE datasource config

└── WEB-INF/

├── beans.xml

└── web.xml

---

## 💰 Fare Calculation Formula ##
Fare (RM) = 2.00 (base) + (distance_km × 0.80) + (duration_min × 0.15)

---

## 🛠️ Built With ##

### Enterprise Components (Jakarta EE 10)
- **EJB (Enterprise JavaBeans)** — Stateless session beans for fare calculation and trip persistence
- **JPA (Jakarta Persistence API)** — ORM mapping for the `Trip` entity via OpenJPA
- **JAX-RS (Jakarta RESTful Web Services)** — REST endpoint for fare calculation (`POST /api/fare`)
- **JSF (Jakarta Faces)** — Server-side UI templating (`index.xhtml`)
- **CDI (Contexts and Dependency Injection)** — Bean discovery and injection (`beans.xml`)

### Frontend / APIs
- **Leaflet.js** — Interactive map rendering
- **OpenStreetMap / Nominatim API** — Location search and geocoding
- **OSRM (Open Source Routing Machine) API** — Driving route and duration calculation

### Infrastructure
- **Apache TomEE 10.1.5** — Application server (Jakarta EE runtime)
- **MySQL / XAMPP (MariaDB 10.4+)** — Relational database
- **Maven** — Build and dependency management
