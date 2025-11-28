import { ObjectId } from "mongodb";

export interface INote {
  _id?: ObjectId;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
}
