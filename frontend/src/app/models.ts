export interface Desk {
    id: number;
    tag: string;
    desk_type: string;
    included_resource: string;
    available: boolean;
  }

export interface DeskReservation {
    id: number;
    desk_id: number;
    user_id: number;
    date: string;
}

export interface DeskReservationEntry {
    date: string;
}

export interface DeskReservationTuple {
    item: [[DeskReservation, Desk]];
}