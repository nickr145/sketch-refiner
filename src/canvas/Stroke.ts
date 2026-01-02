export type Point = [number, number];

export type Stroke = {
  id: string;
  points: Point[];
  width: number;
  color: string;
};
