import { Participation } from "@models/Participation";

export interface Olympic {
  id: number,
  country: string,
  participations: Participation[]
}
