const load = require("lodash");
const simpleS = require("simple-statistics");

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

const randomPrvek = (array) => array[Math.floor(Math.random() * array.length)];

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

export const genereteEmployeeData = (dtoIn) => {
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
        let age = today.getFullYear() - birth.getFullYear();
        if (today.getMonth() < birth.getMonth() ||
            (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    });

    const uvazekH = seznam.map(osoba => osoba.workload);

    const zenyWorkload = seznam
        .filter(osoba => osoba.gender === "female")
        .map(osoba => osoba.workload);

    const averageAge = load.round(load.mean(vekHodnoty), 1);
    const minAge = load.min(vekHodnoty);
    const maxAge = load.max(vekHodnoty);
    const medianAge = load.round(simpleS.median(vekHodnoty), 1);

    const medianWorkload = load.round(simpleS.median(uvazekH), 1);
    const averageWomenWorkload = load.round(load.mean(zenyWorkload), 1);

    const workload10 = seznam.filter(e => e.workload === 10).length;
    const workload20 = seznam.filter(e => e.workload === 20).length;
    const workload30 = seznam.filter(e => e.workload === 30).length;
    const workload40 = seznam.filter(e => e.workload === 40).length;

    const sortedByWorkload = load.sortBy(seznam, 'workload');

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
    const employeeData = genereteEmployeeData(dtoIn);
    const dtoOut = getEmployeeStatistics(employeeData);
    return dtoOut;
}
