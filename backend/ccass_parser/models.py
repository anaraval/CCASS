from django.db import models

class Parser(models.Model):
    datestring = models.CharField(max_length=20)
    shareholding = models.IntegerField()
    company = models.CharField(max_length=100)
    stockcode = models.CharField(max_length=100, default='')