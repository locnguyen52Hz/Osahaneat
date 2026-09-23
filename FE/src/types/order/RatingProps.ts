export interface RatingProps {
  value?: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}
