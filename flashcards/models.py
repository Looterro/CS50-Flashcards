from django.db import models

# Create your models here.

class Flashcard(models.Model):
    front = models.TextField(blank=True)
    back = models.TextField(blank=True)
    learned = models.BooleanField(default=False)

    def __str__(self):
        return f"Flashcard #{self.id} front: \"{self.front}\" back: \"{self.back}\" "

    def serialize(self):
        return {
            "id": self.id,
            "front": self.front,
            "back": self.back,
            "learned": self.learned
        }