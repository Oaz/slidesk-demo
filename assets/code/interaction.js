
function showCount(getVisual) {
    const height = convertToPixels('90vh');
    const fillColor = getColorFromVariable('--sd-primary-color');
    const emptyColor = getColorFromVariable('--sd-secondary-color');
    return async function (state) {
        const visual = await getVisual();
        const gauge = verticalGauge(
            visual.count, visual.total,
            visual.display, height,
            fillColor, emptyColor, "white", visual.textSize
        );
        if (visual.complete) {
            return gauge;
        }
        return {
            data: gauge.data,
            layout: gauge.layout,
            repeat: 1000,
            state: state
        };
    }
}

function showUsersCount(keypadName) {
    return showCount(async () => {
        let users = await countUsers(keypadName);
        if (!users) {
            users = {};
        }
        const count = Object.keys(users).length;
        return {
            count: Math.log(count || 1),
            total: Math.log(1000),
            display: count.toString(),
            textSize: 100,
            complete: false,
        }
    });
}

function interact(keypadName, keypadDefine, plotCompute) {
  keypadDefine(keypadName);
  return plotCompute(keypadName);
}

const pollChoices = [
    "SliDesk",
    "Reveal.js",
    "Un autre outil web",
    "Un outil de bureau",
    "Des PDFs",
    "Autre chose",
];

function definePollPad(keypadName) {
    return multiChoicePad(keypadName, pollChoices.length);
}

function showPollResult(keypadName) {
    const fillColor = getColorFromVariable('--sd-primary-color');
    return async function (state) {
        let answers = await pressedKeys(keypadName);
        if (!answers) {
            answers = {};
        }
        const labels = pollChoices.map(
            (choice, index) => `${String.fromCharCode(65 + index)} - ${choice}`
        );
        const counts = pollChoices.map((_, index) =>
            Object.values(answers).filter((mask) => (Number(mask) >> index) & 1).length
        );
        return {
            data: [{
                x: labels,
                y: counts,
                type: "bar",
                text: counts.map(String),
                textposition: "inside",
                insidetextanchor: "middle",
                textfont: { color: "white", size: 30 },
                marker: { color: fillColor },
            }],
            layout: {
                ...transparentLayout,
                showlegend: false,
                width: 1100,
                height: 600,
                margin: { l: 30, r: 30, t: 30, b: 30 },
                xaxis: {
                    visible: true,
                    automargin: true,
                    tickfont: { size: 28 },
                },
                yaxis: {
                    visible: false,
                    rangemode: "tozero",
                },
            },
            repeat: 1000,
            state: state,
        };
    };
}

let departementsGeoJSON = null;

async function loadDepartements() {
    if (!departementsGeoJSON) {
        const response = await fetch('assets/media/departements.geojson');
        departementsGeoJSON = await response.json();
    }
    return departementsGeoJSON;
}

function featureCentroid(feature) {
    const polygons = feature.geometry.type === 'Polygon'
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;
    let best = null;
    let bestSize = -1;
    for (const polygon of polygons) {
        for (const ring of polygon) {
            if (ring.length > bestSize) {
                bestSize = ring.length;
                best = ring;
            }
        }
    }
    let lon = 0;
    let lat = 0;
    for (const point of best) {
        lon += point[0];
        lat += point[1];
    }
    return [lon / best.length, lat / best.length];
}

function defineNumberPad(keypadName) {
    return numericPad(keypadName, 2);
}

function showMapResult(keypadName) {
    const fillColor = getColorFromVariable('--sd-primary-color');
    return async function (state) {
        const geo = await loadDepartements();
        let answers = await resultingInteger(keypadName);
        if (!answers) {
            answers = {};
        }
        const counts = {};
        Object.values(answers).forEach((value) => {
            const department = Number(value);
            if (department >= 1 && department <= 95) {
                const code = String(department).padStart(2, '0');
                counts[code] = (counts[code] || 0) + 1;
            }
        });
        const allCodes = geo.features.map((feature) => feature.properties.code);
        const allNames = Object.fromEntries(
            geo.features.map((feature) => [feature.properties.code, feature.properties.nom])
        );
        const centroids = Object.fromEntries(
            geo.features.map((feature) => [feature.properties.code, featureCentroid(feature)])
        );
        const maxCount = Math.max(2, ...Object.values(counts));
        const selectedCodes = allCodes.filter((code) => counts[code]);
        return {
            data: [
                {
                    type: 'choropleth',
                    geojson: geo,
                    featureidkey: 'properties.code',
                    locations: allCodes,
                    z: allCodes.map((code) => counts[code] || 0),
                    zmin: 0,
                    zmax: maxCount,
                    text: allCodes.map((code) => allNames[code]),
                    colorscale: [
                        [0, 'rgba(122, 247, 213, 0.12)'],
                        [1, fillColor],
                    ],
                    showscale: false,
                    hovertemplate: '%{text}<br>%{z} personne(s)<extra></extra>',
                    marker: { line: { width: 0.5, color: 'rgba(255, 255, 255, 0.35)' } },
                },
                {
                    type: 'scattergeo',
                    mode: 'text',
                    lon: selectedCodes.map((code) => centroids[code][0]),
                    lat: selectedCodes.map((code) => centroids[code][1]),
                    text: selectedCodes.map((code) => String(counts[code])),
                    textfont: { color: 'white', size: 26, family: 'Arial' },
                    hoverinfo: 'skip',
                    showlegend: false,
                },
            ],
            layout: {
                ...transparentLayout,
                margin: { l: 0, r: 0, t: 0, b: 0 },
                width: 1000,
                height: 700,
                geo: {
                    scope: 'europe',
                    visible: true,
                    projection: { type: 'mercator' },
                    showland: true,
                    showocean: true,
                    showcountries: true,
                    showlakes: true,
                    landcolor: 'rgba(36, 36, 36, 0.08)',
                    oceancolor: 'rgba(0, 0, 0, 0)',
                    countrycolor: 'rgba(36, 36, 36, 0.45)',
                    coastlinecolor: 'rgba(36, 36, 36, 0.45)',
                    lakecolor: 'rgba(36, 36, 36, 0.15)',
                    bgcolor: 'rgba(0,0,0,0)',
                    frame: { visible: false },
                    lonaxis: { range: [-5, 8.5] },
                    lataxis: { range: [42.5, 51.4] },
                },
            },
            repeat: 1000,
            state: state,
        };
    };
}

