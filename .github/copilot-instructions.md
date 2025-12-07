# Weight Tracker Coplot Instructions

The general goal of this project is described in the [about document](../docs/_about.md).

## Project Structure

The project is a .NET backend with an Angular frontend.

The top level folders are organized as follows:
- .github: Contains GitHub specific files including copilot instructions.
- .vscode: Contains Visual Studio Code specific settings.
- docs: Contains project documentation.
- wt_backend_api: Contains the .NET backend code.
- wt_frontend: Contains the Angular frontend code.

Other projects can be added as needed. Should there be a need for additional backend projects, they will be added under the root directory and follow a naming convention such as `wt_backend_[project_name]`, even if this doesn't comply with the standard .NET naming convention for directories. Projects and solutions can still follow the standard .NET naming conventions.

Please follow the Angular guidelines provided in the file: [angular-guidelines.md](./angular-guidelines.md) for detailed guidelines.

Please follow the .NET guidelines provided in the file: [net-guidelines.md](./net-guidelines.md) for detailed guidelines.

## Technologies Used

ASP.NET Core: For the back-end of the web application.
Angular: For the front-end of the web application.
Entity Framework Core: For database access and management.
SQLite: For the database backend.
