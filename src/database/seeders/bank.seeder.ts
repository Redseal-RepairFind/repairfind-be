import { BankModel } from "../common/bank.schema";

export const BankSeeder = async (options: Object) => {
    try {
        banks.forEach(async (bank) => {
            const existingCountry = await BankModel.findOne({ name: bank.institutionName });
            if (existingCountry) return
            await BankModel.findOneAndUpdate({ name: bank.institutionNumber }, {
                name: bank.institutionName,
                code: bank.institutionNumber,
            }, { upsert: true });
        });
    } catch (error) {
        console.log("Error seeding banks", error)
    }
};


const banks = [
    { "institutionName": "Bank of Montreal", "institutionNumber": "001" },
    { "institutionName": "Scotiabank (The Bank of Nova Scotia)", "institutionNumber": "002" },
    { "institutionName": "Royal Bank of Canada", "institutionNumber": "003" },
    { "institutionName": "The Toronto-Dominion Bank", "institutionNumber": "004" },
    { "institutionName": "National Bank of Canada", "institutionNumber": "006" },
    { "institutionName": "Canadian Imperial Bank of Commerce", "institutionNumber": "010" },
    { "institutionName": "HSBC Bank Canada", "institutionNumber": "016" },
    { "institutionName": "Canadian Western Bank", "institutionNumber": "030" },
    { "institutionName": "Laurentian Bank of Canada", "institutionNumber": "039" },
    { "institutionName": "Bank of Canada", "institutionNumber": "177" },
    { "institutionName": "Alberta Treasury Branches", "institutionNumber": "219" },
    { "institutionName": "Royal Bank of Scotland N.V. (Canada Branch)", "institutionNumber": "240" },
    { "institutionName": "Bank of America, National Association", "institutionNumber": "241" },
    { "institutionName": "The Bank of New York Mellon", "institutionNumber": "242" },
    { "institutionName": "Bank of Tokyo-Mitsubishi UFJ (Canada)", "institutionNumber": "245" },
    { "institutionName": "BNP Paribas (Canada)", "institutionNumber": "250" },
    { "institutionName": "Citibank Canada", "institutionNumber": "260" },
    { "institutionName": "Deutsche Bank AG", "institutionNumber": "265" },
    { "institutionName": "Mega International Commercial Bank (Canada)", "institutionNumber": "269" },
    { "institutionName": "JPMorgan Chase Bank National Association", "institutionNumber": "270" },
    { "institutionName": "Korea Exchange Bank of Canada", "institutionNumber": "275" },
    { "institutionName": "Mizuho Corporate Bank Ltd. Canada Branch", "institutionNumber": "277" },
    { "institutionName": "UBS Bank (Canada)", "institutionNumber": "290" },
    { "institutionName": "Société Générale (Canada Branch)", "institutionNumber": "292" },
    { "institutionName": "State Bank of India (Canada) Alberta", "institutionNumber": "294" },
    { "institutionName": "Sumitomo Mitsui Banking Corporation of Canada", "institutionNumber": "301" },
    { "institutionName": "Amex Bank of Canada", "institutionNumber": "303" },
    { "institutionName": "Industrial and Commercial Bank of China (Canada)", "institutionNumber": "307" },
    { "institutionName": "Bank of China (Canada)", "institutionNumber": "308" },
    { "institutionName": "Citizens Bank of Canada", "institutionNumber": "309" },
    { "institutionName": "First Nations Bank of Canada", "institutionNumber": "310" },
    { "institutionName": "BofA Canada Bank", "institutionNumber": "311" },
    { "institutionName": "J.P. Morgan Bank Canada", "institutionNumber": "314" },
    { "institutionName": "CTC Bank of Canada", "institutionNumber": "315" },
    { "institutionName": "U.S. Bank National Association", "institutionNumber": "318" },
    { "institutionName": "Habib Canadian Bank", "institutionNumber": "321" },
    { "institutionName": "Rabobank Nederland", "institutionNumber": "322" },
    { "institutionName": "Capital One Bank (Canada Branch)", "institutionNumber": "323" },
    { "institutionName": "President’s Choice Financial", "institutionNumber": "326" },
    { "institutionName": "State Street", "institutionNumber": "327" },
    { "institutionName": "Citibank N.A.", "institutionNumber": "328" },
    { "institutionName": "Comerica Bank", "institutionNumber": "330" },
    { "institutionName": "First Commercial Bank", "institutionNumber": "332" },
    { "institutionName": "HSBC Bank USA National Association", "institutionNumber": "333" },
    { "institutionName": "Pacific & Western Bank of Canada", "institutionNumber": "334" },
    { "institutionName": "United Overseas Bank Limited", "institutionNumber": "335" },
    { "institutionName": "Maple Bank", "institutionNumber": "336" },
    { "institutionName": "Canadian Tire Bank", "institutionNumber": "338" },
    { "institutionName": "UBS AG Canada Branch", "institutionNumber": "339" },
    { "institutionName": "ICICI Bank Canada", "institutionNumber": "340" },
    { "institutionName": "Bank West", "institutionNumber": "342" },
    { "institutionName": "Dundee Bank of Canada", "institutionNumber": "343" },
    { "institutionName": "General Bank of Canada", "institutionNumber": "344" },
    { "institutionName": "Fifth Third Bank", "institutionNumber": "345" },
    { "institutionName": "Société Générale (Canada Branch) Ontario", "institutionNumber": "346" },
    { "institutionName": "Bridgewater Bank", "institutionNumber": "347" },
    { "institutionName": "The Northern Trust Company Canada Branch", "institutionNumber": "349" },
    { "institutionName": "DirectCash Bank", "institutionNumber": "352" },
    { "institutionName": "Jameson Bank", "institutionNumber": "354" },
    { "institutionName": "Shinhan Bank Canada", "institutionNumber": "355" },
    { "institutionName": "M&T Bank", "institutionNumber": "357" },
    { "institutionName": "HomEquity Bank", "institutionNumber": "358" },
    { "institutionName": "Walmart Canada Bank", "institutionNumber": "359" },
    { "institutionName": "Barclay’s Bank PLC Canada Branch", "institutionNumber": "360" },
    { "institutionName": "MonCana Bank of Canada", "institutionNumber": "361" },
    { "institutionName": "Community Trust Company", "institutionNumber": "507" },
    { "institutionName": "The Canada Trust Company", "institutionNumber": "509" },
    { "institutionName": "Laurentian Trust of Canada Inc.", "institutionNumber": "522" },
    { "institutionName": "Effort Trust Company", "institutionNumber": "532" },
    { "institutionName": "Investors Group Trust Co. Ltd.", "institutionNumber": "536" },
    { "institutionName": "Manulife Bank of Canada", "institutionNumber": "540" },
    { "institutionName": "CIBC Trust Corporation", "institutionNumber": "548" },
    { "institutionName": "Montreal Trust Company of Canada", "institutionNumber": "550" },
    { "institutionName": "Sun Life Financial Trust Inc.", "institutionNumber": "551" },
    { "institutionName": "Peace Hills Trust Company", "institutionNumber": "568" },
    { "institutionName": "Royal Trust Company", "institutionNumber": "570" },
    { "institutionName": "Royal Trust Corporation of Canada", "institutionNumber": "580" },
    { "institutionName": "National Trust Company", "institutionNumber": "590" },
    { "institutionName": "Royal Bank Mortgage Corporation", "institutionNumber": "592" },
    { "institutionName": "TD Mortgage Corporation", "institutionNumber": "597" },
    { "institutionName": "TD Pacific Mortgage Corporation", "institutionNumber": "603" },
    { "institutionName": "HSBC Mortgage Corporation (Canada)", "institutionNumber": "604" },
    { "institutionName": "Scotia Mortgage Corporation", "institutionNumber": "606" },
    { "institutionName": "CS Alterna Bank", "institutionNumber": "608" },
    { "institutionName": "ING Bank of Canada", "institutionNumber": "614" },
    { "institutionName": "B2B Bank (formerly B2B Trust)", "institutionNumber": "618" },
    { "institutionName": "ResMor Trust Company", "institutionNumber": "620" },
    { "institutionName": "Peoples Trust Company", "institutionNumber": "621" },
    { "institutionName": "The Equitable Trust Company", "institutionNumber": "623" },
    { "institutionName": "Industrial Alliance Trust Inc.", "institutionNumber": "625" },
    { "institutionName": "Manulife Trust Company", "institutionNumber": "626" },
    { "institutionName": "Household Trust Company", "institutionNumber": "630" },
    { "institutionName": "Latvian Credit Union Limited", "institutionNumber": "803" },
    { "institutionName": "Communication Technologies Credit Union Limited", "institutionNumber": "807" },
    { "institutionName": "Arnstein Community Credit Union Limited", "institutionNumber": "808" },
    { "institutionName": "Central 1 Credit Union British Columbia", "institutionNumber": "809" },
    { "institutionName": "All Trans Financial Services Credit Union Limited", "institutionNumber": "810" },
    { "institutionName": "La Confédération des Caisses Populaires et D’Économie Desjardins du Québec", "institutionNumber": "815" },
    { "institutionName": "La Fédération des caisses populaires du Manitoba Inc.", "institutionNumber": "819" },
    { "institutionName": "Central 1 Credit Union Ontario", "institutionNumber": "828" },
    { "institutionName": "La Fédération des Caisses Populaires de l’Ontario Inc.", "institutionNumber": "829" },
    { "institutionName": "Airline Financial Credit Union Limited", "institutionNumber": "830" },
    { "institutionName": "Meridian Credit Union", "institutionNumber": "837" },
    { "institutionName": "Atlantic Central", "institutionNumber": "839" },
    { "institutionName": "Dundalk District Credit Union Limited", "institutionNumber": "840" },
    { "institutionName": "Alterna Savings and Credit Union", "institutionNumber": "842" },
    { "institutionName": "Goderich Community Credit Union Limited", "institutionNumber": "844" },
    { "institutionName": "Ontario Civil Service Credit Union Limited", "institutionNumber": "846" },
    { "institutionName": "Concentra Financial Services Association", "institutionNumber": "853" },
    { "institutionName": "Golden Horseshoe Credit Union Limited", "institutionNumber": "854" },
    { "institutionName": "La Fédération des Caisses Populaires Acadiennes Limitée", "institutionNumber": "865" },
    { "institutionName": "Credit Union Central of Manitoba Limited", "institutionNumber": "879" },
    { "institutionName": "Credit Union Central of Saskatchewan", "institutionNumber": "889" },
    { "institutionName": "Alliance des caisses populaires de l’Ontario Limitée", "institutionNumber": "890" },
    { "institutionName": "Credit Union Central Alberta Limited", "institutionNumber": "899" }
]



