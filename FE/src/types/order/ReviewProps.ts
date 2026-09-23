export interface ReviewProps {
  onSubmit: (rating : number) => void;
  rating?: number;
  loading: boolean;
}
