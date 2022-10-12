from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("flashcards", views.flashcards, name="flashcards"),
    path("flashcards_compose", views.flashcard_compose, name="flashcard_compose"),
    path("flashcard_delete/<str:flashcard_id>", views.flashcard_delete, name="flashcard_delete"),

    path("flashcard/<str:flashcard_id>", views.flashcard, name="flashcard"),
]