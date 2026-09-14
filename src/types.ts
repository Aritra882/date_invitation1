export interface AllowedDate {
  dateString: string; // YYYY-MM-DD
  displayDate: string; // e.g. "Wed, Sep 16"
  dayOfWeek: string;
  dayNumber: number;
  monthName: string;
  isWeekend: boolean;
}

export interface DateResponse {
  selectedDate: string;
  place: string;
  note?: string;
  confirmedAt?: string;
}
