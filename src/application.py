import os

from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from .ai.naive_classifier import EmotionNaiveClassifier


app = FastAPI()
app.mount("/static", StaticFiles(directory="src/static"), name="static")
templates = Jinja2Templates(directory="src/templates")

clf = EmotionNaiveClassifier(path=f"{os.getcwd()}/data/emocoes/")


class Sentence(BaseModel):
    value: str
    classifier: str


@app.get("/")
async def index(request: Request):
    return templates.TemplateResponse("main/index.html", {"request": request})


@app.post("/classify")
async def classify(sentence: Sentence):
    return clf.predict(sentence.value)
