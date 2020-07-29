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
- [x] Test on deployed version

## Extra ideas (time-permitting)
- [ ] VIN Decoding for vehicle info
- [x] Store cookie for session (loads user into vue store on load)
- [ ] Add seeder for default data (Categories, possibly admin user?)
- [ ] Prices for events (Free / Free for visitors / Entry Price)
- [ ] Edit reviews

## To Fix before deadline (12/08)
- [x] Placeholders for username & password at login (Capitalised)
- [x] Only positive distances in filters
- [x] Fix Date Range (only allow past from date for to date)
- [x] Check errors in register, add rules to form
- [x] Validate username/password before next step
- [x] fix Toast error handling
- [x] Name card (fix long names)
- [x] Fix role bug on register (if still exists)
- [x] Add supported image formats to upload
- [x] Validate vehicle input on submit (which should've happened already)
  - [x] Handle multiple errors on front-end
- [x] Error handling for images
- [x] Vehicle Delete
- [x] Fix Deployment Script on Server
- [ ] Tweak form in modal on large screens
- [ ] Better way to ask permissions (geolocation)
- [ ] Switch to native datetime input (And fix Firefox support for it)
- [ ] Horizontal scrollbar in events page? (Not happening on macbook)
- [ ] Move site to subdomain