function showBubbleResult() {
    const fillColor = getColorFromVariable('--sd-primary-color');
    return async function (state) {
        const [pollAnswers, mapAnswers] = await Promise.all([
            pressedKeys('cdl-poll'),
            resultingInteger('cdl-map'),
        ]);
        const counts = {};
        Object.entries(pollAnswers || {}).forEach(([uid, mask]) => {
            const department = Number((mapAnswers || {})[uid]);
            if (department >= 1 && department <= 95) {
                pollChoices.forEach((_, index) => {
                    if ((Number(mask) >> index) & 1) {
                        const key = department + ':' + index;
                        counts[key] = (counts[key] || 0) + 1;
                    }
                });
            }
        });
        const entries = Object.entries(counts);
        const maxCount = Math.max(1, ...entries.map(([, count]) => count));
        return {
            data: [{
                type: 'scatter',
                mode: 'markers',
                x: entries.map(([key]) => Number(key.split(':')[0])),
                y: entries.map(([key]) => Number(key.split(':')[1])),
                marker: {
                    color: fillColor,
                    size: entries.map(([, count]) => 20 + 30 * (count / maxCount)),
                    opacity: 0.75,
                    line: { color: 'white', width: 1 },
                },
                showlegend: false,
            }],
            layout: {
                ...transparentLayout,
                width: 1100,
                height: 600,
                margin: { l: 220, r: 40, t: 30, b: 60 },
                xaxis: {
                    visible: true,
                    title: { text: 'Département', font: { size: 24 } },
                    range: [0, 96],
                    dtick: 10,
                    tickfont: { size: 20 },
                    gridcolor: 'rgba(255, 255, 255, 0.15)',
                },
                yaxis: {
                    visible: true,
                    autorange: 'reversed',
                    tickvals: pollChoices.map((_, index) => index),
                    ticktext: pollChoices,
                    tickfont: { size: 20 },
                    gridcolor: 'rgba(255, 255, 255, 0.15)',
                },
            },
            state: state,
        };
    };
}

const gameSize = 20;

function showGame(keypadName) {
    const fillColor = getColorFromVariable('--sd-primary-color');
    return async function (state) {
        state = state || {};
        if (!state.starts) {
            state.starts = {};
        }
        let moves = await cursorMovement(keypadName);
        if (!moves) {
            moves = {};
        }
        const temperature = Array.from({ length: gameSize }, () => Array(gameSize).fill(0));
        Object.entries(moves).forEach(([uid, value]) => {
            if (!state.starts[uid]) {
                state.starts[uid] = [
                    6 + Math.floor(Math.random() * (gameSize - 12)),
                    6 + Math.floor(Math.random() * (gameSize - 12)),
                ];
            }
            const [xstart, ystart] = state.starts[uid];
            const packed = Number(value);
            const dx = Math.floor(packed / 1000) - 500;
            const dy = (packed % 1000) - 500;
            const x = Math.min(gameSize - 1, Math.max(0, xstart + dx));
            const y = Math.min(gameSize - 1, Math.max(0, ystart + dy));
            temperature[y][x] += 1;
        });
        const hotCells = [];
        temperature.forEach((row, y) => row.forEach((count, x) => {
            if (count > 0) {
                hotCells.push([x, y, count]);
            }
        }));
        const maxTemperature = Math.max(2, ...temperature.flat());
        return {
            data: [
                {
                    type: 'heatmap',
                    z: temperature,
                    xgap: 1,
                    ygap: 1,
                    zmin: 0,
                    zmax: maxTemperature,
                    colorscale: [
                        [0, 'rgba(122, 247, 213, 0.05)'],
                        [1, fillColor],
                    ],
                    showscale: false,
                    hovertemplate: '%{z} joueur(s)<extra></extra>',
                },
                {
                    type: 'scatter',
                    mode: 'text',
                    x: hotCells.map(([x]) => x),
                    y: hotCells.map(([, y]) => y),
                    text: hotCells.map(([, , count]) => String(count)),
                    textfont: { color: 'white', size: 18, family: 'Arial' },
                    hoverinfo: 'skip',
                    showlegend: false,
                },
            ],
            layout: {
                ...transparentLayout,
                width: 720,
                height: 700,
                margin: { l: 20, r: 20, t: 20, b: 20 },
                xaxis: { visible: false },
                yaxis: { visible: false, autorange: 'reversed' },
            },
            repeat: 1000,
            state: state,
        };
    };
}
