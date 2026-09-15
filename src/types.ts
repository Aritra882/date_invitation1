export interface AllowedDate {
  dateString: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Wed, Sep 26"
  dayOfWeek: string;
  dayNumber: number;
  monthName: string;
  isWeekend: boolean;
}

export interface DateResponse {
  selectedDate: string;
  place: string;
  preferredTime?: string;
  note?: string;
  confirmedAt?: string;
}
