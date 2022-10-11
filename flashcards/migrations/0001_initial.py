# Generated by Django 4.1 on 2022-10-11 08:51

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Flashcard',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('front', models.TextField(blank=True)),
                ('back', models.TextField(blank=True)),
                ('learned', models.BooleanField(default=False)),
            ],
        ),
    ]
