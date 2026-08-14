from rest_framework import serializers

class AirlineSerializer(serializers.Serializer):
    gate_id = serializers.IntegerField()  
    name = serializers.CharField(max_length=120)
    code = serializers.CharField(max_length=10)
    country = serializers.CharField(max_length=20)
    is_active = serializers.BooleanField(default=True)
    created_at = serializers.DateTimeField(required=False)

class EventType:
    CREATED = "creado"
    BOARDING_STARTED = "embarque inicial"
    DEPARTED = "salida"
    DELAYED =  "retrasado"
    CANCELLED = "cancelado"

    CHOICES = [
        (CREATED, "Creado"),
        (BOARDING_STARTED, "Embarque inicial"),
        (DEPARTED, "Salida"),
        (DELAYED, "Retrasado"),
        (CANCELLED, "Cancelado"),
    ]

class Source:
    WEB = "web"
    MOBILE = "movil"
    SYSTEM = "sistema"

    CHOICES = [
        (WEB, "Web"),
        (MOBILE, "Movil"),
        (SYSTEM, "Sistema"),
    ]
    

class FlightEventSerializer(serializers.Serializer):
    flight_id = serializers.IntegerField()        # ID de Vehiculo (Postgres)
    event_type = serializers.ChoiceField(
        choices=EventType.CHOICES,
        default=EventType.CREATED
    )
    source = serializers.ChoiceField(
        choices=Source.CHOICES,
        default=Source.WEB
    )
    note = serializers.CharField()    # No se envía desde el cliente; el backend asigna la fecha actual al crear
    created_at = serializers.DateTimeField(required=False)
    