/** Mirrors the API's items table shape. */
export interface Item {
  id: string;
  name: string;
  status: "active" | "archived";
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}
