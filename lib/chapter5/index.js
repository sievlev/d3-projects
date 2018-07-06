import easingChart from "./easingChart";
import prisonChart from "./prisonChart";


export async function renderSVGStuff(){
//    easingChart(true);

    await prisonChart.init();
    const data = prisonChart.data;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function randomChart() {
        try {
            const from = getRandomInt(0, data.length - 1);
            const to = getRandomInt(from, data.length - 1);
            prisonChart.update(data.slice(from, to));
        } catch(e) {
            console.error(e);
        }
    }

    prisonChart.update(data);
    setInterval(randomChart, 5000);
}
