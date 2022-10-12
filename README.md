# CS50-Flashcards

This project is based on Harvard's CS50Beyond idea of React.JS flashcards. It's a single page app written using Django framework, built-in API and Ajax, React.JS and Python language.

## Setup

Clone this repository and change directory to mail:

```bash
git clone https://github.com/Looterro/CS50-Flashcards.git
cd flashcards
```

Install Django:
```bash
python3 -m pip install Django
```

Setup database and run the development server using commands:
```bash
python manage.py makemigrations flashcards
python manage.py runserver
```

## Specification:

**Sections**

-User can change between the editor section for creating flashcards and the viewer section where one card appears at the time, which can be clicked on to display its back or front. The next button in the viewer section takes the user to another card.

**Add and remove cards**

-Using Ajax and by changing the state of the components the user is able to add the fron and the back of the flashcards

**Shuffle cards**

-In the card viewer section user can shuffle the array of created cards. The array is a copy of the database, so it doesnt impact the original order of the cards.

**Mark as learned**

-Both in card viewer and card editor section user is able to mark a given card as learned, which updates the state of the copy of the cards as well as the database.


