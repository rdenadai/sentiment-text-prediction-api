import os
import sys
import warnings

warnings.filterwarnings("ignore")

from string import punctuation
import pandas as pd
from nltk import word_tokenize
from nltk.stem import RSLPStemmer, SnowballStemmer
import spacy


class EmotionNaiveClassifier:
    def __init__(self, path="", negativo_validar_limite=3):
        self.neg = negativo_validar_limite

        self.alegria = pd.read_csv(f"{path}alegria", header=None)
        self.surpresa = pd.read_csv(f"{path}surpresa", header=None)
        self.confianca = pd.read_csv(f"{path}confianca", header=None)
        self.desgosto = pd.read_csv(f"{path}desgosto", header=None)
        self.medo = pd.read_csv(f"{path}medo", header=None)
        self.raiva = pd.read_csv(f"{path}raiva", header=None)
        self.tristeza = pd.read_csv(f"{path}tristeza", header=None)

        self.alegria.columns = ["emocao"]
        self.surpresa.columns = ["emocao"]
        self.confianca.columns = ["emocao"]
        self.desgosto.columns = ["emocao"]
        self.medo.columns = ["emocao"]
        self.raiva.columns = ["emocao"]
        self.tristeza.columns = ["emocao"]

        self.dataset = list(
            zip(
                [
                    "alegria",
                    "surpresa",
                    "confiança",
                    "desgosto",
                    "medo",
                    "raiva",
                    "tristeza",
                ],
                [
                    self.alegria,
                    self.surpresa,
                    self.confianca,
                    self.desgosto,
                    self.medo,
                    self.raiva,
                    self.tristeza,
                ],
            )
        )

        self.__rlsp_stemmer = RSLPStemmer()
        self.__snowball_stemmer = SnowballStemmer("portuguese")
        self.__lemmatizer = spacy.load("pt")

    def predict(self, phrase):
        coef_ = {
            "alegria": 0,
            "surpresa": 0,
            "confiança": 0,
            "desgosto": 0,
            "medo": 0,
            "raiva": 0,
            "tristeza": 0,
        }
        verificar_negacao = True if "não" in phrase or "sem" in phrase else False

        phrase = self.__lemmatizer(phrase)

        # Lemmatizer
        info = []
        for token in phrase:
            word = token.text
            info.append(
                {
                    "word": word,
                    "stem_rslp": self.__rlsp_stemmer.stem(word),
                    "stem_snowball": self.__snowball_stemmer.stem(word),
                    "lemma": token.lemma_,
                    "type": token.pos_,
                    "is_stopword": token.is_stop,
                }
            )

        for i, token in enumerate(phrase):
            for sent, df in self.dataset:
                word = token.text
                wd_ = df[(df["emocao"] == word) | (df["emocao"] == token.lemma_)]
                if wd_.size > 0:
                    negando = False

                    if verificar_negacao:
                        for m in range(self.neg):
                            if i - m >= 0:
                                if phrase[i - m] == "não" or phrase[i - m] == "sem":
                                    negando = True
                                    break

                    if not negando:
                        coef_[sent] += 1
                    else:
                        if sent == "surpresa":
                            coef_["tristeza"] += 0.25
                        elif sent == "confiança":
                            coef_["tristeza"] += 0.15
                            coef_["medo"] += 0.25
                        elif sent == "alegria":
                            coef_["tristeza"] += 0.15
                            coef_["desgosto"] += 0.25
                        elif sent == "desgosto":
                            coef_["alegria"] += 0.25
                        elif sent == "tristeza":
                            coef_["alegria"] += 0.25
                            coef_["confiança"] += 0.15

        coef_ = {sent: round(val, 3) for sent, val in coef_.items()}
        coef_["tristeza"] += coef_["medo"] * 1e-1
        coef_["tristeza"] += coef_["raiva"] * 1e-1
        coef_["confiança"] -= coef_["medo"] * 1e-1
        coef_["confiança"] = 0.0 if coef_["confiança"] < 0.0 else coef_["confiança"]
        coef_["raiva"] += coef_["medo"] * 1e-2
        coef_["raiva"] += coef_["desgosto"] * 1e-2
        coef_["alegria"] += coef_["confiança"] * 1e-2
        coef_["alegria"] += coef_["surpresa"] * 1e-2
        coef_ = {
            sent: round((val / (100 / len(phrase))) * 100, 2)
            for sent, val in coef_.items()
        }

        parsed = {"sintax": info, "emotions": coef_}

        return parsed
