# Redline
> Bachelor thesis Wouter Vlaeyen | Artevelde 2020

## To-do

- [x] Split Auth API into Auth and User
- [x] User settings
- [x] Add password forget flow
  - [x] Send email on reset request
  - [x] Generate code for user
  - [x] Create views and routes to generate new password
- [x] Edit and delete events in client (API is ready)
- [x] Create module for emails
- [x] Calculate distance between user and event
- [x] Filter events based on type, distance and search query
- [x] Fix navbar
- [x] Albums API
  - [x] GET, create, update and delete
  - [x] Extra functionality (Deleting single photos, adding photos to albums)
- [x] Albums creation in client
- [x] Album pages in client
  - [x] Overview + linked in event and user
  - [ ] Lightbox for image?
- [x] Admin options to edit and delete data/users
- [ ] Reporting for users/albums/events
- [x] Make sure layout is responsive
- [ ] PWA optimizations
- [ ] Logo
- [x] **Deployment**
- [ ] Test on deployed version

## Extra ideas (time-permitting)
- [ ] VIN Decoding for vehicle info
- [x] Store cookie for session (loads user into vue store on load)
- [ ] Add seeder for default data
- [ ] Prices for events (Free / Free for visitors / Entry Price)
- [ ] If possible, look for options for feed