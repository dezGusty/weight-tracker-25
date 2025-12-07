# Weight Tracker 25

A modern weight tracking web application built with .NET 10 and Angular 21.

## Features

- **Add Weight Entries**: Record your daily weight with optional notes
- **Edit Weight Entries**: Update existing entries
- **Delete Weight Entries**: Remove entries you no longer need
- **Visual Chart**: Interactive responsive chart showing weight trends
  - Mobile: Last 10 days
  - Tablet: Last 20 days
  - Desktop: Last 40 days
- **Weight History**: Scrollable list of all weight entries
- **Single User**: No login required - designed for personal use

## Technology Stack

### Backend

- **.NET 10** - Latest .NET framework
- **ASP.NET Core** - Minimal API pattern
- **Entity Framework Core 10** - ORM
- **SQLite** - Lightweight embedded database
- **Kestrel** - Web server

### Frontend

- **Angular 21** - Latest Angular framework
- **TypeScript** - Type-safe development
- **Chart.js** - Data visualization
- **ng2-charts** - Angular wrapper for Chart.js
- **Responsive Design** - Mobile-first approach

## Project Structure

```md
WeightTracker25/
├── backend/
│   └── WeightTrackerAPI/
│       ├── Models/
│       │   └── WeightEntry.cs
│       ├── Data/
│       │   └── WeightTrackerContext.cs
│       ├── Program.cs
│       └── weighttracker.db (created at runtime)
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── components/
│       │   │   ├── weight-form/
│       │   │   ├── weight-list/
│       │   │   └── weight-chart/
│       │   ├── models/
│       │   │   └── weight-entry.model.ts
│       │   ├── services/
│       │   │   └── weight.service.ts
│       │   ├── app.ts
│       │   └── app.config.ts
│       └── styles.css
├── docs/
│   ├── _about.md
│   └── day01.md
└── setup_dev_env.sh
```

## Prerequisites

- .NET 10 SDK
- Node.js 24+
- Angular CLI 21+
- Git

You can use the provided `setup_dev_env.sh` script to install all prerequisites on Fedora:

```bash
./setup_dev_env.sh
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd WeightTracker25
```

### 2. Start the Backend

```bash
cd backend/WeightTrackerAPI
dotnet run --urls "http://localhost:5000"
```

The backend will:

- Create the SQLite database automatically
- Run on <http://localhost:5000>
- Provide REST API endpoints at /api/weights

### 3. Start the Frontend

In a new terminal:

```bash
cd frontend
ng serve
```

The frontend will:

- Run on <http://localhost:4200>
- Connect to the backend API
- Auto-reload on file changes

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:4200
```

## API Endpoints

All endpoints are prefixed with `/api/weights`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weights` | Get all weight entries (ordered by date) |
| GET | `/api/weights/recent?limit={n}` | Get recent N entries (default: 40) |
| GET | `/api/weights/{id}` | Get a specific weight entry |
| GET | `/api/weights/date/{date}` | Get entry by date |
| POST | `/api/weights` | Create a new weight entry |
| PUT | `/api/weights/{id}` | Update an existing entry |
| DELETE | `/api/weights/{id}` | Delete a weight entry |

## Development

### Backend Development

The backend uses .NET 10's minimal API pattern for clean, concise endpoints. CORS is configured to allow requests from the Angular development server.

To add new features:

1. Update the `WeightEntry` model in `Models/WeightEntry.cs`
2. Add/modify endpoints in `Program.cs`
3. Database migrations are handled automatically with `EnsureCreated()`

### Frontend Development

The frontend uses Angular standalone components for a modern, modular architecture.

Key files:

- `weight.service.ts` - API communication
- `weight-form.ts` - Add/Edit form component
- `weight-list.ts` - Display and manage entries
- `weight-chart.ts` - Chart visualization

### Building for Production

#### Backend

```bash
cd backend/WeightTrackerAPI
dotnet publish -c Release -o ./publish
```

#### Frontend

```bash
cd frontend
ng build --configuration production
```

The production build will be in `frontend/dist/`

## Deployment

### Requirements

- Intel N100 or equivalent (x86_64)
- 4 GB RAM minimum
- Linux (Fedora 43+)
- .NET 10 runtime
- Web server (nginx recommended) for serving Angular files

### Deployment Steps

1. **Deploy Backend**:
   - Copy published backend to server
   - Configure as systemd service
   - Ensure database file permissions

2. **Deploy Frontend**:
   - Copy built Angular files to web server
   - Configure nginx to serve static files
   - Set up reverse proxy to backend API

3. **Configure**:
   - Update `apiUrl` in `weight.service.ts` for production
   - Configure CORS for production domain
   - Set up HTTPS certificates

## Database

The application uses SQLite with a single table:

**WeightEntries**

- `Id` (INTEGER, Primary Key)
- `Date` (TEXT, Unique Index)
- `Weight` (REAL)
- `Notes` (TEXT, Nullable)

The database file (`weighttracker.db`) is created automatically in the backend directory.

## Features in Detail

### Weight Entry Form

- Date picker (defaults to today)
- Numeric input for weight (kg, floating point)
- Optional notes field
- Validation: Prevents duplicate dates
- Edit mode: Pre-fills form with existing data

### Weight Chart

- Responsive design adapting to screen size
- Smooth line chart with filled area
- Interactive tooltips
- Auto-refresh capability
- Shows trend over time

### Weight List

- Chronological display (newest first)
- Edit and delete buttons for each entry
- Formatted dates
- Optional notes display
- Confirmation dialog for deletions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.
