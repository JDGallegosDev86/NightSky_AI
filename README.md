# NightSky AI

NightSky AI is a cross-platform mobile app for iOS and Android that helps users map local light pollution. Users can upload night sky photos with GPS data, and the app uses AI image classification combined with NASA Black Marble satellite data to estimate sky brightness and display results on an interactive light pollution map.

---

## Introduction

Light pollution is making it harder for people to observe the night sky, and current solutions lack detailed, localized data. NightSky AI solves this problem by combining user-submitted images with satellite data to provide a more accurate and community-driven view of light pollution.

---

## Alpha Features

By the end of the alpha phase, NightSky AI will include:

- User photo upload with GPS location
- AI classification of sky brightness using a CNN model
- Integration with NASA Black Marble dataset
- Interactive map displaying light pollution levels
- Basic user authentication (login/register)
- Backend API for data processing and storage

---

## Technologies Used

- **Frontend:** React Native (iOS + Android)
- **Backend:** Python / FastAPI
- **Database:** PostgreSQL with PostGIS
- **AI/ML:** PyTorch, OpenCV
- **APIs:** NASA Earthdata (Black Marble)
- **Tools:** GitHub, Jira, Figma, VS Code

---

## Project Structure

```text
NightSky_AI/
│
├── mobile-app/          # React Native app for iOS + Android
│   ├── src/
│   ├── assets/
│   ├── screens/
│   ├── components/
│   ├── android/
│   └── ios/
│
├── backend-api/         # Python FastAPI backend
│   ├── app/
│   ├── routes/
│   ├── services/
│   └── requirements.txt
│
├── ai-model/            # PyTorch/OpenCV CNN model
│   ├── training/
│   ├── inference/
│   └── datasets/
│
├── docs/                # Jira screenshots, wireframes, style tile, pitch deck
│
├── README.md
├── .gitignore
└── .env.example
```
## Development Setup
- Use VS Code for development
- Each team member works on a feature branch
- Follow GitHub workflow with pull requests

## Team Workflow
- main branch remains stable
- Create feature branches for all work
- Use Jira ticket numbers in commits

## Contributors
[ALL] – Project Setup / Full Stack
[ALL] – AI/ML Engineer
[ALL] – Frontend Developer
[ALL] – Backend Engineer

## Project Status
Currently in Alpha Development Phase
Core systems are being built including:

- GitHub structure
- Backend API
- AI model pipeline
- Mobile UI foundation

## Roadmap
- Improve AI model accuracy
- Add real-time data updates
- Enhance UI/UX design
- Implement notifications and alerts
- Expand dataset and analytics

## License
This project is licensed under the MIT License.  
