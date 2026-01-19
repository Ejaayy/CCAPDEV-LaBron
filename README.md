# CCAPDEV-LaBron: Lab Reservation System

The following describes the features of a computer laboratory slot (seat) reservation web application. Groups must include at least three computer labs in the system. The minimum features required to be implemented for this project are as follows:

## View Slot Availability
  o A user may choose a computer lab and see the current available seats of the chosen lab. 
    The user may opt to see the availability of the lab at other times for the next 7 days. 
    A user must be a student user to reserve a seat.
  o Note: Users may see who reserved a seat, as long as the reservee did not make the reservation anonymously. 
    Clicking on a user’s name should link to that user’s profile. Availability must also update periodically so that the user does not need to refresh every time.

## Register
  o A visitor must register if they want to reserve a lab slot. 
    The visitor must enter their DLSU email and a password. 
    There should be 2 kinds of accounts: the student who can reserve lab slots, and the lab technician that can block a time slot for walk-in students.

## Login
  o After registering properly, a visitor may log in. Upon logging in, the option to reserve a slot will be open. 
    The user is given the option to be “remembered” by the website. When the user chooses this option, every login and visit to the website will extend their “remember” period by 3 weeks.

## Logout
  o The user may log out from their account. 
    This should cut short the “remember” period if it exists and clear any session-related data.

## Reserve
  o Students can reserve slots that have not yet been taken. 
    Lab slots are in intervals of 30 minutes. 
    The student also has the option whether to reserve anonymously or not. 
    The student can reserve more than one slot, and all the lab slots will be made under one reservation. 
    A student may not reserve a previously reserved slot.

## Reserve for a student
  o Lab technicians can make a reservation for walk-in students.

## Remove reservation
  o Lab technicians have the ability to remove reservations of students who do not show up within 10 minutes of the reservation. 
    This facility is only available 10 minutes of the actual reservation time. This will cancel the whole reservation.

## Edit reservation
  o A student can edit reservations they previously made.
  o Lab technicians are able to edit any reservations.

## See reservations
  o A user may check their reservations. 
    They can see details such as the seat number, the laboratory, the date and time of request, and the date and time of reservation.

## View / Edit User profile
  o Registered users may edit their own profile, which includes a profile picture and description. 
    Additionally, the profile should also list the student’s current reservations.
  o Users may also view another user’s public profile, but they are not able to edit it.

## Delete User Account
  o Students have the option to delete their own account, ultimately deleting their account and cancelling any pending reservations they may have.

## Search for users / free slots
  o Users can view all the available slots given a provided date and time, and the lab.

## General
  o Good user experience. Visitors can easily navigate without help, all information is easy to access. 
    Good visual design. Design suits the theme of the application, and is cohesive and consistent across the whole application.
