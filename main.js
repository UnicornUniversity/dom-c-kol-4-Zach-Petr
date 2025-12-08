// Data pro generování a pomocné funkce (kromě mean, round, atd. které jsou nahrazeny dole)
const dtoIn = {
    count: 50,
    age: {
        min: 19,
        max: 35
    }
};

const pohlavi = ["male", "female"];
const uvazek = [10, 20, 30, 40];

const jmenaM = [
    "Jakub", "Jan", "Tomáš", "Adam", "Matyáš", "Filip",
    "Vojtěch", "Ondřej", "David", "Lukáš",
];

const jmenaZ = [
    "Jana", "Eva", "Renata", "Martina", "Božena", "Daniela",
    "Růžena", "Anna", "Kateřina", "Radka",
];

const prijmeni = [
    ["Novotný", "Novotná"], ["Dvořák", "Dvořáková"], ["Černý", "Černá"],
    ["Procházka", "Procházková"], ["Kučera", "Kučerová"], ["Veselý", "Veselá"],
    ["Horák", "Horáková"], ["Němec", "Němcová"], ["Pokorný", "Pokorná"],
    ["Král", "Králová"], ["Růžička", "Růžičková"], ["Beneš", "Benešová"],
    ["Fiala", "Fialová"], ["Sedláček", "Sedláčková"], ["Šimek", "Šimková"],
];

const randomPrvek = (array) => array[Math.floor(Math.random() * array.length)];

// Funkce zůstává nezměněna
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

// --- POMOCNÉ FUNKCE (Nahrazují knihovny) ---
const round = (num, decimals = 0) => Math.round(num * 10 ** decimals) / 10 ** decimals;
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const min = (arr) => Math.min(...arr);
const max = (arr) => Math.max(...arr);
const sortBy = (arr, key) => [...arr].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
});
const median = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    } 
    return sorted[mid];
};

// --- EXPORTOVANÉ FUNKCE ---

// OPRAVENO: Název funkce z genereteEmployeeData na generateEmployeeData
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

export const getEmployeeStatistics = (seznam) => {
    const total = seznam.length;

    const vekHodnoty = seznam.map(osoba => {
        const today = new Date();
        const birth = new Date(osoba.birthdate);
        
        // OPRAVENO: Přesný desetinný výpočet věku pro lepší přesnost průměru
        const diff = today.getTime() - birth.getTime();
        const preciseAge = diff / (1000 * 60 * 60 * 24 * 365.25);
        
        return preciseAge;
    });

    const uvazekH = seznam.map(osoba => osoba.workload);

    const zenyWorkload = seznam
        .filter(osoba => osoba.gender === "female")
        .map(osoba => osoba.workload);

    // averageAge je nyní počítán z přesných desetinných hodnot a zaokrouhlen na 1 desetinné místo
    const averageAge = round(mean(vekHodnoty), 1); 
    
    // minAge a maxAge musí být zaokrouhleny na celé číslo pro smysluplnost (věk v letech)
    const minAge = Math.floor(min(vekHodnoty));
    const maxAge = Math.ceil(max(vekHodnoty));
    const medianAge = round(median(vekHodnoty), 1);

    const medianWorkload = round(median(uvazekH), 1);
    const averageWomenWorkload = round(mean(zenyWorkload), 1);

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

export const main = (dtoIn) => {
    const employeeData = generateEmployeeData(dtoIn);
    const dtoOut = getEmployeeStatistics(employeeData);
    return dtoOut;
}
