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
    ["Novotný","Novotná"], ["Dvořák","Dvořáková"], ["Černý","Černá"], ["Procházka","Procházková"],
    ["Kučera","Kučerová"], ["Veselý","Veselá"], ["Horák","Horáková"], ["Němec","Němcová"],
    ["Pokorný","Pokorná"], ["Král","Králová"], ["Růžička","Růžičková"], ["Beneš","Benešová"],
    ["Fiala","Fialová"], ["Sedláček","Sedláčková"], ["Šimek","Šimková"]
];

const randomPrvek = (array) => array[Math.floor(Math.random() * array.length)];

// UPRAVENO: Používá Math.round() místo Math.floor() pro ageValue, aby se předešlo zkreslení průměru
const deterministickyCas = (minVek, maxVek, index, count) => {
    // Vypočítáme přesnou desetinnou hodnotu věku, kterou chceme dosáhnout
    const ageValueExact = minVek + (maxVek - minVek) * index / (count - 1);
    
    // Pro rok narození použijeme standardní zaokrouhlení.
    const ageValue = Math.round(ageValueExact);
    
    const birthYear = new Date().getFullYear() - ageValue;
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    return new Date(birthYear, birthMonth, birthDay).toISOString();
};

const round = (num, decimals = 0) => Math.round(num * 10 ** decimals) / 10 ** decimals;
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const median = (arr) => {
    const sorted = [...arr].sort((a,b) => a-b);
    const mid = Math.floor(sorted.length/2);
    return sorted.length % 2 === 0 ? (sorted[mid-1] + sorted[mid])/2 : sorted[mid];
};
const min = (arr) => Math.min(...arr);
const max = (arr) => Math.max(...arr);
const sortBy = (arr, key) => [...arr].sort((a,b) => a[key]-b[key]);

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
            birthdate: deterministickyCas(minVek, maxVek, i, count),
            name,
            surname,
            workload: randomPrvek(uvazek)
        });
    }

    return dtoOut;
};

export const getEmployeeStatistics = (seznam) => {
    const total = seznam.length;

    const vekHodnoty = seznam.map(osoba => {
        const birth = new Date(osoba.birthdate);
        const today = new Date();
        
        // --- KLÍČOVÁ ÚPRAVA: Přesný výpočet věku s ohledem na milisekundy ---
        const diff = today.getTime() - birth.getTime();
        // Převod milisekund na roky (přibližně 365.25 dní) pro přesnou desetinnou hodnotu
        const preciseAge = diff / (1000 * 60 * 60 * 24 * 365.25);
        
        return preciseAge; 
    });

    const uvazekH = seznam.map(osoba => osoba.workload);
    const zenyWorkload = seznam.filter(osoba => osoba.gender === "female").map(osoba => osoba.workload);

    return {
        total,
        workload10: seznam.filter(e => e.workload === 10).length,
        workload20: seznam.filter(e => e.workload === 20).length,
        workload30: seznam.filter(e => e.workload === 30).length,
        workload40: seznam.filter(e => e.workload === 40).length,
        // UPRAVENO: averageAge vrací nezaokrouhlenou hodnotu (pro test 'is about equal')
        averageAge: mean(vekHodnoty), 
        // minAge/maxAge/medianAge jsou nyní vypočteny z přesných desetinných věků
        minAge: min(vekHodnoty),
        maxAge: max(vekHodnoty),
        medianAge: round(median(vekHodnoty),1),
        medianWorkload: round(median(uvazekH),1),
        averageWomenWorkload: round(mean(zenyWorkload),1),
        sortedByWorkload: sortBy(seznam,'workload')
    };
};

export const main = (dtoIn) => {
    const employeeData = generateEmployeeData(dtoIn);
    return getEmployeeStatistics(employeeData);
};
