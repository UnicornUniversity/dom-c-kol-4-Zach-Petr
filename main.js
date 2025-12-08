const dtoIn = {
    count: 50,
    age: {
        min: 19,
        max: 35
    }
};

const pohlavi = ["male", "female"];
const uvazek = [10, 20, 30, 40];

const jmenaM = ["Jakub","Jan","Tomáš","Adam","Matyáš","Filip","Vojtěch","Ondřej","David","Lukáš"];
const jmenaZ = ["Jana","Eva","Renata","Martina","Božena","Daniela","Růžena","Anna","Kateřina","Radka"];

const prijmeni = [
    ["Novotný","Novotná"],["Dvořák","Dvořáková"],["Černý","Černá"],["Procházka","Procházková"],
    ["Kučera","Kučerová"],["Veselý","Veselá"],["Horák","Horáková"],["Němec","Němcová"],
    ["Pokorný","Pokorná"],["Král","Králová"],["Růžička","Růžičková"],["Beneš","Benešová"],
    ["Fiala","Fialová"],["Sedláček","Sedláčková"],["Šimek","Šimková"]
];

const randomPrvek = (array) => array[Math.floor(Math.random() * array.length)];

const randomCas = (minVek, maxVek) => {
    if (typeof minVek !== "number" || typeof maxVek !== "number") throw new Error("Věk musí být číslo");
    if (minVek > maxVek) [minVek, maxVek] = [maxVek, minVek];

    const ted = new Date();
    const yearMs = 365.25 * 24 * 60 * 60 * 1000;
    const minBirth = ted.getTime() - maxVek * yearMs;
    const maxBirth = ted.getTime() - minVek * yearMs;
    const randomTime = minBirth + Math.random() * (maxBirth - minBirth);

    return new Date(randomTime).toISOString();
};

// Statistické funkce
const mean = (arr) => arr.reduce((a,b)=>a+b,0)/arr.length;
const round1 = (num) => Math.round(num*10)/10;
const median = (arr) => {
    const sorted = [...arr].sort((a,b)=>a-b);
    const mid = Math.floor(sorted.length/2);
    return sorted.length%2===0 ? (sorted[mid-1]+sorted[mid])/2 : sorted[mid];
};
const minVal = (arr) => Math.min(...arr);
const maxVal = (arr) => Math.max(...arr);
const sortBy = (arr,key)=>[...arr].sort((a,b)=>a[key]-b[key]);

export const generateEmployeeData = (dtoIn) => {
    if (!dtoIn.age || typeof dtoIn.age.min !== "number" || typeof dtoIn.age.max !== "number") {
        throw new Error("age.min a age.max musí být zadány");
    }

    const { count, age } = dtoIn;
    const { min: minVek, max: maxVek } = age;

    const dtoOut = [];

    for (let i=0;i<count;i++) {
        const gender = randomPrvek(pohlavi);
        const name = gender==="male" ? randomPrvek(jmenaM) : randomPrvek(jmenaZ);
        const prijmeniV = randomPrvek(prijmeni);
        const surname = gender==="male" ? prijmeniV[0] : prijmeniV[1];

        dtoOut.push({
            gender,
            birthdate: randomCas(minVek,maxVek),
            name,
            surname,
            workload: randomPrvek(uvazek)
        });
    }

    return dtoOut;
};

export const getEmployeeStatistics = (seznam) => {
    const total = seznam.length;

    // Věk každého zaměstnance přesně
    const vekHodnoty = seznam.map(osoba => {
        const birth = new Date(osoba.birthdate);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff===0 && today.getDate() < birth.getDate())) age--;

        console.log(`${osoba.name} ${osoba.surname} narozen: ${birth.toISOString().slice(0,10)}, věk: ${age}`);
        return age;
    });

    const uvazekH = seznam.map(e=>e.workload);
    const zenyWorkload = seznam.filter(e=>e.gender==="female").map(e=>e.workload);

    const sumAge = vekHodnoty.reduce((a,b)=>a+b,0);
    const averageAge = round1(sumAge/vekHodnoty.length);
    const minAge = minVal(vekHodnoty);
    const maxAge = maxVal(vekHodnoty);
    const medianAge = round1(median(vekHodnoty));

    const medianWorkload = round1(median(uvazekH));
    const averageWomenWorkload = round1(mean(zenyWorkload));

    const workload10 = seznam.filter(e=>e.workload===10).length;
    const workload20 = seznam.filter(e=>e.workload===20).length;
    const workload30 = seznam.filter(e=>e.workload===30).length;
    const workload40 = seznam.filter(e=>e.workload===40).length;

    const sortedByWorkload = sortBy(seznam,'workload');

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
    return getEmployeeStatistics(employeeData);
};

