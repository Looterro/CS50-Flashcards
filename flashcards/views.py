from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from django.core.exceptions import ObjectDoesNotExist
from .models import Flashcard
import json

# Create your views here.

def index(request):
    return render(request, "flashcards/index.html")

def flashcards(request):

    flashcards = Flashcard.objects.all()

    if request.method == "GET":
        return JsonResponse({
            "flashcards": [flashcard.serialize() for flashcard in flashcards],
        }, safe=False)

@csrf_exempt
def flashcard_compose(request):
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    front = data.get("front", "")
    back = data.get("back", "")

    try:
        check_front = Flashcard.objects.get(front = front)
        check_back = Flashcard.objects.get(back = back)
        if (check_front == front and check_back == back):
            return JsonResponse({"error": "front and back value already exists"}, status=400)
            
    except ObjectDoesNotExist:

        flashcard = Flashcard(
            front = front,
            back = back,
            learned = False,
        )

        flashcard.save()

        return HttpResponse(status=204)

@csrf_exempt
def flashcard_delete(request, flashcard_id):
    
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)
    
    flashcard = Flashcard.objects.get(id = flashcard_id)

    flashcard.delete()
    return HttpResponse(status=204)

def flashcard(request, flashcard_id):

    flashcard = Flashcard.objects.filter(id = flashcard_id)

    if request.method == "GET":
        return JsonResponse({
            "flashcard": [flashcard.serialize() for flashcard in flashcard]
        }, safe=False)