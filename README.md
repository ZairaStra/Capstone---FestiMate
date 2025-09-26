🎶 FestiMate – Festival & Camping Reservation System

🌟 About the Project  
FestiMate is my personal capstone project for the Full-Stack Web Developer Diploma at EPICODE School.  
It's entirely designed and developed by myself, from database modeling and backend logic to frontend development and user experience, as a showcase of the skills I acquired during the course.
The project represents both a technical challenge and a personal idea that I wanted to bring to life.

💡 Why This Project?  
I chose to work on festivals because I have a great passion for music and this kind of event, so I knew that a web app of this type (which integrates multi-festival search and booking of concert tickets and accommodations) was not yet available on the market.

From the technical side, I wanted to challenge myself with a project complex enough to simulate real-world cases, like:

- Managing different user roles with permissions
- Handling reservations and availability
- Designing a relational database with multiple entities and relationships
- Building a full-stack application from scratch
- Implementing an interactive map for booking

That’s why FestiMate represents both my personal passion and the skills I gained along my full-stack developer journey.

📌 Main Features

👤 Public Users

- Register and create a personal profile
- Browse festivals and artists
- Add festivals to their wishlist
- Book festival tickets
- Reserve camping units via an interactive map

🛠️ Admins

- Manage festivals, artists, and lineups
- Handle camping setup and availability
- Oversee reservations
- Different admin roles:
  - SYSTEM_ADMIN → manage admins
  - ARTIST_MANAGER → manage artists
  - FESTIVAL_MANAGER → manage festivals, camping, lineups
  - RESERVATION_MANAGER → manage reservations
  - USER_MANAGER → manage PublicUsers

🗂️ Project Structure

- capstone_be/ → Backend (Java, Spring Boot, JPA/Hibernate, PostgreSQL)
- capstone_fe/ → Frontend (ReactBootstrap)
- .git/ → Git versioning

🛠️ Technologies Used

- Backend: Java 17+, Spring Boot, JPA/Hibernate, Maven
- Frontend: React Bootstrap
- Database: PostgreSQL
- Authentication: Spring Security + JWT
- Integration: CORS configuration to connect Frontend & Backend
- File Storage: Cloudinary (images, maps)
- Mail Service: Mailgun (notifications)
- Version Control: Git & GitHub

🗺️ Frontend Structure

The frontend is fully responsive and provides a smooth user experience across devices.

🏠 Homepage

- Dynamic navbar (guest, user, admin)
- Hero section with carousel
- Search bars
- Footer (social pages, contacts)

🔑 Authentication & Users

- Pages: /login, /register, /profile
- JWT token management on the frontend

🎶 Festival Catalog

- /festivals page with searchable festival list and filters
- /festival/:id page with festival details:
- General info
- Lineup button/modal
- “Buy Tickets” button

🎶 Artists Catalog

- /artists page with searchable artist list and genre filter
- /artists/:id page with artist details:
- General info
- “View Festivals” button

👤 Public User Area

⭐ Wishlist

    - /public-users/me/wishlist page to view saved festivals

⭐ Reservations

    - /reservations/me page to view all reservations

🎫 Reservation

- /reservations/me/register page:
  - Form for ticket selection (number of tickets, dates)
  - Accommodation choice on interactive camping map
  - Confirmation button
- Redirect to /reservations/me after booking

👤 Profile

- /me page:
- View/edit all personal data
- Delete Account button

🛠️ Admin area

⚙️ Backoffice

    - /backoffice page:
      - Role-based access control
      - CRUD UI with tables and modals


    👤 Profile

    - /me page:
    - View/edit some personal data

⚙️ Backend Structure

The backend is built with Java + Spring Boot, following REST principles and layered architecture (Controller → Service → Repository). It integrates authentication, database management, APIs, and external services.

📂 Database Structure (ERD scheme attached)

- Users & Roles

  - User (abstract): base entity with common fields (`username`, `email`, `password`, etc.)
  - PublicUser: registered user who can manage wishlist and reservations
  - Admin: user with managerial privileges (role, department, hire date)

- Festivals

  - Core data: `name`, `location`, `dates`, `dayPrice`, etc.
  - Relations:
    - Wishlist (many-to-many with PublicUser)
    - Lineup (many-to-many with Artist + attributes)
    - Camping (one-to-one)

- Artists & Lineup

  - Artist: `name`, `genre`, `coverImg`, `link`
  - Lineup: association between Festival and Artist, with `date`, `startTime`, `endTime`

- Camping

  - Each Festival can have a maximum of one Camping
    Camping includes:
  - AccommodationType: defines unit type, capacity, price per night, availability
  - CampingUnit: single spot or unit with `spotCode`, `status`

- Reservations
  - Reservation: links PublicUser and Festival with details (`startDate`, `endDate`, `numTickets`, `totalPrice`)
  - ReservationCampingUnit: join table between Reservation and CampingUnit (many-to-many)

🔗 Main Relationships

- `User → PublicUser / Admin` (inheritance, JOINED strategy)
- `PublicUser ↔ Wishlist ↔ Festival` (many-to-many)
- `PublicUser ↔ Reservation` (one-to-many)
- `Festival ↔ Camping` (one-to-one)
- `Camping ↔ AccommodationType ↔ CampingUnit` (one-to-many)
- `Reservation ↔ CampingUnit` (many-to-many)
- `Festival ↔ Lineup ↔ Artist` (many-to-many with attributes)

🚀 API Overview

- Auth API: login, register (only PublicUser self-registers)
- User API: manage user profile
- Wishlist API: add/remove festivals (PublicUser only)
- Admin API: CRUD admins (SYSTEM_ADMIN only)
- Festival API: CRUD festivals, multiparametric queries (FESTIVAL_MANAGER only)
- Camping API: upload and manage camping maps in SVG, auto-generate units (FESTIVAL_MANAGER only)
- Lineup API: assign artists, manage schedules (FESTIVAL_MANAGER only)
- Artist API: CRUD artists (ARTIST_MANAGER only)
- Reservation API: search and manage bookings (RESERVATION_MANAGER only)

📌 Extra Features

- Cloudinary → store images (festival covers, user profile, camping maps)
- Mailgun → confirmation emails on registration, booking and reservation cancellation

🛠️ Future Improvements

- Modal for CRUD Lineup in Backoffice/ FESTIVAL_MANAGER
- React-Redux, Typescript integration
- SASS integration
- Stripe integration for payments
- Deploy on cloud platform

🚀 Run the project

- Prerequisites

  - Java 17+
  - Node.js 16+
  - PostgreSQL
  - Maven

- Installation
  1. Clone the repository
  2. Setup database and environment variables
  3. Run backend: `mvn spring-boot:run`
  4. Run frontend: `npm start`

🗂️ Github Repository url

- https://github.com/ZairaStra/Capstone---FestiMate

🎓 Conclusion  
FestiMate is more than just a diploma project: it’s a real-world application idea that combines my passion for festivals with the full range of skills I gained as a full-stack developer.
