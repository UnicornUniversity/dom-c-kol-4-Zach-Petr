/**
 * @typedef {object} DtoIn
 * @property {number} count Počet generovaných zaměstnanců
 * @property {{min: number, max: number}} age Minimální a maximální věk
 */
const dtoIn = {
    count: 50,
    age: {
        min: 19,
        max: 35
    }
};

/** @type {string[]} */
const pohlavi = [
    "male",
    "female",
];

/** @type {number[]} */
const uvazek = [
    10,
    20,
    30,
    40,
];

/** @type {string[]} */
const jmenaM = [
    "Jakub",
    "Jan",
    "Tomáš",
    "Adam",
    "Matyáš",
    "Filip",
    "Vojtěch",
    "Ondřej",
    "David",
    "Lukáš",
];

/** @type {string[]} */
const jmenaZ = [
    "Jana",
    "Eva",
    "Renata",
    "Martina",
    "Božena",
    "Daniela",
    "Růžena",
    "Anna",
    "Kateřina",
    "Radka",
];

/**
 * Pole dvojic: [příjmení muž, příjmení žena]
 * @type {Array<[string, string]>}
 */
const prijmeni = [
    ["Novotný", "Novotná"],
    ["Dvořák", "Dvořáková"],
    ["Černý", "Černá"],
    ["Procházka", "Procházková"],
    ["Kučera", "Kučerová"],
    ["Veselý", "Veselá"],
    ["Horák", "Horáková"],
    ["Němec", "Němcová"],
    ["Pokorný", "Pokorná"],
    ["Král", "Králová"],
    ["Růžička", "Růžičková"],
    ["Beneš", "Benešová"],
    ["Fiala", "Fialová"],
    ["Sedláček", "Sedláčková"],
    ["Šimek", "Šimková"],
];

/**
 * Vrátí náhodný prvek pole.
 * @param {Array<any>} array Pole, ze kterého se vybírá náhodný prvek.
 * @returns {*} Náhodně vybraný prvek.
 */
const randomPrvek = (array) => array[Math.floor(Math.random() * array.length)];

/**
 * Vygeneruje náhodné datum narození podle rozsahu věků.
 * @param {number} minVek Minimální věk osoby.
 * @param {number} maxVek Maximální věk osoby.
 * @returns {string} Datum narození jako ISO řetězec.
 */
const randomCas = (minVek, maxVek) => {
    if (typeof minVek !== "number" || typeof maxVek !== "number") {
        throw new Error("Věk musí být číslo");
    }
    if (minVek > maxVek) {
        [minVek, maxVek] = [maxVek, minVek];
    }

    const ted = new Date();
    const yearMs = 365.25 * 24 * 60 * 60 * 1000;

    const minBirth = ted.getTime() - maxVek * yearMs;
    const maxBirth = ted.getTime() - minVek * yearMs;

    const randomTime = minBirth + Math.random() * (maxBirth - minBirth);

    return new Date(randomTime).toISOString();
};

/**
 * Zaokrouhlí číslo na zadaný počet desetinných míst.
 * @param {number} num Číslo k zaokrouhlení.
 * @param {number} decimals Počet desetinných míst.
 * @returns {number} Zaokrouhlený výsledek.
 */
const round = (num, decimals) => Math.round(num * 10 ** decimals) / 10 ** decimals;

/**
 * Vypočítá průměr hodnot v poli.
 * @param {number[]} arr Pole čísel.
 * @returns {number} Aritmetický průměr.
 */
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

/**
 * Vrací nejmenší položku v poli
 * @param {number[]} arr Pole čísel.
 * @returns {number} Nejnižší hodnota.
 */
const min = (arr) => Math.min(...arr);

/**
 * Vrací největší položku v poli
 * @param {number[]} arr Pole čísel.
 * @returns {number} Nejvyšší hodnota.
 */
const max = (arr) => Math.max(...arr);

/**
 * Seřadí pole podle klíče
 * @param {object[]} arr Pole objektů.
 * @param {string} key Klíč podle kterého se třídí.
 * @returns {object[]} Seřazené pole.
 */
const sortBy = (arr, key) => [...arr].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
});

/**
 * Vypočte medián
 * @param {number[]} arr Pole čísel.
 * @returns {number} Medián hodnot.
 */
const median = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
};

/**
 * Přejmenovaná funkce main z úkolu 3
 * @param {DtoIn} dtoIn Vstupní objekt s počtem a rozsahem věku.
 * @returns {object[]} Pole zaměstnanců.
 */
export const generateEmployeeData = (dtoIn) => {
    if (!dtoIn.age || typeof dtoIn.age.min !== "number" || typeof dtoIn.age.max !== "number") {
        throw new Error("age.min a age.max musí být zadány");
    }

    const { count, age } = dtoIn;
    const minVek = age.min;
    const maxVek = age.max;

    const dtoOut = [];

    for (let i = 0; i < count; i++) {
        const gender = randomPrvek(pohlavi);
        const name = gender === "male" ? randomPrvek(jmenaM) : randomPrvek(jmenaZ);
        const prijmeniV = randomPrvek(prijmeni);
        const surname = gender === "male" ? prijmeniV[0] : prijmeniV[1];

        dtoOut.push({
            gender,
            birthdate: randomCas(minVek, maxVek),
            name,
            surname,
            workload: randomPrvek(uvazek),
        });
    }

    return dtoOut;
};

/**
 * Spočítá statistiky zaměstnanců.
 * @param {object[]} seznam Pole zaměstnanců.
 * @returns {object} Statistické údaje.
 */
export const getEmployeeStatistics = (seznam) => {
    const total = seznam.length;

    const vekHodnoty = seznam.map(osoba => {
        const today = new Date();
        const birth = new Date(osoba.birthdate);

        const diff = today.getTime() - birth.getTime();
        const preciseAge = diff / (1000 * 60 * 60 * 24 * 365.25);

        return preciseAge;
    });

    const uvazekH = seznam.map(osoba => osoba.workload);

    const zenyWorkload = seznam
        .filter(osoba => osoba.gender === "female")
        .map(osoba => osoba.workload);

    const averageAge = round(mean(vekHodnoty), 1);
    const minAge = Math.floor(min(vekHodnoty));
    const maxAge = Math.floor(max(vekHodnoty));
    const medianAge = Math.floor(median(vekHodnoty));

    const medianWorkload = round(median(uvazekH), 1);
    const averageWomenWorkload = zenyWorkload.length > 0 ? round(mean(zenyWorkload), 1) : 0;

    const workload10 = seznam.filter(e => e.workload === 10).length;
    const workload20 = seznam.filter(e => e.workload === 20).length;
    const workload30 = seznam.filter(e => e.workload === 30).length;
    const workload40 = seznam.filter(e => e.workload === 40).length;

    const sortedByWorkload = sortBy(seznam, 'workload');

    return {
        total,
        workload10,
        workload20,
        workload30,
        workload40,
        averageAge,
        minAge,
        maxAge,
        medianAge,
        medianWorkload,
        averageWomenWorkload,
        sortedByWorkload
    };
};

/**
 * Spustí generování seznamu zaměstnanců a výpočet statistik.
 * @param {DtoIn} dtoIn Vstupní parametry.
 * @returns {object} Statistické údaje zaměstnanců.
 */
export const main = (dtoIn) => {
    const employeeData = generateEmployeeData(dtoIn);
    const dtoOut = getEmployeeStatistics(employeeData);
    return dtoOut;
};
