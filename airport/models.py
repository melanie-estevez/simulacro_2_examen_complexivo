from django.db import models

class Gate(models.Model):
    code = models.CharField(max_length=10, unique=True)
    terminal = models.CharField(max_length=20)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.nombre

class Status(models.TextChoices):
        SCHEDULED = "programado", "Programado"
        BOARDING = "embarque", "Embarque"
        DEPARTED = "salida", "Salida"
        DELAYED =  "retrasado", "Retrasado"
        CANCELLED = "cancelado", "Cancelado"

    

class Flight(models.Model):
    gate = models.ForeignKey(Gate, on_delete=models.PROTECT, related_name="vuelos")
    flight_number = models.CharField(max_length=20)
    destination = models.CharField(max_length=20)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.SCHEDULED
    )
    departure_time = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.gate.code} {self.flight_number} ({self.destination})"