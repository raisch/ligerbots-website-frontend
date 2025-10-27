export interface Event {
  id: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  name: string;
  location: string;
  publish_on?: string;
  auto_publish?: boolean;
  description?: string;
}
