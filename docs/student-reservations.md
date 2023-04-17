# Student Reservations Feature

## Overview

- The purpose of the project's feature is to create a reservation system and allow students to reserve for a desk at The Experience Lab (XL). The primary use for the website will most likely be for the students who are enrolled at UNC Chapel-Hill and wants to reserve a desk to study, have an access to external monitor, or borrow other equipments for their needs since a lot of students at UNC Chapel-Hill do not have access to these resources. This will bring so many values to the community because having these resources at a university is not very common, and reserving a table or equipment Experience Lab (XL) will enable UNC students to have different experiences.

- In the **Reservation-Feature**, the goal of the feature was to create a easy to access reservation system for students. The implementations were done in 3 general steps:
1. Creating a database using **SQLAlchemy** to store available desks and student users.
    - The database was created using `Model` and `Entities`. Entities involved naming the table and assigning the fields to their appropriate data types.
    - Foreign keys were also implemented in this step where in `desk_reservation_entity.py`, there was a foreign key for the desk with desk ID. `desk_id: Mapped[int] = mapped_column(ForeignKey('desk.id'), nullable=True)`.

2. Creating Front-end interface for the students to reserve a desk.
    - Angular was used to develop the front-end interface.
    - `desk-reservation.service.ts` was created to integrate the back-end with front-end. Inside the Desk Reservation Service, there was a call to **create reservation** and **cancel reservation**.
    - 2 Components were created: `reservation-dialog` and `reservation`. The purpose of the `reservation-dialog` component was to allow students to select the date they want to reserve the desk and populate the data with the `reservation` service.
3. Creating a Back-end to integrate with front-end to view real-time access to the database.
    - `Reservation` Service was also created in the back-end to define all the functions necessary to reserve a desk or look at the available desks. In the Reservation Service, there were functions such as `list_available_desks`, `list_desk_reservation_by_user`, `create_desk_reservation`, `remove_desk_reservation`, etc. All of the functions used SQLAlchemy to select the needed values from the database.

## Implementation Notes

- The database/entity-level representation involves 2 main aspects, `Desk` and `Desk Reservation`. The purpose of creating the `Desk` entity was to initialize all the desks that are available in the Experience Lab (XL). Creating this model/entity was the first step because without having any desks, students would not be able to reserve any desks. The `Desk` entity invovles fields `id`, `tag`, `desk_type`, `included_resource`, and `available`. These fields are very important to distinguish the different desks that are all available in the lab. The `Desk Reservation` Entity was used to create a relationship between the desk and reservation system. Since the reservation system would require what desk was reserved by a student, it was important to create a relationship between the `User` entity and `Desk` entity. `Desk Reservation` entity allows the bonding between the 2 entities.

- In the Reservation System implementation, there were some design choices that the team made to allow easier way for users to reserve a desk. In order to reserve a desk, the user will first have to create a new profile after they log-in. We chose to have users sign-up with a profile over allowing them to create a reservation without creating a profile because we thought it was important for the students to create a profile before they reserve anything. This way, the database will be able to track first name and last name along with their PID instead of just having an access to the PID. Another design choice we made was that we chose to create a separate tab for equipment reservation from desk reservation because we thought it was better to allow students to reserve them separately. Students should be able to reserve equipments without reserving a table, so that is the design choice our team went with.

## Development Concerns

- If a new developer wanted to start working on the reservation feature, it would be very important to read the authentication documents and look into the `Reservation Service` in the backend and `Desk-Reservation Service` in the front-end. These two implementations will allow the developer to figure out how the front-end, back-end, and the database communicates with one another and have a better understanding of the project itself. If they are able to get a good sense of how those 2 files work, it will be a lot easier to implement other features that are needed.

- I will specifically point to `backend/services/reservation.py` and `frontend/src/app/desk-reservation.service.ts`

- There will be nothing special they need to get it started. One thing to keep in mind is to fully understand how the entities and relationships work in the database.

## Future Work

There could be a lot of ways in the direction this feature could take. Having a more dynamic reservation system where they are able to reserve a specific time of the day and the length of their reservations will be very helpful. If our team had more time, we would focus on making sure the time aspects are put in place along with picking the date and change some parts of the feature where they can reserve different desks at a different time. It would also be great to add in time-limits for each reservation (Ex. Having a max time limit of 2 hours for a desk). All these features will be very nice to have in addition to the current features. 