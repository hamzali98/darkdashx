import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, OnDestroy } from '@angular/core';
import { product } from '../products/interface/product-interface';
import { User } from '@app/features/users/interface/user';
import * as XLSX from 'xlsx';
import { TranslateService } from '@ngx-translate/core';

export interface productChart {
  team: string,
  totalUsers: number,
  activeUsers: number,
  inactiveUsers: number;
}

@Injectable({
  providedIn: 'root',
})
export class ChartService {

  private translateService = inject(TranslateService);

  constructor() {
  }

  // chart data preparation function
  buildProductChartData(productChartData: product[]) {
    const categoryMap: Record<string, { count: number; stock: number }> = {};

    productChartData.forEach(p => {
      const category = p.basic_info.product_category;

      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, stock: 0 };
      }

      categoryMap[category].count += 1;
      categoryMap[category].stock += p.detail_info.product_stock;
    });

    // Translation map for categories
    const categoryTranslations: Record<string, string> = {
      'cosmetics': this.translateService.instant('Cosmetics'),
      'note book': this.translateService.instant('Note Book'),
      'accessories': this.translateService.instant('Accessories'),
      'network': this.translateService.instant('Network'),
      'digital': this.translateService.instant('Digital'),
      'telecomunication': this.translateService.instant('Telecomunication'),
      'electric': this.translateService.instant('Electric')
    };

    // Helper function to translate category
    const translateCategory = (category: string): string => {
      return categoryTranslations[category] || category; // Fallback to original if not found
    };

    const data = Object.keys(categoryMap).map(category => ({
      category: translateCategory(category),
      productCount: categoryMap[category].count,
      totalStock: categoryMap[category].stock,
      averageStock: Math.ceil(categoryMap[category].stock / categoryMap[category].count)
    }));

    // console.log('Prepared chart data:', data);
    return data;
  }

  // chart data preparation function
  buildUserChartData(userChartData: User[]) {
    const teamMap: Record<string, { total: number; active: number; inactive: number }> = {};

    userChartData.forEach(user => {
      const teamName = user.team_info.team_name;

      if (!teamMap[teamName]) {
        teamMap[teamName] = { total: 0, active: 0, inactive: 0 };
      }

      teamMap[teamName].total += 1;

      if (user.status === true) {
        teamMap[teamName].active += 1;
      } else {
        teamMap[teamName].inactive += 1;
      }
    });

    // Translation map for teams
    const teamTranslations: Record<string, string> = {
      'spotify': this.translateService.instant('Spotify'),
      'twitter': this.translateService.instant('Twitter'),
      'reddit': this.translateService.instant('Reddit'),
      'google': this.translateService.instant('Google'),
      'pinterest': this.translateService.instant('Pinterest'),
      'facebook': this.translateService.instant('Facebook'),
      'linkedin': this.translateService.instant('Linkedin'),
      'youtube': this.translateService.instant('Youtube'),
    };

    // Helper function to translate team
    const translateTeam = (team: string): string => {
      return teamTranslations[team.toLowerCase()] || team;
    };

    const data = Object.keys(teamMap).map(team => ({
      team: translateTeam(team),
      totalUsers: teamMap[team].total,
      activeUsers: teamMap[team].active,
      inactiveUsers: teamMap[team].inactive
    }));

    // console.log('Prepared chart data:', data);
    return data;
  }

  buildCompanyBubbleData(products: product[]) {
    const teamTranslations: Record<string, string> = {
      'spotify': this.translateService.instant('Spotify'),
      'twitter': this.translateService.instant('Twitter'),
      'reddit': this.translateService.instant('Reddit'),
      'google': this.translateService.instant('Google'),
      'pinterest': this.translateService.instant('Pinterest'),
      'facebook': this.translateService.instant('Facebook'),
      'linkedin': this.translateService.instant('Linkedin'),
      'youtube': this.translateService.instant('Youtube'),
    };

    const map: Record<string, {
      totalPrice: number;
      totalStock: number;
      count: number;
    }> = {};

    products.forEach(p => {
      const company = p.basic_info.product_company;

      if (!map[company]) {
        map[company] = { totalPrice: 0, totalStock: 0, count: 0 };
      }

      map[company].totalPrice += Number(p.basic_info.product_price);
      map[company].totalStock += Number(p.detail_info.product_stock);
      map[company].count += 1;
    });

    return Object.keys(map).map(company => ({
      company: teamTranslations[company.toLowerCase()] ?? company,
      avgPrice: +(map[company].totalPrice / map[company].count).toFixed(2),
      totalStock: map[company].totalStock,
      productCount: map[company].count
    }));
  }

  // Build chart data with translations
  buildUserStatusDonutData(users: User[]) {
    const online = users.filter(u => u.status === true).length;
    const offline = users.filter(u => u.status === false).length;

      return [
        { category: this.translateService.instant('Online'), value: online },
        { category: this.translateService.instant('Offline'), value: offline }
      ];
  }

  exportJsonToExcel(jsonData: any[], fileName: string, headers?: { key: string, label: string }[]): void {
    let exportData: any[];

    if (headers && headers.length > 0) {
      // Remap object keys to translated labels
      exportData = jsonData.map(row => {
        const newRow: Record<string, any> = {};
        headers.forEach(({ key, label }) => {
          newRow[label] = row[key];
        });
        return newRow;
      });
    } else {
      exportData = jsonData;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Chart Data');
    XLSX.writeFile(workbook, `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`);
  }
}
