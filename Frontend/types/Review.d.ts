export interface Review {
    id: int;
    userId: int;
    placeId : int;
    rating : int;
    comment: string;
    timestamp?: EpochTimeStamp;
    userName: string;
  }