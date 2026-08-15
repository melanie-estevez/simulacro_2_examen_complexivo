import { http } from "./http";
import type { FlightEvent } from "../types/flight_events";
import type { Paginated } from "../types/drf";

export type FlightEventCreatePayload = {
  flight_id: number;
  event_type: string;
  source: string;
  note: string;
  creted_at?: string;
};

export async function listFlightEventsApi(): Promise<Paginated<FlightEvent> | FlightEvent[]> {
  const { data } = await http.get<Paginated<FlightEvent> | FlightEvent[]>("/api/flight-events/");
  return data;
}

export async function createFlightEventApi(payload: FlightEventCreatePayload): Promise<FlightEvent> {
  const { data } = await http.post<FlightEvent>("/api/flight-events/", payload);
  return data;
}

export async function deleteFlightEventApi(id: string): Promise<void> {
  await http.delete(`/api/flight-events/${id}/`);
}