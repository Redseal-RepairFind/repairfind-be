import { CountryModel } from "../common/country.schema";

export const CountrySeeder = async (options: Object) => {
    try {
        countries.forEach(async (country) => {
            const existingCountry = await CountryModel.findOne({ name: country.name });
            if (existingCountry) return
            await CountryModel.findOneAndUpdate({ name: country.name }, {
                name: country.name,
                iso2Code: country.iso2Code,
                iso3Code: country.iso3Code,
                callingCode: country.callingCode,
                currencyCode: country.currencyCode,
                states: country.states,
            }, { upsert: true });
        });
    } catch (error) {
        console.log("Error seeding countries", error)
    }
};


const countries = [

    {
        "iso2Code": "AF",
        "iso3Code": "afg",
        "name": "Afghanistan",
        "toName": "to Afghanistan",
        "fromName": "from Afghanistan",
        "inName": "in Afghanistan",
        "callingCode": "93",
        "currencyCode": "AFN",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "AX",
        "iso3Code": "ala",
        "name": "Åland Islands",
        "toName": "to Åland Islands",
        "fromName": "from Åland Islands",
        "inName": "in Åland Islands",
        "callingCode": "358",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AL",
        "iso3Code": "alb",
        "name": "Albania",
        "toName": "to Albania",
        "fromName": "from Albania",
        "inName": "in Albania",
        "callingCode": "355",
        "currencyCode": "ALL",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "DZ",
        "iso3Code": "dza",
        "name": "Algeria",
        "toName": "to Algeria",
        "fromName": "from Algeria",
        "inName": "in Algeria",
        "callingCode": "213",
        "currencyCode": "DZD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AS",
        "iso3Code": "asm",
        "name": "American Samoa",
        "toName": "to American Samoa",
        "fromName": "from American Samoa",
        "inName": "in American Samoa",
        "callingCode": "1",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AD",
        "iso3Code": "and",
        "name": "Andorra",
        "toName": "to Andorra",
        "fromName": "from Andorra",
        "inName": "in Andorra",
        "callingCode": "376",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "AO",
        "iso3Code": "ago",
        "name": "Angola",
        "toName": "to Angola",
        "fromName": "from Angola",
        "inName": "in Angola",
        "callingCode": "244",
        "currencyCode": "AOA",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AI",
        "iso3Code": "aia",
        "name": "Anguilla",
        "toName": "to Anguilla",
        "fromName": "from Anguilla",
        "inName": "in Anguilla",
        "callingCode": "264",
        "currencyCode": "XCD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "AQ",
        "iso3Code": "ata",
        "name": "Antarctica",
        "toName": "to Antarctica",
        "fromName": "from Antarctica",
        "inName": "in Antarctica",
        "callingCode": "672",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AG",
        "iso3Code": "atg",
        "name": "Antigua and Barbuda",
        "toName": "to Antigua and Barbuda",
        "fromName": "from Antigua and Barbuda",
        "inName": "in Antigua and Barbuda",
        "callingCode": "268",
        "currencyCode": "XCD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AR",
        "iso3Code": "arg",
        "name": "Argentina",
        "toName": "to Argentina",
        "fromName": "from Argentina",
        "inName": "in Argentina",
        "callingCode": "54",
        "currencyCode": "ARS",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AM",
        "iso3Code": "arm",
        "name": "Armenia",
        "toName": "to Armenia",
        "fromName": "from Armenia",
        "inName": "in Armenia",
        "callingCode": "374",
        "currencyCode": "AMD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AW",
        "iso3Code": "abw",
        "name": "Aruba",
        "toName": "to Aruba",
        "fromName": "from Aruba",
        "inName": "in Aruba",
        "callingCode": "297",
        "currencyCode": "AWG",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "AU",
        "iso3Code": "aus",
        "name": "Australia",
        "toName": "to Australia",
        "fromName": "from Australia",
        "inName": "in Australia",
        "callingCode": "61",
        "currencyCode": "AUD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "AT",
        "iso3Code": "aut",
        "name": "Austria",
        "toName": "to Austria",
        "fromName": "from Austria",
        "inName": "in Austria",
        "callingCode": "43",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "AZ",
        "iso3Code": "aze",
        "name": "Azerbaijan",
        "toName": "to Azerbaijan",
        "fromName": "from Azerbaijan",
        "inName": "in Azerbaijan",
        "callingCode": "994",
        "currencyCode": "AZN",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BS",
        "iso3Code": "bhs",
        "name": "Bahamas",
        "toName": "to Bahamas",
        "fromName": "from Bahamas",
        "inName": "in Bahamas",
        "callingCode": "242",
        "currencyCode": "BSD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BH",
        "iso3Code": "bhr",
        "name": "Bahrain",
        "toName": "to Bahrain",
        "fromName": "from Bahrain",
        "inName": "in Bahrain",
        "callingCode": "973",
        "currencyCode": "BHD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BD",
        "iso3Code": "bgd",
        "name": "Bangladesh",
        "toName": "to Bangladesh",
        "fromName": "from Bangladesh",
        "inName": "in Bangladesh",
        "callingCode": "880",
        "currencyCode": "BDT",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BB",
        "iso3Code": "brb",
        "name": "Barbados",
        "toName": "to Barbados",
        "fromName": "from Barbados",
        "inName": "in Barbados",
        "callingCode": "246",
        "currencyCode": "BBD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BY",
        "iso3Code": "blr",
        "name": "Belarus",
        "toName": "to Belarus",
        "fromName": "from Belarus",
        "inName": "in Belarus",
        "callingCode": "375",
        "currencyCode": "BYN",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "BE",
        "iso3Code": "bel",
        "name": "Belgium",
        "toName": "to Belgium",
        "fromName": "from Belgium",
        "inName": "in Belgium",
        "callingCode": "32",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "BZ",
        "iso3Code": "blz",
        "name": "Belize",
        "toName": "to Belize",
        "fromName": "from Belize",
        "inName": "in Belize",
        "callingCode": "501",
        "currencyCode": "BZD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "BJ",
        "iso3Code": "ben",
        "name": "Benin",
        "toName": "to Benin",
        "fromName": "from Benin",
        "inName": "in Benin",
        "callingCode": "229",
        "currencyCode": "XOF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BM",
        "iso3Code": "bmu",
        "name": "Bermuda",
        "toName": "to Bermuda",
        "fromName": "from Bermuda",
        "inName": "in Bermuda",
        "callingCode": "1",
        "currencyCode": "BMD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "BT",
        "iso3Code": "btn",
        "name": "Bhutan",
        "toName": "to Bhutan",
        "fromName": "from Bhutan",
        "inName": "in Bhutan",
        "callingCode": "975",
        "currencyCode": "BTN",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "BO",
        "iso3Code": "bol",
        "name": "Bolivia",
        "toName": "to Bolivia",
        "fromName": "from Bolivia",
        "inName": "in Bolivia",
        "callingCode": "591",
        "currencyCode": "BOB",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BQ",
        "iso3Code": "bes",
        "name": "Bonaire, Sint Eustatius and Saba",
        "toName": "to Bonaire, Sint Eustatius and Saba",
        "fromName": "from Bonaire, Sint Eustatius and Saba",
        "inName": "in Bonaire, Sint Eustatius and Saba",
        "callingCode": "599",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "BA",
        "iso3Code": "bih",
        "name": "Bosnia and Herzegovina",
        "toName": "to Bosnia and Herzegovina",
        "fromName": "from Bosnia and Herzegovina",
        "inName": "in Bosnia and Herzegovina",
        "callingCode": "387",
        "currencyCode": "BAM",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BW",
        "iso3Code": "bwa",
        "name": "Botswana",
        "toName": "to Botswana",
        "fromName": "from Botswana",
        "inName": "in Botswana",
        "callingCode": "267",
        "currencyCode": "BWP",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BV",
        "iso3Code": "bvt",
        "name": "Bouvet Island",
        "toName": "to Bouvet Island",
        "fromName": "from Bouvet Island",
        "inName": "in Bouvet Island",
        "callingCode": "47",
        "currencyCode": "NOK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "BR",
        "iso3Code": "bra",
        "name": "Brazil",
        "toName": "to Brazil",
        "fromName": "from Brazil",
        "inName": "in Brazil",
        "callingCode": "55",
        "currencyCode": "BRL",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "IO",
        "iso3Code": "iot",
        "name": "British Indian Ocean Territory",
        "toName": "to British Indian Ocean Territory",
        "fromName": "from British Indian Ocean Territory",
        "inName": "in British Indian Ocean Territory",
        "callingCode": "246",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "VG",
        "iso3Code": "vgb",
        "name": "British Virgin Islands",
        "toName": "to British Virgin Islands",
        "fromName": "from British Virgin Islands",
        "inName": "in British Virgin Islands",
        "callingCode": "1",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "BN",
        "iso3Code": "brn",
        "name": "Brunei Darussalam",
        "toName": "to Brunei Darussalam",
        "fromName": "from Brunei Darussalam",
        "inName": "in Brunei Darussalam",
        "callingCode": "673",
        "currencyCode": "BND",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BG",
        "iso3Code": "bgr",
        "name": "Bulgaria",
        "toName": "to Bulgaria",
        "fromName": "from Bulgaria",
        "inName": "in Bulgaria",
        "callingCode": "359",
        "currencyCode": "BGN",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "BF",
        "iso3Code": "bfa",
        "name": "Burkina Faso",
        "toName": "to Burkina Faso",
        "fromName": "from Burkina Faso",
        "inName": "in Burkina Faso",
        "callingCode": "226",
        "currencyCode": "XOF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BI",
        "iso3Code": "bdi",
        "name": "Burundi",
        "toName": "to Burundi",
        "fromName": "from Burundi",
        "inName": "in Burundi",
        "callingCode": "257",
        "currencyCode": "BIF",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "KH",
        "iso3Code": "khm",
        "name": "Cambodia",
        "toName": "to Cambodia",
        "fromName": "from Cambodia",
        "inName": "in Cambodia",
        "callingCode": "855",
        "currencyCode": "KHR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "CM",
        "iso3Code": "cmr",
        "name": "Cameroon",
        "toName": "to Cameroon",
        "fromName": "from Cameroon",
        "inName": "in Cameroon",
        "callingCode": "237",
        "currencyCode": "XAF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "CA",
        "iso3Code": "can",
        "name": "Canada",
        "toName": "to Canada",
        "fromName": "from Canada",
        "inName": "in Canada",
        "callingCode": "1",
        "currencyCode": "CAD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CV",
        "iso3Code": "cpv",
        "name": "Cape Verde",
        "toName": "to Cape Verde",
        "fromName": "from Cape Verde",
        "inName": "in Cape Verde",
        "callingCode": "238",
        "currencyCode": "CVE",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "KY",
        "iso3Code": "cym",
        "name": "Cayman Islands",
        "toName": "to Cayman Islands",
        "fromName": "from Cayman Islands",
        "inName": "in Cayman Islands",
        "callingCode": "1",
        "currencyCode": "KYD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CF",
        "iso3Code": "caf",
        "name": "Central African Republic",
        "toName": "to Central African Republic",
        "fromName": "from Central African Republic",
        "inName": "in Central African Republic",
        "callingCode": "180",
        "currencyCode": "XAF",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "TD",
        "iso3Code": "tcd",
        "name": "Chad",
        "toName": "to Chad",
        "fromName": "from Chad",
        "inName": "in Chad",
        "callingCode": "235",
        "currencyCode": "XAF",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "CL",
        "iso3Code": "chl",
        "name": "Chile",
        "toName": "to Chile",
        "fromName": "from Chile",
        "inName": "in Chile",
        "callingCode": "56",
        "currencyCode": "CLP",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "CN",
        "iso3Code": "chn",
        "name": "China",
        "toName": "to China",
        "fromName": "from China",
        "inName": "in China",
        "callingCode": "86",
        "currencyCode": "CNY",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CX",
        "iso3Code": "cxr",
        "name": "Christmas Island",
        "toName": "to Christmas Island",
        "fromName": "from Christmas Island",
        "inName": "in Christmas Island",
        "callingCode": "61",
        "currencyCode": "AUD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CC",
        "iso3Code": "cck",
        "name": "Cocos (Keeling) Islands",
        "toName": "to Cocos (Keeling) Islands",
        "fromName": "from Cocos (Keeling) Islands",
        "inName": "in Cocos (Keeling) Islands",
        "callingCode": "61",
        "currencyCode": "AUD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CO",
        "iso3Code": "col",
        "name": "Colombia",
        "toName": "to Colombia",
        "fromName": "from Colombia",
        "inName": "in Colombia",
        "callingCode": "57",
        "currencyCode": "COP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "KM",
        "iso3Code": "com",
        "name": "Comoros",
        "toName": "to Comoros",
        "fromName": "from Comoros",
        "inName": "in Comoros",
        "callingCode": "269",
        "currencyCode": "KMF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "CG",
        "iso3Code": "cog",
        "name": "Congo",
        "toName": "to Congo",
        "fromName": "from Congo",
        "inName": "in Congo",
        "callingCode": "242",
        "currencyCode": "XAF",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "CD",
        "iso3Code": "cod",
        "name": "Congo, the Democratic Republic of the",
        "toName": "to Congo, the Democratic Republic of the",
        "fromName": "from Congo, the Democratic Republic of the",
        "inName": "in Congo, the Democratic Republic of the",
        "callingCode": "243",
        "currencyCode": "CDF",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "CK",
        "iso3Code": "cok",
        "name": "Cook Islands",
        "toName": "to Cook Islands",
        "fromName": "from Cook Islands",
        "inName": "in Cook Islands",
        "callingCode": "682",
        "currencyCode": "NZD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "CR",
        "iso3Code": "cri",
        "name": "Costa Rica",
        "toName": "to Costa Rica",
        "fromName": "from Costa Rica",
        "inName": "in Costa Rica",
        "callingCode": "506",
        "currencyCode": "CRC",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CI",
        "iso3Code": "civ",
        "name": "Côte dIvoire",
        "toName": "to Côte dIvoire",
        "fromName": "from Côte dIvoire",
        "inName": "in Côte dIvoire",
        "callingCode": "225",
        "currencyCode": "XOF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "HR",
        "iso3Code": "hrv",
        "name": "Croatia",
        "toName": "to Croatia",
        "fromName": "from Croatia",
        "inName": "in Croatia",
        "callingCode": "385",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CU",
        "iso3Code": "cub",
        "name": "Cuba",
        "toName": "to Cuba",
        "fromName": "from Cuba",
        "inName": "in Cuba",
        "callingCode": "53",
        "currencyCode": "CUP",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "CW",
        "iso3Code": "cuw",
        "name": "Curaçao",
        "toName": "to Curaçao",
        "fromName": "from Curaçao",
        "inName": "in Curaçao",
        "callingCode": "599",
        "currencyCode": "ANG",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "CY",
        "iso3Code": "cyp",
        "name": "Cyprus",
        "toName": "to Cyprus",
        "fromName": "from Cyprus",
        "inName": "in Cyprus",
        "callingCode": "357",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CZ",
        "iso3Code": "cze",
        "name": "Czech Republic",
        "toName": "to Czech Republic",
        "fromName": "from Czech Republic",
        "inName": "in Czech Republic",
        "callingCode": "420",
        "currencyCode": "CZK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "DK",
        "iso3Code": "dnk",
        "name": "Denmark",
        "toName": "to Denmark",
        "fromName": "from Denmark",
        "inName": "in Denmark",
        "callingCode": "45",
        "currencyCode": "DKK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "DJ",
        "iso3Code": "dji",
        "name": "Djibouti",
        "toName": "to Djibouti",
        "fromName": "from Djibouti",
        "inName": "in Djibouti",
        "callingCode": "253",
        "currencyCode": "DJF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "DM",
        "iso3Code": "dma",
        "name": "Dominica",
        "toName": "to Dominica",
        "fromName": "from Dominica",
        "inName": "in Dominica",
        "callingCode": "1",
        "currencyCode": "XCD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "DO",
        "iso3Code": "dom",
        "name": "Dominican Republic",
        "toName": "to Dominican Republic",
        "fromName": "from Dominican Republic",
        "inName": "in Dominican Republic",
        "callingCode": "1",
        "currencyCode": "DOP",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "EC",
        "iso3Code": "ecu",
        "name": "Ecuador",
        "toName": "to Ecuador",
        "fromName": "from Ecuador",
        "inName": "in Ecuador",
        "callingCode": "593",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "EG",
        "iso3Code": "egy",
        "name": "Egypt",
        "toName": "to Egypt",
        "fromName": "from Egypt",
        "inName": "in Egypt",
        "callingCode": "20",
        "currencyCode": "EGP",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "SV",
        "iso3Code": "slv",
        "name": "El Salvador",
        "toName": "to El Salvador",
        "fromName": "from El Salvador",
        "inName": "in El Salvador",
        "callingCode": "503",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "GQ",
        "iso3Code": "gnq",
        "name": "Equatorial Guinea",
        "toName": "to Equatorial Guinea",
        "fromName": "from Equatorial Guinea",
        "inName": "in Equatorial Guinea",
        "callingCode": "240",
        "currencyCode": "XAF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "ER",
        "iso3Code": "eri",
        "name": "Eritrea",
        "toName": "to Eritrea",
        "fromName": "from Eritrea",
        "inName": "in Eritrea",
        "callingCode": "291",
        "currencyCode": "ERN",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "EE",
        "iso3Code": "est",
        "name": "Estonia",
        "toName": "to Estonia",
        "fromName": "from Estonia",
        "inName": "in Estonia",
        "callingCode": "372",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "ET",
        "iso3Code": "eth",
        "name": "Ethiopia",
        "toName": "to Ethiopia",
        "fromName": "from Ethiopia",
        "inName": "in Ethiopia",
        "callingCode": "251",
        "currencyCode": "ETB",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "FK",
        "iso3Code": "flk",
        "name": "Falkland Islands",
        "toName": "to Falkland Islands",
        "fromName": "from Falkland Islands",
        "inName": "in Falkland Islands",
        "callingCode": "500",
        "currencyCode": "FKP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "FO",
        "iso3Code": "fro",
        "name": "Faroe Islands",
        "toName": "to Faroe Islands",
        "fromName": "from Faroe Islands",
        "inName": "in Faroe Islands",
        "callingCode": "298",
        "currencyCode": "DKK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "FJ",
        "iso3Code": "fji",
        "name": "Fiji",
        "toName": "to Fiji",
        "fromName": "from Fiji",
        "inName": "in Fiji",
        "callingCode": "679",
        "currencyCode": "FJD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "FI",
        "iso3Code": "fin",
        "name": "Finland",
        "toName": "to Finland",
        "fromName": "from Finland",
        "inName": "in Finland",
        "callingCode": "358",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "FR",
        "iso3Code": "fra",
        "name": "France",
        "toName": "to France",
        "fromName": "from France",
        "inName": "in France",
        "callingCode": "33",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GF",
        "iso3Code": "guf",
        "name": "French Guiana",
        "toName": "to French Guiana",
        "fromName": "from French Guiana",
        "inName": "in French Guiana",
        "callingCode": "594",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "PF",
        "iso3Code": "pyf",
        "name": "French Polynesia",
        "toName": "to French Polynesia",
        "fromName": "from French Polynesia",
        "inName": "in French Polynesia",
        "callingCode": "689",
        "currencyCode": "XPF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "TF",
        "iso3Code": "atf",
        "name": "French Southern Territories",
        "toName": "to French Southern Territories",
        "fromName": "from French Southern Territories",
        "inName": "in French Southern Territories",
        "callingCode": "262",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "GA",
        "iso3Code": "gab",
        "name": "Gabon",
        "toName": "to Gabon",
        "fromName": "from Gabon",
        "inName": "in Gabon",
        "callingCode": "241",
        "currencyCode": "XAF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "GM",
        "iso3Code": "gmb",
        "name": "Gambia",
        "toName": "to Gambia",
        "fromName": "from Gambia",
        "inName": "in Gambia",
        "callingCode": "220",
        "currencyCode": "GMD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GE",
        "iso3Code": "geo",
        "name": "Georgia",
        "toName": "to Georgia",
        "fromName": "from Georgia",
        "inName": "in Georgia",
        "callingCode": "995",
        "currencyCode": "GEL",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "DE",
        "iso3Code": "deu",
        "name": "Germany",
        "toName": "to Germany",
        "fromName": "from Germany",
        "inName": "in Germany",
        "callingCode": "49",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GH",
        "iso3Code": "gha",
        "name": "Ghana",
        "toName": "to Ghana",
        "fromName": "from Ghana",
        "inName": "in Ghana",
        "callingCode": "233",
        "currencyCode": "GHS",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "GI",
        "iso3Code": "gib",
        "name": "Gibraltar",
        "toName": "to Gibraltar",
        "fromName": "from Gibraltar",
        "inName": "in Gibraltar",
        "callingCode": "350",
        "currencyCode": "GIP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GR",
        "iso3Code": "grc",
        "name": "Greece",
        "toName": "to Greece",
        "fromName": "from Greece",
        "inName": "in Greece",
        "callingCode": "30",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GL",
        "iso3Code": "grl",
        "name": "Greenland",
        "toName": "to Greenland",
        "fromName": "from Greenland",
        "inName": "in Greenland",
        "callingCode": "299",
        "currencyCode": "DKK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GD",
        "iso3Code": "grd",
        "name": "Grenada",
        "toName": "to Grenada",
        "fromName": "from Grenada",
        "inName": "in Grenada",
        "callingCode": "1",
        "currencyCode": "XCD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GP",
        "iso3Code": "glp",
        "name": "Guadeloupe",
        "toName": "to Guadeloupe",
        "fromName": "from Guadeloupe",
        "inName": "in Guadeloupe",
        "callingCode": "590",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GU",
        "iso3Code": "gum",
        "name": "Guam",
        "toName": "to Guam",
        "fromName": "from Guam",
        "inName": "in Guam",
        "callingCode": "1",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GT",
        "iso3Code": "gtm",
        "name": "Guatemala",
        "toName": "to Guatemala",
        "fromName": "from Guatemala",
        "inName": "in Guatemala",
        "callingCode": "502",
        "currencyCode": "GTQ",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "GG",
        "iso3Code": "ggy",
        "name": "Guernsey",
        "toName": "to Guernsey",
        "fromName": "from Guernsey",
        "inName": "in Guernsey",
        "callingCode": "44",
        "currencyCode": "GBP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GN",
        "iso3Code": "gin",
        "name": "Guinea",
        "toName": "to Guinea",
        "fromName": "from Guinea",
        "inName": "in Guinea",
        "callingCode": "224",
        "currencyCode": "GNF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "GW",
        "iso3Code": "gnb",
        "name": "Guinea-Bissau",
        "toName": "to Guinea-Bissau",
        "fromName": "from Guinea-Bissau",
        "inName": "in Guinea-Bissau",
        "callingCode": "245",
        "currencyCode": "XOF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GY",
        "iso3Code": "guy",
        "name": "Guyana",
        "toName": "to Guyana",
        "fromName": "from Guyana",
        "inName": "in Guyana",
        "callingCode": "592",
        "currencyCode": "GYD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "HT",
        "iso3Code": "hti",
        "name": "Haiti",
        "toName": "to Haiti",
        "fromName": "from Haiti",
        "inName": "in Haiti",
        "callingCode": "509",
        "currencyCode": "HTG",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "HM",
        "iso3Code": "hmd",
        "name": "Heard Island and McDonald Islands",
        "toName": "to Heard Island and McDonald Islands",
        "fromName": "from Heard Island and McDonald Islands",
        "inName": "in Heard Island and McDonald Islands",
        "callingCode": "61",
        "currencyCode": "AUD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "HN",
        "iso3Code": "hnd",
        "name": "Honduras",
        "toName": "to Honduras",
        "fromName": "from Honduras",
        "inName": "in Honduras",
        "callingCode": "504",
        "currencyCode": "HNL",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "HK",
        "iso3Code": "hkg",
        "name": "Hong Kong",
        "toName": "to Hong Kong",
        "fromName": "from Hong Kong",
        "inName": "in Hong Kong",
        "callingCode": "852",
        "currencyCode": "HKD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "HU",
        "iso3Code": "hun",
        "name": "Hungary",
        "toName": "to Hungary",
        "fromName": "from Hungary",
        "inName": "in Hungary",
        "callingCode": "36",
        "currencyCode": "HUF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "IS",
        "iso3Code": "isl",
        "name": "Iceland",
        "toName": "to Iceland",
        "fromName": "from Iceland",
        "inName": "in Iceland",
        "callingCode": "354",
        "currencyCode": "ISK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "IN",
        "iso3Code": "ind",
        "name": "India",
        "toName": "to India",
        "fromName": "from India",
        "inName": "in India",
        "callingCode": "91",
        "currencyCode": "INR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "ID",
        "iso3Code": "idn",
        "name": "Indonesia",
        "toName": "to Indonesia",
        "fromName": "from Indonesia",
        "inName": "in Indonesia",
        "callingCode": "62",
        "currencyCode": "IDR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "IR",
        "iso3Code": "irn",
        "name": "Iran",
        "toName": "to Iran",
        "fromName": "from Iran",
        "inName": "in Iran",
        "callingCode": "98",
        "currencyCode": "IRR",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "IQ",
        "iso3Code": "irq",
        "name": "Iraq",
        "toName": "to Iraq",
        "fromName": "from Iraq",
        "inName": "in Iraq",
        "callingCode": "964",
        "currencyCode": "IQD",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "IE",
        "iso3Code": "irl",
        "name": "Ireland",
        "toName": "to Ireland",
        "fromName": "from Ireland",
        "inName": "in Ireland",
        "callingCode": "353",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "IM",
        "iso3Code": "imn",
        "name": "Isle of Man",
        "toName": "to Isle of Man",
        "fromName": "from Isle of Man",
        "inName": "in Isle of Man",
        "callingCode": "44",
        "currencyCode": "GBP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "IL",
        "iso3Code": "isr",
        "name": "Israel",
        "toName": "to Israel",
        "fromName": "from Israel",
        "inName": "in Israel",
        "callingCode": "972",
        "currencyCode": "ILS",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "IT",
        "iso3Code": "ita",
        "name": "Italy",
        "toName": "to Italy",
        "fromName": "from Italy",
        "inName": "in Italy",
        "callingCode": "39",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "JM",
        "iso3Code": "jam",
        "name": "Jamaica",
        "toName": "to Jamaica",
        "fromName": "from Jamaica",
        "inName": "in Jamaica",
        "callingCode": "1",
        "currencyCode": "JMD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "JP",
        "iso3Code": "jpn",
        "name": "Japan",
        "toName": "to Japan",
        "fromName": "from Japan",
        "inName": "in Japan",
        "callingCode": "81",
        "currencyCode": "JPY",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "JE",
        "iso3Code": "jey",
        "name": "Jersey",
        "toName": "to Jersey",
        "fromName": "from Jersey",
        "inName": "in Jersey",
        "callingCode": "44",
        "currencyCode": "GBP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "JO",
        "iso3Code": "jor",
        "name": "Jordan",
        "toName": "to Jordan",
        "fromName": "from Jordan",
        "inName": "in Jordan",
        "callingCode": "962",
        "currencyCode": "JOD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "KZ",
        "iso3Code": "kaz",
        "name": "Kazakhstan",
        "toName": "to Kazakhstan",
        "fromName": "from Kazakhstan",
        "inName": "in Kazakhstan",
        "callingCode": "7",
        "currencyCode": "KZT",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "KE",
        "iso3Code": "ken",
        "name": "Kenya",
        "toName": "to Kenya",
        "fromName": "from Kenya",
        "inName": "in Kenya",
        "callingCode": "254",
        "currencyCode": "KES",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "KI",
        "iso3Code": "kir",
        "name": "Kiribati",
        "toName": "to Kiribati",
        "fromName": "from Kiribati",
        "inName": "in Kiribati",
        "callingCode": "686",
        "currencyCode": "AUD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "KP",
        "iso3Code": "prk",
        "name": "Korea, Democratic Peoples Republic of",
        "toName": "to Korea, Democratic Peoples Republic of",
        "fromName": "from Korea, Democratic Peoples Republic of",
        "inName": "in Korea, Democratic Peoples Republic of",
        "callingCode": "850",
        "currencyCode": "KPW",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "XK",
        "iso3Code": "xkx",
        "name": "Kosovo, Republic of",
        "toName": "to Kosovo, Republic of",
        "fromName": "from Kosovo, Republic of",
        "inName": "in Kosovo, Republic of",
        "callingCode": "383",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "KW",
        "iso3Code": "kwt",
        "name": "Kuwait",
        "toName": "to Kuwait",
        "fromName": "from Kuwait",
        "inName": "in Kuwait",
        "callingCode": "965",
        "currencyCode": "KWD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "KG",
        "iso3Code": "kgz",
        "name": "Kyrgyzstan",
        "toName": "to Kyrgyzstan",
        "fromName": "from Kyrgyzstan",
        "inName": "in Kyrgyzstan",
        "callingCode": "996",
        "currencyCode": "KGS",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "LA",
        "iso3Code": "lao",
        "name": "Laos",
        "toName": "to Laos",
        "fromName": "from Laos",
        "inName": "in Laos",
        "callingCode": "856",
        "currencyCode": "LAK",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "LV",
        "iso3Code": "lva",
        "name": "Latvia",
        "toName": "to Latvia",
        "fromName": "from Latvia",
        "inName": "in Latvia",
        "callingCode": "371",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "LB",
        "iso3Code": "lbn",
        "name": "Lebanon",
        "toName": "to Lebanon",
        "fromName": "from Lebanon",
        "inName": "in Lebanon",
        "callingCode": "961",
        "currencyCode": "LBP",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "LS",
        "iso3Code": "lso",
        "name": "Lesotho",
        "toName": "to Lesotho",
        "fromName": "from Lesotho",
        "inName": "in Lesotho",
        "callingCode": "266",
        "currencyCode": "LSL",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "LR",
        "iso3Code": "lbr",
        "name": "Liberia",
        "toName": "to Liberia",
        "fromName": "from Liberia",
        "inName": "in Liberia",
        "callingCode": "231",
        "currencyCode": "LRD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "LY",
        "iso3Code": "lby",
        "name": "Libya",
        "toName": "to Libya",
        "fromName": "from Libya",
        "inName": "in Libya",
        "callingCode": "218",
        "currencyCode": "LYD",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "LI",
        "iso3Code": "lie",
        "name": "Liechtenstein",
        "toName": "to Liechtenstein",
        "fromName": "from Liechtenstein",
        "inName": "in Liechtenstein",
        "callingCode": "423",
        "currencyCode": "CHF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "LT",
        "iso3Code": "ltu",
        "name": "Lithuania",
        "toName": "to Lithuania",
        "fromName": "from Lithuania",
        "inName": "in Lithuania",
        "callingCode": "370",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "LU",
        "iso3Code": "lux",
        "name": "Luxembourg",
        "toName": "to Luxembourg",
        "fromName": "from Luxembourg",
        "inName": "in Luxembourg",
        "callingCode": "352",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MO",
        "iso3Code": "mac",
        "name": "Macao",
        "toName": "to Macao",
        "fromName": "from Macao",
        "inName": "in Macao",
        "callingCode": "853",
        "currencyCode": "MOP",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MG",
        "iso3Code": "mdg",
        "name": "Madagascar",
        "toName": "to Madagascar",
        "fromName": "from Madagascar",
        "inName": "in Madagascar",
        "callingCode": "261",
        "currencyCode": "MGA",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MW",
        "iso3Code": "mwi",
        "name": "Malawi",
        "toName": "to Malawi",
        "fromName": "from Malawi",
        "inName": "in Malawi",
        "callingCode": "265",
        "currencyCode": "MWK",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MY",
        "iso3Code": "mys",
        "name": "Malaysia",
        "toName": "to Malaysia",
        "fromName": "from Malaysia",
        "inName": "in Malaysia",
        "callingCode": "60",
        "currencyCode": "MYR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MV",
        "iso3Code": "mdv",
        "name": "Maldives",
        "toName": "to Maldives",
        "fromName": "from Maldives",
        "inName": "in Maldives",
        "callingCode": "960",
        "currencyCode": "MVR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "ML",
        "iso3Code": "mli",
        "name": "Mali",
        "toName": "to Mali",
        "fromName": "from Mali",
        "inName": "in Mali",
        "callingCode": "223",
        "currencyCode": "XOF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MT",
        "iso3Code": "mlt",
        "name": "Malta",
        "toName": "to Malta",
        "fromName": "from Malta",
        "inName": "in Malta",
        "callingCode": "356",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MH",
        "iso3Code": "mhl",
        "name": "Marshall Islands",
        "toName": "to Marshall Islands",
        "fromName": "from Marshall Islands",
        "inName": "in Marshall Islands",
        "callingCode": "692",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MQ",
        "iso3Code": "mtq",
        "name": "Martinique",
        "toName": "to Martinique",
        "fromName": "from Martinique",
        "inName": "in Martinique",
        "callingCode": "596",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MR",
        "iso3Code": "mrt",
        "name": "Mauritania",
        "toName": "to Mauritania",
        "fromName": "from Mauritania",
        "inName": "in Mauritania",
        "callingCode": "222",
        "currencyCode": "MRU",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MU",
        "iso3Code": "mus",
        "name": "Mauritius",
        "toName": "to Mauritius",
        "fromName": "from Mauritius",
        "inName": "in Mauritius",
        "callingCode": "230",
        "currencyCode": "MUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "YT",
        "iso3Code": "myt",
        "name": "Mayotte",
        "toName": "to Mayotte",
        "fromName": "from Mayotte",
        "inName": "in Mayotte",
        "callingCode": "262",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MX",
        "iso3Code": "mex",
        "name": "Mexico",
        "toName": "to Mexico",
        "fromName": "from Mexico",
        "inName": "in Mexico",
        "callingCode": "52",
        "currencyCode": "MXN",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "FM",
        "iso3Code": "fsm",
        "name": "Micronesia",
        "toName": "to Micronesia",
        "fromName": "from Micronesia",
        "inName": "in Micronesia",
        "callingCode": "691",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MD",
        "iso3Code": "mda",
        "name": "Moldova",
        "toName": "to Moldova",
        "fromName": "from Moldova",
        "inName": "in Moldova",
        "callingCode": "373",
        "currencyCode": "MDL",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MC",
        "iso3Code": "mco",
        "name": "Monaco",
        "toName": "to Monaco",
        "fromName": "from Monaco",
        "inName": "in Monaco",
        "callingCode": "377",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MN",
        "iso3Code": "mng",
        "name": "Mongolia",
        "toName": "to Mongolia",
        "fromName": "from Mongolia",
        "inName": "in Mongolia",
        "callingCode": "976",
        "currencyCode": "MNT",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "ME",
        "iso3Code": "mne",
        "name": "Montenegro",
        "toName": "to Montenegro",
        "fromName": "from Montenegro",
        "inName": "in Montenegro",
        "callingCode": "382",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MS",
        "iso3Code": "msr",
        "name": "Montserrat",
        "toName": "to Montserrat",
        "fromName": "from Montserrat",
        "inName": "in Montserrat",
        "callingCode": "1",
        "currencyCode": "XCD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MA",
        "iso3Code": "mar",
        "name": "Morocco",
        "toName": "to Morocco",
        "fromName": "from Morocco",
        "inName": "in Morocco",
        "callingCode": "212",
        "currencyCode": "MAD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MZ",
        "iso3Code": "moz",
        "name": "Mozambique",
        "toName": "to Mozambique",
        "fromName": "from Mozambique",
        "inName": "in Mozambique",
        "callingCode": "258",
        "currencyCode": "MZN",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MM",
        "iso3Code": "mmr",
        "name": "Myanmar",
        "toName": "to Myanmar",
        "fromName": "from Myanmar",
        "inName": "in Myanmar",
        "callingCode": "95",
        "currencyCode": "MMK",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "NA",
        "iso3Code": "nam",
        "name": "Namibia",
        "toName": "to Namibia",
        "fromName": "from Namibia",
        "inName": "in Namibia",
        "callingCode": "264",
        "currencyCode": "NAD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "NR",
        "iso3Code": "nru",
        "name": "Nauru",
        "toName": "to Nauru",
        "fromName": "from Nauru",
        "inName": "in Nauru",
        "callingCode": "674",
        "currencyCode": "AUD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "NP",
        "iso3Code": "npl",
        "name": "Nepal",
        "toName": "to Nepal",
        "fromName": "from Nepal",
        "inName": "in Nepal",
        "callingCode": "977",
        "currencyCode": "NPR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "NL",
        "iso3Code": "nld",
        "name": "Netherlands",
        "toName": "to Netherlands",
        "fromName": "from Netherlands",
        "inName": "in Netherlands",
        "callingCode": "31",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "NC",
        "iso3Code": "ncl",
        "name": "New Caledonia",
        "toName": "to New Caledonia",
        "fromName": "from New Caledonia",
        "inName": "in New Caledonia",
        "callingCode": "687",
        "currencyCode": "XPF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "NZ",
        "iso3Code": "nzl",
        "name": "New Zealand",
        "toName": "to New Zealand",
        "fromName": "from New Zealand",
        "inName": "in New Zealand",
        "callingCode": "64",
        "currencyCode": "NZD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "NI",
        "iso3Code": "nic",
        "name": "Nicaragua",
        "toName": "to Nicaragua",
        "fromName": "from Nicaragua",
        "inName": "in Nicaragua",
        "callingCode": "505",
        "currencyCode": "NIO",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "NE",
        "iso3Code": "ner",
        "name": "Niger",
        "toName": "to Niger",
        "fromName": "from Niger",
        "inName": "in Niger",
        "callingCode": "227",
        "currencyCode": "XOF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "NG",
        "iso3Code": "nga",
        "name": "Nigeria",
        "toName": "to Nigeria",
        "fromName": "from Nigeria",
        "inName": "in Nigeria",
        "callingCode": "234",
        "currencyCode": "NGN",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "NU",
        "iso3Code": "niu",
        "name": "Niue",
        "toName": "to Niue",
        "fromName": "from Niue",
        "inName": "in Niue",
        "callingCode": "683",
        "currencyCode": "NZD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "NF",
        "iso3Code": "nfk",
        "name": "Norfolk Island",
        "toName": "to Norfolk Island",
        "fromName": "from Norfolk Island",
        "inName": "in Norfolk Island",
        "callingCode": "672",
        "currencyCode": "AUD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MP",
        "iso3Code": "mnp",
        "name": "Northern Mariana Islands",
        "toName": "to Northern Mariana Islands",
        "fromName": "from Northern Mariana Islands",
        "inName": "in Northern Mariana Islands",
        "callingCode": "1",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "MK",
        "iso3Code": "mkd",
        "name": "North Macedonia",
        "toName": "to North Macedonia",
        "fromName": "from North Macedonia",
        "inName": "in North Macedonia",
        "callingCode": "389",
        "currencyCode": "MKD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "NO",
        "iso3Code": "nor",
        "name": "Norway",
        "toName": "to Norway",
        "fromName": "from Norway",
        "inName": "in Norway",
        "callingCode": "47",
        "currencyCode": "NOK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "OM",
        "iso3Code": "omn",
        "name": "Oman",
        "toName": "to Oman",
        "fromName": "from Oman",
        "inName": "in Oman",
        "callingCode": "968",
        "currencyCode": "OMR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "PK",
        "iso3Code": "pak",
        "name": "Pakistan",
        "toName": "to Pakistan",
        "fromName": "from Pakistan",
        "inName": "in Pakistan",
        "callingCode": "92",
        "currencyCode": "PKR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "PW",
        "iso3Code": "plw",
        "name": "Palau",
        "toName": "to Palau",
        "fromName": "from Palau",
        "inName": "in Palau",
        "callingCode": "680",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "PS",
        "iso3Code": "pse",
        "name": "Palestine",
        "toName": "to Palestine",
        "fromName": "from Palestine",
        "inName": "in Palestine",
        "callingCode": "970",
        "currencyCode": "ILS",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "PA",
        "iso3Code": "pan",
        "name": "Panama",
        "toName": "to Panama",
        "fromName": "from Panama",
        "inName": "in Panama",
        "callingCode": "507",
        "currencyCode": "PAB",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "PG",
        "iso3Code": "png",
        "name": "Papua New Guinea",
        "toName": "to Papua New Guinea",
        "fromName": "from Papua New Guinea",
        "inName": "in Papua New Guinea",
        "callingCode": "675",
        "currencyCode": "PGK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "PY",
        "iso3Code": "pry",
        "name": "Paraguay",
        "toName": "to Paraguay",
        "fromName": "from Paraguay",
        "inName": "in Paraguay",
        "callingCode": "595",
        "currencyCode": "PYG",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "PE",
        "iso3Code": "per",
        "name": "Peru",
        "toName": "to Peru",
        "fromName": "from Peru",
        "inName": "in Peru",
        "callingCode": "51",
        "currencyCode": "PEN",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "PH",
        "iso3Code": "phl",
        "name": "Philippines",
        "toName": "to Philippines",
        "fromName": "from Philippines",
        "inName": "in Philippines",
        "callingCode": "63",
        "currencyCode": "PHP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "PN",
        "iso3Code": "pcn",
        "name": "Pitcairn Islands",
        "toName": "to Pitcairn Islands",
        "fromName": "from Pitcairn Islands",
        "inName": "in Pitcairn Islands",
        "callingCode": "64",
        "currencyCode": "NZD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "PL",
        "iso3Code": "pol",
        "name": "Poland",
        "toName": "to Poland",
        "fromName": "from Poland",
        "inName": "in Poland",
        "callingCode": "48",
        "currencyCode": "PLN",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "PT",
        "iso3Code": "prt",
        "name": "Portugal",
        "toName": "to Portugal",
        "fromName": "from Portugal",
        "inName": "in Portugal",
        "callingCode": "351",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "PR",
        "iso3Code": "pri",
        "name": "Puerto Rico",
        "toName": "to Puerto Rico",
        "fromName": "from Puerto Rico",
        "inName": "in Puerto Rico",
        "callingCode": "1",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "QA",
        "iso3Code": "qat",
        "name": "Qatar",
        "toName": "to Qatar",
        "fromName": "from Qatar",
        "inName": "in Qatar",
        "callingCode": "974",
        "currencyCode": "QAR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "RE",
        "iso3Code": "reu",
        "name": "Réunion",
        "toName": "to Réunion",
        "fromName": "from Réunion",
        "inName": "in Réunion",
        "callingCode": "262",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "RO",
        "iso3Code": "rou",
        "name": "Romania",
        "toName": "to Romania",
        "fromName": "from Romania",
        "inName": "in Romania",
        "callingCode": "40",
        "currencyCode": "RON",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "RU",
        "iso3Code": "rus",
        "name": "Russia",
        "toName": "to Russia",
        "fromName": "from Russia",
        "inName": "in Russia",
        "callingCode": "7",
        "currencyCode": "RUB",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "RW",
        "iso3Code": "rwa",
        "name": "Rwanda",
        "toName": "to Rwanda",
        "fromName": "from Rwanda",
        "inName": "in Rwanda",
        "callingCode": "250",
        "currencyCode": "RWF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "BL",
        "iso3Code": "blm",
        "name": "Saint Barthélemy",
        "toName": "to Saint Barthélemy",
        "fromName": "from Saint Barthélemy",
        "inName": "in Saint Barthélemy",
        "callingCode": "590",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SH",
        "iso3Code": "shn",
        "name": "Saint Helena",
        "toName": "to Saint Helena",
        "fromName": "from Saint Helena",
        "inName": "in Saint Helena",
        "callingCode": "290",
        "currencyCode": "SHP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "KN",
        "iso3Code": "kna",
        "name": "Saint Kitts and Nevis",
        "toName": "to Saint Kitts and Nevis",
        "fromName": "from Saint Kitts and Nevis",
        "inName": "in Saint Kitts and Nevis",
        "callingCode": "1",
        "currencyCode": "XCD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "LC",
        "iso3Code": "lca",
        "name": "Saint Lucia",
        "toName": "to Saint Lucia",
        "fromName": "from Saint Lucia",
        "inName": "in Saint Lucia",
        "callingCode": "1",
        "currencyCode": "XCD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "MF",
        "iso3Code": "maf",
        "name": "Saint Martin (French part)",
        "toName": "to Saint Martin (French part)",
        "fromName": "from Saint Martin (French part)",
        "inName": "in Saint Martin (French part)",
        "callingCode": "599",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "PM",
        "iso3Code": "spm",
        "name": "Saint Pierre and Miquelon",
        "toName": "to Saint Pierre and Miquelon",
        "fromName": "from Saint Pierre and Miquelon",
        "inName": "in Saint Pierre and Miquelon",
        "callingCode": "508",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "VC",
        "iso3Code": "vct",
        "name": "Saint Vincent and the Grenadines",
        "toName": "to Saint Vincent and the Grenadines",
        "fromName": "from Saint Vincent and the Grenadines",
        "inName": "in Saint Vincent and the Grenadines",
        "callingCode": "1",
        "currencyCode": "XCD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "WS",
        "iso3Code": "wsm",
        "name": "Samoa",
        "toName": "to Samoa",
        "fromName": "from Samoa",
        "inName": "in Samoa",
        "callingCode": "685",
        "currencyCode": "WST",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "SM",
        "iso3Code": "smr",
        "name": "San Marino",
        "toName": "to San Marino",
        "fromName": "from San Marino",
        "inName": "in San Marino",
        "callingCode": "378",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "ST",
        "iso3Code": "stp",
        "name": "Sao Tome and Principe",
        "toName": "to Sao Tome and Principe",
        "fromName": "from Sao Tome and Principe",
        "inName": "in Sao Tome and Principe",
        "callingCode": "239",
        "currencyCode": "STN",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SA",
        "iso3Code": "sau",
        "name": "Saudi Arabia",
        "toName": "to Saudi Arabia",
        "fromName": "from Saudi Arabia",
        "inName": "in Saudi Arabia",
        "callingCode": "966",
        "currencyCode": "SAR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "SN",
        "iso3Code": "sen",
        "name": "Senegal",
        "toName": "to Senegal",
        "fromName": "from Senegal",
        "inName": "in Senegal",
        "callingCode": "221",
        "currencyCode": "XOF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "RS",
        "iso3Code": "srb",
        "name": "Serbia",
        "toName": "to Serbia",
        "fromName": "from Serbia",
        "inName": "in Serbia",
        "callingCode": "381",
        "currencyCode": "RSD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "SC",
        "iso3Code": "syc",
        "name": "Seychelles",
        "toName": "to Seychelles",
        "fromName": "from Seychelles",
        "inName": "in Seychelles",
        "callingCode": "248",
        "currencyCode": "SCR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SL",
        "iso3Code": "sle",
        "name": "Sierra Leone",
        "toName": "to Sierra Leone",
        "fromName": "from Sierra Leone",
        "inName": "in Sierra Leone",
        "callingCode": "232",
        "currencyCode": "SLL",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "SG",
        "iso3Code": "sgp",
        "name": "Singapore",
        "toName": "to Singapore",
        "fromName": "from Singapore",
        "inName": "in Singapore",
        "callingCode": "65",
        "currencyCode": "SGD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SX",
        "iso3Code": "sxm",
        "name": "Sint Maarten (Dutch part)",
        "toName": "to Sint Maarten (Dutch part)",
        "fromName": "from Sint Maarten (Dutch part)",
        "inName": "in Sint Maarten (Dutch part)",
        "callingCode": "1",
        "currencyCode": "ANG",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "SK",
        "iso3Code": "svk",
        "name": "Slovakia",
        "toName": "to Slovakia",
        "fromName": "from Slovakia",
        "inName": "in Slovakia",
        "callingCode": "421",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SI",
        "iso3Code": "svn",
        "name": "Slovenia",
        "toName": "to Slovenia",
        "fromName": "from Slovenia",
        "inName": "in Slovenia",
        "callingCode": "386",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SB",
        "iso3Code": "slb",
        "name": "Solomon Islands",
        "toName": "to Solomon Islands",
        "fromName": "from Solomon Islands",
        "inName": "in Solomon Islands",
        "callingCode": "677",
        "currencyCode": "SBD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SO",
        "iso3Code": "som",
        "name": "Somalia",
        "toName": "to Somalia",
        "fromName": "from Somalia",
        "inName": "in Somalia",
        "callingCode": "252",
        "currencyCode": "SOS",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "ZA",
        "iso3Code": "zaf",
        "name": "South Africa",
        "toName": "to South Africa",
        "fromName": "from South Africa",
        "inName": "in South Africa",
        "callingCode": "27",
        "currencyCode": "ZAR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GS",
        "iso3Code": "sgs",
        "name": "South Georgia and the South Sandwich Islands",
        "toName": "to South Georgia and the South Sandwich Islands",
        "fromName": "from South Georgia and the South Sandwich Islands",
        "inName": "in South Georgia and the South Sandwich Islands",
        "callingCode": "500",
        "currencyCode": "FKP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "KR",
        "iso3Code": "kor",
        "name": "South Korea",
        "toName": "to South Korea",
        "fromName": "from South Korea",
        "inName": "in South Korea",
        "callingCode": "82",
        "currencyCode": "KRW",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SS",
        "iso3Code": "ssd",
        "name": "South Sudan",
        "toName": "to South Sudan",
        "fromName": "from South Sudan",
        "inName": "in South Sudan",
        "callingCode": "211",
        "currencyCode": "SSP",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "ES",
        "iso3Code": "esp",
        "name": "Spain",
        "toName": "to Spain",
        "fromName": "from Spain",
        "inName": "in Spain",
        "callingCode": "34",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "LK",
        "iso3Code": "lka",
        "name": "Sri Lanka",
        "toName": "to Sri Lanka",
        "fromName": "from Sri Lanka",
        "inName": "in Sri Lanka",
        "callingCode": "94",
        "currencyCode": "LKR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "SD",
        "iso3Code": "sdn",
        "name": "Sudan",
        "toName": "to Sudan",
        "fromName": "from Sudan",
        "inName": "in Sudan",
        "callingCode": "249",
        "currencyCode": "SDG",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "SR",
        "iso3Code": "sur",
        "name": "Suriname",
        "toName": "to Suriname",
        "fromName": "from Suriname",
        "inName": "in Suriname",
        "callingCode": "597",
        "currencyCode": "SRD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "SJ",
        "iso3Code": "sjm",
        "name": "Svalbard and Jan Mayen",
        "toName": "to Svalbard and Jan Mayen",
        "fromName": "from Svalbard and Jan Mayen",
        "inName": "in Svalbard and Jan Mayen",
        "callingCode": "47",
        "currencyCode": "NOK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SZ",
        "iso3Code": "swz",
        "name": "Swaziland",
        "toName": "to Swaziland",
        "fromName": "from Swaziland",
        "inName": "in Swaziland",
        "callingCode": "268",
        "currencyCode": "SZL",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SE",
        "iso3Code": "swe",
        "name": "Sweden",
        "toName": "to Sweden",
        "fromName": "from Sweden",
        "inName": "in Sweden",
        "callingCode": "46",
        "currencyCode": "SEK",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "CH",
        "iso3Code": "che",
        "name": "Switzerland",
        "toName": "to Switzerland",
        "fromName": "from Switzerland",
        "inName": "in Switzerland",
        "callingCode": "41",
        "currencyCode": "CHF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "SY",
        "iso3Code": "syr",
        "name": "Syrian Arab Republic",
        "toName": "to Syrian Arab Republic",
        "fromName": "from Syrian Arab Republic",
        "inName": "in Syrian Arab Republic",
        "callingCode": "963",
        "currencyCode": "SYP",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "TW",
        "iso3Code": "twn",
        "name": "Taiwan",
        "toName": "to Taiwan",
        "fromName": "from Taiwan",
        "inName": "in Taiwan",
        "callingCode": "886",
        "currencyCode": "TWD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "TJ",
        "iso3Code": "tjk",
        "name": "Tajikistan",
        "toName": "to Tajikistan",
        "fromName": "from Tajikistan",
        "inName": "in Tajikistan",
        "callingCode": "992",
        "currencyCode": "TJS",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "TZ",
        "iso3Code": "tza",
        "name": "Tanzania",
        "toName": "to Tanzania",
        "fromName": "from Tanzania",
        "inName": "in Tanzania",
        "callingCode": "255",
        "currencyCode": "TZS",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "TH",
        "iso3Code": "tha",
        "name": "Thailand",
        "toName": "to Thailand",
        "fromName": "from Thailand",
        "inName": "in Thailand",
        "callingCode": "66",
        "currencyCode": "THB",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "TL",
        "iso3Code": "tls",
        "name": "Timor-Leste",
        "toName": "to Timor-Leste",
        "fromName": "from Timor-Leste",
        "inName": "in Timor-Leste",
        "callingCode": "670",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "TG",
        "iso3Code": "tgo",
        "name": "Togo",
        "toName": "to Togo",
        "fromName": "from Togo",
        "inName": "in Togo",
        "callingCode": "228",
        "currencyCode": "XOF",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "TK",
        "iso3Code": "tkl",
        "name": "Tokelau",
        "toName": "to Tokelau",
        "fromName": "from Tokelau",
        "inName": "in Tokelau",
        "callingCode": "690",
        "currencyCode": "NZD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "TO",
        "iso3Code": "ton",
        "name": "Tonga",
        "toName": "to Tonga",
        "fromName": "from Tonga",
        "inName": "in Tonga",
        "callingCode": "676",
        "currencyCode": "TOP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "TT",
        "iso3Code": "tto",
        "name": "Trinidad and Tobago",
        "toName": "to Trinidad and Tobago",
        "fromName": "from Trinidad and Tobago",
        "inName": "in Trinidad and Tobago",
        "callingCode": "1",
        "currencyCode": "TTD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "TN",
        "iso3Code": "tun",
        "name": "Tunisia",
        "toName": "to Tunisia",
        "fromName": "from Tunisia",
        "inName": "in Tunisia",
        "callingCode": "216",
        "currencyCode": "TND",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "TR",
        "iso3Code": "tur",
        "name": "Turkey",
        "toName": "to Turkey",
        "fromName": "from Turkey",
        "inName": "in Turkey",
        "callingCode": "90",
        "currencyCode": "TRY",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "TM",
        "iso3Code": "tkm",
        "name": "Turkmenistan",
        "toName": "to Turkmenistan",
        "fromName": "from Turkmenistan",
        "inName": "in Turkmenistan",
        "callingCode": "993",
        "currencyCode": "TMT",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "TC",
        "iso3Code": "tca",
        "name": "Turks and Caicos Islands",
        "toName": "to Turks and Caicos Islands",
        "fromName": "from Turks and Caicos Islands",
        "inName": "in Turks and Caicos Islands",
        "callingCode": "1",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "TV",
        "iso3Code": "tuv",
        "name": "Tuvalu",
        "toName": "to Tuvalu",
        "fromName": "from Tuvalu",
        "inName": "in Tuvalu",
        "callingCode": "688",
        "currencyCode": "AUD",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "UG",
        "iso3Code": "uga",
        "name": "Uganda",
        "toName": "to Uganda",
        "fromName": "from Uganda",
        "inName": "in Uganda",
        "callingCode": "256",
        "currencyCode": "UGX",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "UA",
        "iso3Code": "ukr",
        "name": "Ukraine",
        "toName": "to Ukraine",
        "fromName": "from Ukraine",
        "inName": "in Ukraine",
        "callingCode": "380",
        "currencyCode": "UAH",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "AE",
        "iso3Code": "are",
        "name": "United Arab Emirates",
        "toName": "to the United Arab Emirates",
        "fromName": "from the United Arab Emirates",
        "inName": "in the United Arab Emirates",
        "callingCode": "971",
        "currencyCode": "AED",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "GB",
        "iso3Code": "gbr",
        "name": "United Kingdom",
        "toName": "to the UK",
        "fromName": "from the UK",
        "inName": "in the UK",
        "callingCode": "44",
        "currencyCode": "GBP",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "US",
        "iso3Code": "usa",
        "name": "United States",
        "toName": "to the USA",
        "fromName": "from the USA",
        "inName": "in the USA",
        "callingCode": "1",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "UM",
        "iso3Code": "umi",
        "name": "United States Minor Outlying Islands",
        "toName": "to the United States Minor Outlying Islands",
        "fromName": "from the United States Minor Outlying Islands",
        "inName": "in the United States Minor Outlying Islands",
        "callingCode": "246",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "VI",
        "iso3Code": "vir",
        "name": "United States Virgin Islands",
        "toName": "to the United States Virgin Islands",
        "fromName": "from the United States Virgin Islands",
        "inName": "in the United States Virgin Islands",
        "callingCode": "1",
        "currencyCode": "USD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "UY",
        "iso3Code": "ury",
        "name": "Uruguay",
        "toName": "to Uruguay",
        "fromName": "from Uruguay",
        "inName": "in Uruguay",
        "callingCode": "598",
        "currencyCode": "UYU",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "UZ",
        "iso3Code": "uzb",
        "name": "Uzbekistan",
        "toName": "to Uzbekistan",
        "fromName": "from Uzbekistan",
        "inName": "in Uzbekistan",
        "callingCode": "998",
        "currencyCode": "UZS",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "VU",
        "iso3Code": "vut",
        "name": "Vanuatu",
        "toName": "to Vanuatu",
        "fromName": "from Vanuatu",
        "inName": "in Vanuatu",
        "callingCode": "678",
        "currencyCode": "VUV",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "VA",
        "iso3Code": "vat",
        "name": "Vatican City",
        "toName": "to Vatican City",
        "fromName": "from Vatican City",
        "inName": "in Vatican City",
        "callingCode": "379",
        "currencyCode": "EUR",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "VE",
        "iso3Code": "ven",
        "name": "Venezuela",
        "toName": "to Venezuela",
        "fromName": "from Venezuela",
        "inName": "in Venezuela",
        "callingCode": "58",
        "currencyCode": "VEF",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "VN",
        "iso3Code": "vnm",
        "name": "Vietnam",
        "toName": "to Vietnam",
        "fromName": "from Vietnam",
        "inName": "in Vietnam",
        "callingCode": "84",
        "currencyCode": "VND",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "WF",
        "iso3Code": "wlf",
        "name": "Wallis and Futuna",
        "toName": "to Wallis and Futuna",
        "fromName": "from Wallis and Futuna",
        "inName": "in Wallis and Futuna",
        "callingCode": "681",
        "currencyCode": "XPF",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "EH",
        "iso3Code": "esh",
        "name": "Western Sahara",
        "toName": "to Western Sahara",
        "fromName": "from Western Sahara",
        "inName": "in Western Sahara",
        "callingCode": "212",
        "currencyCode": "MAD",
        "profileTypes": [
            "PERSONAL",
            "BUSINESS"
        ],
        "states": []
    },
    {
        "iso2Code": "YE",
        "iso3Code": "yem",
        "name": "Yemen",
        "toName": "to Yemen",
        "fromName": "from Yemen",
        "inName": "in Yemen",
        "callingCode": "967",
        "currencyCode": "YER",
        "profileTypes": [],
        "states": []
    },
    {
        "iso2Code": "ZM",
        "iso3Code": "zmb",
        "name": "Zambia",
        "toName": "to Zambia",
        "fromName": "from Zambia",
        "inName": "in Zambia",
        "callingCode": "260",
        "currencyCode": "ZMW",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    },
    {
        "iso2Code": "ZW",
        "iso3Code": "zwe",
        "name": "Zimbabwe",
        "toName": "to Zimbabwe",
        "fromName": "from Zimbabwe",
        "inName": "in Zimbabwe",
        "callingCode": "263",
        "currencyCode": "ZWL",
        "profileTypes": [
            "PERSONAL"
        ],
        "states": []
    }

]





