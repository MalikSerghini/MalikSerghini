import Mustache from "mustache"
import fetch from "node-fetch"
import fs from "fs"
const MUSTACHE_MAIN_DIR = './main.mustache';

const getAccountAge =  async (username) => {

    const result = await fetch(`https://api.github.com/users/${username}`)
        .then(response => response.json())

    var givenDate = new Date(result.created_at);

    var currentDate = new Date();

    var yearsDifference = currentDate.getFullYear() - givenDate.getFullYear();

    var monthsDifference = currentDate.getMonth() - givenDate.getMonth();

    if (monthsDifference < 0 || (monthsDifference === 0 && currentDate.getDate() < givenDate.getDate())) {
        yearsDifference--;
        monthsDifference += 12;
    }

    let ageDifference = `${yearsDifference} Years and ${monthsDifference} Month`

    return ageDifference

}

const generateReadMe = async () => {

    const readMeData = {
        accountAge: await getAccountAge("MalikSerghini")
    };

    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), readMeData);
        fs.writeFileSync('README.md', output);
    });
}

generateReadMe();