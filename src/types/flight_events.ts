export type FlightEvent = {
  id: string;
  flight_id: number;       // Postgres
  event_type: string;   // Mongo
  source: string;             // backend asigna fecha al crear (NO se envía desde app)
  note: string;
  created_at?: string;
};