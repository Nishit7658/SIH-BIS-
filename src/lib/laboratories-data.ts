// BIS-RECOGNIZED TESTING LABORATORIES (LRS - LABORATORY RECOGNITION SCHEME)
// Mapped to Indian Standards (IS), Testing Scopes, Cities, and Accreditation Status

export interface BisLaboratory {
  id: string;
  name: string;
  type: "Central Laboratory" | "Regional Laboratory" | "Branch Laboratory" | "NABL Recognized Independent Lab";
  region?: string;
  city: string;
  state: string;
  address: string;
  contactEmail: string;
  email?: string;
  contactPhone: string;
  phone?: string;
  recognizedStandards: string[];
  productCategories: string[];
  capabilities?: string[];
  nablAccreditationNo: string;
}

export const BIS_LABORATORIES_DATABASE: BisLaboratory[] = [
  {
    id: "bis-cl-sahibabad",
    name: "BIS Central Laboratory (CL)",
    type: "Central Laboratory",
    city: "Sahibabad (Ghaziabad)",
    state: "Uttar Pradesh",
    address: "Plot No. 20/9, Site IV, Sahibabad Industrial Area, Ghaziabad, UP - 201010",
    contactEmail: "cl@bis.gov.in",
    contactPhone: "+91-120-4177100",
    recognizedStandards: [
      "IS 17526:2021",
      "IS 1293:2019",
      "IS 302-1:2008",
      "IS 694:2010",
      "IS 2771 (Part 1):2020",
      "IS 4984:2016",
      "IS 4985:2021",
      "IS 1786:2020",
      "IS 269:2015",
      "IS 9873 (Part 1):2019",
      "IS 14543:2016",
      "IS 16046 (Part 2):2018",
      "IS 13252 (Part 1):2010"
    ],
    productCategories: [
      "Packaging & Paper",
      "Electrical",
      "Electronics & IT",
      "Chemical & Plastics",
      "Civil & Construction",
      "Consumer Goods"
    ],
    nablAccreditationNo: "TC-5021"
  },
  {
    id: "bis-wrol-mumbai",
    name: "BIS Western Regional Office Laboratory (WROL)",
    type: "Regional Laboratory",
    city: "Mumbai",
    state: "Maharashtra",
    address: "Manakalaya, E9, MIDC, Andheri (East), Mumbai, Maharashtra - 400093",
    contactEmail: "wrol@bis.gov.in",
    contactPhone: "+91-22-28329295",
    recognizedStandards: [
      "IS 17526:2021",
      "IS 1293:2019",
      "IS 302-1:2008",
      "IS 694:2010",
      "IS 4985:2021",
      "IS 14543:2016",
      "IS 15844 (Part 1):2023",
      "IS 16046 (Part 2):2018"
    ],
    productCategories: ["Electrical", "Consumer Goods", "Chemical & Plastics", "Electronics & IT"],
    nablAccreditationNo: "TC-5044"
  },
  {
    id: "bis-srol-chennai",
    name: "BIS Southern Regional Office Laboratory (SROL)",
    type: "Regional Laboratory",
    city: "Chennai",
    state: "Tamil Nadu",
    address: "CIT Campus, IV Cross Road, Taramani, Chennai, Tamil Nadu - 600113",
    contactEmail: "srol@bis.gov.in",
    contactPhone: "+91-44-22541442",
    recognizedStandards: [
      "IS 1293:2019",
      "IS 302-1:2008",
      "IS 374:2019",
      "IS 694:2010",
      "IS 7098 (Part 1):1988",
      "IS 4984:2016",
      "IS 1786:2020",
      "IS 269:2015",
      "IS 14543:2016"
    ],
    productCategories: ["Electrical", "Civil & Construction", "Chemical & Plastics", "Consumer Goods"],
    nablAccreditationNo: "TC-5088"
  },
  {
    id: "bis-erol-kolkata",
    name: "BIS Eastern Regional Office Laboratory (EROL)",
    type: "Regional Laboratory",
    city: "Kolkata",
    state: "West Bengal",
    address: "1/14, C.I.T. Scheme VII M, V.I.P. Road, Kankurgachi, Kolkata - 700054",
    contactEmail: "erol@bis.gov.in",
    contactPhone: "+91-33-23207085",
    recognizedStandards: [
      "IS 1786:2020",
      "IS 2062:2011",
      "IS 269:2015",
      "IS 1489 (Part 1):2015",
      "IS 8329:2000",
      "IS 14543:2016",
      "IS 2771 (Part 1):2020"
    ],
    productCategories: ["Civil & Construction", "Packaging & Paper", "Consumer Goods"],
    nablAccreditationNo: "TC-5092"
  },
  {
    id: "nth-ahmedabad",
    name: "National Test House (WR)",
    type: "NABL Recognized Independent Lab",
    city: "Ahmedabad",
    state: "Gujarat",
    address: "F-10, GIDC Electronic Estate, Sector 25, Gandhinagar / Ahmedabad, Gujarat - 382024",
    contactEmail: "nthwr-gad@nic.in",
    contactPhone: "+91-79-23287410",
    recognizedStandards: [
      "IS 17526:2021",
      "IS 6911:2017",
      "IS 4984:2016",
      "IS 4985:2021",
      "IS 15778:2007",
      "IS 10146:1982",
      "IS 9845:1998",
      "IS 2771 (Part 1):2020",
      "IS 1060 (Part 1):1966"
    ],
    productCategories: ["Packaging & Paper", "Chemical & Plastics", "Consumer Goods"],
    nablAccreditationNo: "TC-6112"
  },
  {
    id: "cpri-bengaluru",
    name: "Central Power Research Institute (CPRI)",
    type: "NABL Recognized Independent Lab",
    city: "Bengaluru",
    state: "Karnataka",
    address: "Prof. Sir C.V. Raman Road, Sadashivanagar P.O., Bengaluru - 560080",
    contactEmail: "cpri@cpri.in",
    contactPhone: "+91-80-22072010",
    recognizedStandards: [
      "IS 1293:2019",
      "IS 302-1:2008",
      "IS 694:2010",
      "IS 7098 (Part 1):1988",
      "IS 7098 (Part 2):2011",
      "IS 8130:2013",
      "IS 1180 (Part 1):2014",
      "IS 8828:1996",
      "IS 12640 (Part 1):2016",
      "IS 15652:2006",
      "IS 16444 (Part 1):2015"
    ],
    productCategories: ["Electrical", "Electronics & IT"],
    nablAccreditationNo: "TC-5130"
  },
  {
    id: "erda-vadodara",
    name: "Electrical Research and Development Association (ERDA)",
    type: "NABL Recognized Independent Lab",
    city: "Vadodara",
    state: "Gujarat",
    address: "ERDA Road, GIDC Makarpura, Vadodara, Gujarat - 390010",
    contactEmail: "erda@erda.org",
    contactPhone: "+91-265-2642942",
    recognizedStandards: [
      "IS 1293:2019",
      "IS 302-1:2008",
      "IS 3854:1997",
      "IS 374:2019",
      "IS 694:2010",
      "IS 1180 (Part 1):2014",
      "IS 16102 (Part 1):2012",
      "IS 15885 (Part 2/13):2012",
      "IS 16444 (Part 1):2015"
    ],
    productCategories: ["Electrical", "Electronics & IT"],
    nablAccreditationNo: "TC-5198"
  },
  {
    id: "tuv-reinland-gurugram",
    name: "TUV Rheinland India Electronics Laboratory",
    type: "NABL Recognized Independent Lab",
    city: "Gurugram / Delhi NCR",
    state: "Haryana",
    address: "Sector 37, Pace City I, Gurugram, Haryana - 122001",
    contactEmail: "info-india@tuv.com",
    contactPhone: "+91-124-4988500",
    recognizedStandards: [
      "IS 16046 (Part 2):2018",
      "IS 16046 (Part 1):2018",
      "IS 13252 (Part 1):2010",
      "IS 616:2017",
      "IS 16221 (Part 2):2015",
      "IS 14286:2010",
      "IS 16102 (Part 1):2012",
      "IS 15885 (Part 2/13):2012"
    ],
    productCategories: ["Electronics & IT", "Electrical"],
    nablAccreditationNo: "TC-7221"
  }
];

export function getLaboratories(filters?: { standard?: string; product?: string; city?: string }): BisLaboratory[] {
  if (!filters) return BIS_LABORATORIES_DATABASE;
  
  return BIS_LABORATORIES_DATABASE.filter(lab => {
    const matchStandard = !filters.standard || 
      lab.recognizedStandards.some(s => s.toLowerCase().includes(filters.standard!.toLowerCase()));
    
    const matchProduct = !filters.product || 
      lab.productCategories.some(p => p.toLowerCase().includes(filters.product!.toLowerCase())) ||
      lab.recognizedStandards.some(s => s.toLowerCase().includes(filters.product!.toLowerCase()));
    
    const matchCity = !filters.city || 
      lab.city.toLowerCase().includes(filters.city.toLowerCase()) || 
      lab.state.toLowerCase().includes(filters.city.toLowerCase());

    return matchStandard && matchProduct && matchCity;
  });
}
