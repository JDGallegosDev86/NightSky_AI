# NightSky AI

NightSky AI is a cross-platform mobile app for iOS and Android that helps users map local light pollution. Users can upload night sky photos with GPS data, and the app uses AI image classification with NASA Black Marble data to estimate sky brightness and display results on a light pollution map.

## Project Structure

- `frontend/` - Cross-platform mobile app UI
- `backend/` - Python/FastAPI backend API
- `ai_model/` - AI model training and inference code
- `docs/` - Wireframes, style tile, planning documents, and screenshots

## Team Workflow

- `main` should stay stable
- Each teammate should create a feature branch
- Pull requests should be reviewed before merging
- Jira ticket numbers should be included in branch names and commits

Branch example:

feature/NA-37-github-folder-structure
feature/NA-38-readme-setup
bugfix/NA-39-upload-validation
docs/NA-40-add-wireframes

React Native = mobile app frontend
Python/FastAPI = backend API + AI processing
PostgreSQL/PostGIS = database + location data
PyTorch/OpenCV = image classification model

##NightSky_AI/
#│
#├── #mobile-app/          # React Native app for iOS + Android
#│   #├── src/
#│   #├── assets/
#│   #├── screens/
#│   #├── components/
#│   #├── android/
#│   #└── ios/
#│
#├── #backend-api/         # Python FastAPI backend
#│   #├── app/
#│   #├── routes/
#│   #├── services/
#│   #└── requirements.txt
#│
#├── #ai-model/            # PyTorch/OpenCV CNN model
#│   #├── training/
#│   #├── inference/
#│   #└── datasets/
#│
#├── #docs/                # Jira screenshots, wireframes, style tile, pitch deck
#│
#├── #README.md
#├── #.gitignore
#└── #.env.example
