export interface Package {
  name: string;
  location: string;
}

export interface PackageManager {
  getPackages(): Package[];
}
