from fastapi import FastAPI
from app.routers import items
from app.settings import Settings

settings = Settings()
app = FastAPI(title='{{PROJECT_NAME}} API')

app.include_router(items.router)

@app.get('/')
def root():
  return {'message': '{{PROJECT_NAME}} API online', 'version': '1.0.0'}

@app.get('/healthz')
def health():
  return {'status': 'healthy'}