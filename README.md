# WebApp
Repository for Lab Assignments for course DAT076 / DIT126 Web applications

# Project File Structure
This document describes the organization of directories and key files within Gift Genie repository. It serves as a map to locate different parts of the application and documentation.

## Repository Structure Overview

The repository consists of two main directories, each containing specific aspects of the project:

- `/client`: Contains all the front-end code, built using React.js.
  - `/build`: Compiled and minified production build of the React application.
  - `/public`: Static files like HTML template, favicon, and manifest file.
  - `/src`: Source files for the React application.
    - `/components`: React components.
    - `/css`: Stylesheets for the application.
    - `/images`: Image assets used in the application.
    - `/services`: Services for handling API calls.
    - `/testing`: Tests for the React components.
    - `/views`: React components representing entire pages.

- `/server`: Contains all back-end code, built using Node.js and Express.js.
  - `/db`: Database configurations and models.
  - `/src`: Source files for the Express server.
    - `/model`: Data models.
    - `/router`: API routes.
    - `/service`: Services containing business logic.
  - `/testing`: Tests for the back-end logic and endpoints.

- `/client_mockup`: Previous front-end code

## Final Report
The final report for the project is located in the `/docs` directory at the root level of this repository:

- `/docs`: Contains documentation related to the project.
  - `Webapplications_DAT076.pdf`: The comprehensive report detailing the entire project.

