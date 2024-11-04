export type User = {
  _id: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  actions: string;
  name: string;
  password: string;
  gender: string;
  dob: string;
  image: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
  expireOtp?: string | Date | undefined;
  otp: number;
  role: string;
  docStatus?: String;
  rejectReason?: String;
  location: string;
  nationality: string;
  emergencyContact: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  locationName: object;

  createdAt: string;
  updatedAt: string;
  __v: boolean;
};

export type UserApiResponse = {
  data: User[];
  page?: number;
  currentPage: number;
  totalEntries: number;
};
