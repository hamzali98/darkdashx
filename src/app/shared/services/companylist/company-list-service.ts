import { Injectable } from '@angular/core';
import { companyInterface } from '@app/shared/interface/company';

@Injectable({
  providedIn: 'root',
})
export class CompanyListService {

  private readonly companies: companyInterface[] = [
    { key: "Google", value: "google" },
    { key: "Facebook", value: "facebook" },
    { key: "Linkedin", value: "linkedin" },
    { key: "Pinterest", value: "pinterest" },
    { key: "Reddit", value: "reddit" },
    { key: "Spotify", value: "spotify" },
    { key: "Twitter", value: "twitter" },
    { key: "Youtube", value: "youtube" },
  ];

  getCompanyList(): companyInterface[] {
    return this.companies;
  }
}
