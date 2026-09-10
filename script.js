// ============================================
// OIN BITCOIN MINING CALCULATOR
// Powered by OinanceLink Technology
// ============================================


// ============================================
// GLOBAL VARIABLES
// ============================================

let profitChart = null;


// Backup currency exchange rates
// Base currency: USD

let exchangeRates = {
  USD: 1,
  NGN: 1600,
  GBP: 0.79,
  EUR: 0.92,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 150,
  CNY: 7.2,
  INR: 83,
  ZAR: 18.5,
  GHS: 15,
  KES: 130,
  AED: 3.67,
  SAR: 3.75,
  BRL: 5,
  MXN: 17,
  CHF: 0.88,
  SGD: 1.34,
  KRW: 1350,
  TRY: 32,
  IDR: 15500,
  PHP: 56
};


// ============================================
// BITCOIN NETWORK DATA
// ============================================

let bitcoinDifficulty = 113000000000000;

const blockReward = 3.125;

const blocksPerDay = 144;


// ============================================
// MINING MACHINE DATABASE
// ============================================

const miners = {

  custom: {
    hashrate: "",
    power: ""
  },

  s21: {
    hashrate: 200,
    power: 3500
  },

  s21xp: {
    hashrate: 270,
    power: 3645
  },

  s19xp: {
    hashrate: 140,
    power: 3010
  },

  s19pro: {
    hashrate: 110,
    power: 3250
  },

  m60: {
    hashrate: 186,
    power: 3441
  },

  m50: {
    hashrate: 114,
    power: 3306
  }

};


// ============================================
// SELECT MINING MACHINE
// ============================================

function selectMiner() {

  const miner = document.getElementById("miner");

  const hashrate = document.getElementById("hashrate");

  const power = document.getElementById("power");

  const selected = miner.value;


  if (selected === "custom") {

    hashrate.value = "";

    power.value = "";

    return;

  }


  if (miners[selected]) {

    hashrate.value = miners[selected].hashrate;

    power.value = miners[selected].power;

  }

}


// ============================================
// GET LIVE BITCOIN PRICE
// ============================================

async function getBitcoinPrice() {

  const button = document.getElementById("livePriceBtn");

  const priceInput = document.getElementById("bitcoinPrice");


  button.textContent = "Loading Live Bitcoin Price...";


  try {

    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );


    const data = await response.json();


    if (data.bitcoin && data.bitcoin.usd) {

      priceInput.value = data.bitcoin.usd;

      button.textContent = "Live Price Updated ✓";

    }

    else {

      throw new Error("Bitcoin price unavailable");

    }


  }

  catch (error) {

    console.log(error);

    button.textContent = "Price Update Failed";

  }


  setTimeout(function () {

    button.textContent = "Get Live Bitcoin Price";

  }, 3000);

}


// ============================================
// GET LIVE EXCHANGE RATES
// ============================================

async function getExchangeRates() {

  try {

    const response = await fetch(
      "https://open.er-api.com/v6/latest/USD"
    );


    const data = await response.json();


    if (data.result === "success") {

      exchangeRates = data.rates;

      console.log("Live exchange rates updated");

    }

  }

  catch (error) {

    console.log(
      "Using backup exchange rates"
    );

  }

}


// ============================================
// FORMAT CURRENCY
// ============================================

function formatCurrency(amount, currency) {

  const symbols = {

    USD: "$",
    NGN: "₦",
    GBP: "£",
    EUR: "€",
    CAD: "C$",
    AUD: "A$",
    JPY: "¥",
    CNY: "¥",
    INR: "₹",
    ZAR: "R",
    GHS: "₵",
    KES: "KSh",
    AED: "AED ",
    SAR: "SAR ",
    BRL: "R$",
    MXN: "MX$",
    CHF: "CHF ",
    SGD: "S$",
    KRW: "₩",
    TRY: "₺",
    IDR: "Rp",
    PHP: "₱"

  };


  const symbol = symbols[currency] || currency;


  const number = Number(amount).toLocaleString(
    undefined,
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );


  return symbol + number;

}


// ============================================
// CALCULATE MINING PROFIT
// ============================================

function calculateProfit() {


  // GET USER INPUT

  const hashrate = parseFloat(
    document.getElementById("hashrate").value
  );


  const power = parseFloat(
    document.getElementById("power").value
  );


  const electricity = parseFloat(
    document.getElementById("electricity").value
  );


  const bitcoinPrice = parseFloat(
    document.getElementById("bitcoinPrice").value
  );


  const poolFee = parseFloat(
    document.getElementById("poolFee").value
  ) || 0;


  const currency =
    document.getElementById("currency").value;


  // VALIDATION

  if (
    isNaN(hashrate) ||
    isNaN(power) ||
    isNaN(electricity) ||
    isNaN(bitcoinPrice)
  ) {

    alert(
      "Please fill in Hashrate, Power Usage, Electricity Cost and Bitcoin Price."
    );

    return;

  }


  // ============================================
  // BITCOIN MINING CALCULATION
  // ============================================


  // Convert TH/s to hashes per second

  const hashratePerSecond =
    hashrate * 1000000000000;


  const secondsPerDay = 86400;


  // Estimated BTC mined per day

  const btcPerDay =

    (hashratePerSecond *
      secondsPerDay *
      blockReward)

    /

    (bitcoinDifficulty *
      Math.pow(2, 32));


  // ============================================
  // DAILY REVENUE
  // ============================================

  let dailyRevenueUSD =

    btcPerDay *
    bitcoinPrice;


  // MINING POOL FEE

  const poolFeeAmount =

    dailyRevenueUSD *
    (poolFee / 100);


  dailyRevenueUSD =

    dailyRevenueUSD -
    poolFeeAmount;


  // ============================================
  // ELECTRICITY COST
  // ============================================

  const dailyElectricityUSD =

    (power / 1000) *
    24 *
    electricity;


  // ============================================
  // DAILY PROFIT
  // ============================================

  const dailyProfitUSD =

    dailyRevenueUSD -
    dailyElectricityUSD;


  const monthlyProfitUSD =

    dailyProfitUSD * 30;


  const yearlyProfitUSD =

    dailyProfitUSD * 365;


  // ============================================
  // CURRENCY CONVERSION
  // ============================================

  const rate =
    exchangeRates[currency] || 1;


  const dailyRevenue =
    dailyRevenueUSD * rate;


  const dailyElectricity =
    dailyElectricityUSD * rate;


  const dailyProfit =
    dailyProfitUSD * rate;


  const monthlyProfit =
    monthlyProfitUSD * rate;


  const yearlyProfit =
    yearlyProfitUSD * rate;


  // ============================================
  // DISPLAY RESULTS
  // ============================================

  document.getElementById("revenue").textContent =

    formatCurrency(
      dailyRevenue,
      currency
    );


  document.getElementById("electricityCost").textContent =

    formatCurrency(
      dailyElectricity,
      currency
    );


  document.getElementById("profit").textContent =

    formatCurrency(
      dailyProfit,
      currency
    );


  document.getElementById("monthlyProfit").textContent =

    formatCurrency(
      monthlyProfit,
      currency
    );


  document.getElementById("yearlyProfit").textContent =

    formatCurrency(
      yearlyProfit,
      currency
    );


  // ============================================
  // MINING STATUS
  // ============================================

  const status =
    document.getElementById("miningStatus");


  if (dailyProfit > 0) {

    status.textContent = "PROFITABLE";

    status.style.color = "#22c55e";

  }

  else if (dailyProfit < 0) {

    status.textContent = "NOT PROFITABLE";

    status.style.color = "#ef4444";

  }

  else {

    status.textContent = "BREAK EVEN";

    status.style.color = "#facc15";

  }


  // ============================================
  // UPDATE MINING SUMMARY
  // ============================================

  const miner =
    document.getElementById("miner");


  const minerName =

    miner.options[
      miner.selectedIndex
    ].text;


  document.getElementById("summaryMiner").textContent =

    minerName;


  document.getElementById("summaryHashrate").textContent =

    hashrate + " TH/s";


  document.getElementById("summaryPower").textContent =

    power + " W";


  document.getElementById("summaryCurrency").textContent =

    currency;


  // ============================================
  // UPDATE PROFIT CHART
  // ============================================

  updateChart(
    dailyProfit,
    monthlyProfit,
    yearlyProfit,
    currency
  );

}


// ============================================
// CREATE PROFIT CHART
// ============================================

function updateChart(

  dailyProfit,
  monthlyProfit,
  yearlyProfit,
  currency

) {


  const canvas =
    document.getElementById("profitChart");


  if (!canvas) return;


  const ctx =
    canvas.getContext("2d");


  // REMOVE OLD CHART

  if (profitChart) {

    profitChart.destroy();

  }


  profitChart = new Chart(ctx, {

    type: "bar",


    data: {

      labels: [

        "Daily Profit",
        "Monthly Profit",
        "Yearly Profit"

      ],


      datasets: [

        {

          label:
            "OIN Mining Profit (" +
            currency +
            ")",


          data: [

            dailyProfit,
            monthlyProfit,
            yearlyProfit

          ],


          backgroundColor: [

            "#f59e0b",
            "#2563eb",
            "#22c55e"

          ],


          borderRadius: 6

        }

      ]

    },


    options: {

      responsive: true,


      plugins: {

        legend: {

          labels: {

            color: "#ffffff"

          }

        }

      },


      scales: {

        x: {

          ticks: {

            color: "#ffffff"

          }

        },


        y: {

          ticks: {

            color: "#ffffff"

          }

        }

      }

    }

  });

}


// ============================================
// RESET CALCULATOR
// ============================================

function resetCalculator() {


  document.getElementById("miner").value =
    "custom";


  document.getElementById("hashrate").value =
    "";


  document.getElementById("power").value =
    "";


  document.getElementById("electricity").value =
    "";


  document.getElementById("poolFee").value =
    "2";


  document.getElementById("bitcoinPrice").value =
    "";


  document.getElementById("currency").value =
    "USD";


  // RESET RESULTS

  document.getElementById("revenue").textContent =
    "$0";


  document.getElementById("electricityCost").textContent =
    "$0";


  document.getElementById("profit").textContent =
    "$0";


  document.getElementById("monthlyProfit").textContent =
    "$0";


  document.getElementById("yearlyProfit").textContent =
    "$0";


  // RESET STATUS

  const status =
    document.getElementById("miningStatus");


  status.textContent =
    "Calculate to See Status";


  status.style.color =
    "white";


  // RESET SUMMARY

  document.getElementById("summaryMiner").textContent =
    "Custom Input";


  document.getElementById("summaryHashrate").textContent =
    "0 TH/s";


  document.getElementById("summaryPower").textContent =
    "0 W";


  document.getElementById("summaryCurrency").textContent =
    "USD";


  // REMOVE CHART

  if (profitChart) {

    profitChart.destroy();

    profitChart = null;

  }

}


// ============================================
// DOWNLOAD PDF MINING REPORT
// ============================================

function downloadReport() {


  // CHECK PDF LIBRARY

  if (!window.jspdf) {

    alert(
      "PDF library is still loading. Please refresh and try again."
    );

    return;

  }


  const { jsPDF } = window.jspdf;


  const doc = new jsPDF();


  // ============================================
  // GET CALCULATOR DATA
  // ============================================

  const minerSelect =
    document.getElementById("miner");


  const machine =

    minerSelect.options[
      minerSelect.selectedIndex
    ].text;


  const hashrate =
    document.getElementById("hashrate").value || "0";


  const power =
    document.getElementById("power").value || "0";


  const electricity =
    document.getElementById("electricity").value || "0";


  const bitcoinPrice =
    document.getElementById("bitcoinPrice").value || "0";


  const currencySelect =
    document.getElementById("currency");


  const currency =

    currencySelect.options[
      currencySelect.selectedIndex
    ].text;


  const dailyRevenue =
    document.getElementById("revenue").textContent;


  const electricityCost =
    document.getElementById("electricityCost").textContent;


  const dailyProfit =
    document.getElementById("profit").textContent;


  const monthlyProfit =
    document.getElementById("monthlyProfit").textContent;


  const yearlyProfit =
    document.getElementById("yearlyProfit").textContent;


  const status =
    document.getElementById("miningStatus").textContent;


  const date =
    new Date().toLocaleString();


  // ============================================
  // PDF HEADER
  // ============================================

  doc.setFillColor(
    20,
    30,
    50
  );


  doc.rect(
    0,
    0,
    210,
    45,
    "F"
  );


  doc.setTextColor(
    255,
    255,
    255
  );


  doc.setFontSize(26);


  doc.text(
    "OINANCE",
    105,
    18,
    {
      align: "center"
    }
  );


  doc.setFontSize(12);


  doc.text(
    "Bitcoin Mining Profitability Report",
    105,
    28,
    {
      align: "center"
    }
  );


  doc.setFontSize(9);


  doc.text(
    "Powered by OinanceLink Technology",
    105,
    36,
    {
      align: "center"
    }
  );


  // ============================================
  // REPORT DATE
  // ============================================

  doc.setTextColor(
    40,
    40,
    40
  );


  doc.setFontSize(10);


  doc.text(
    "Report Date: " + date,
    15,
    55
  );


  // ============================================
  // MINING MACHINE SECTION
  // ============================================

  doc.setFillColor(
    230,
    230,
    230
  );


  doc.rect(
    15,
    62,
    180,
    8,
    "F"
  );


  doc.setFontSize(12);


  doc.text(
    "MINING MACHINE INFORMATION",
    18,
    68
  );


  let y = 78;


  const machineInfo = [

    ["Mining Machine:", machine],

    ["Hashrate:", hashrate + " TH/s"],

    ["Power Usage:", power + " Watts"],

    ["Electricity Cost:", electricity],

    ["Bitcoin Price:", bitcoinPrice],

    ["Currency:", currency]

  ];


  doc.setFontSize(10);


  machineInfo.forEach(function(item) {


    doc.setFont(
      "helvetica",
      "bold"
    );


    doc.text(
      item[0],
      20,
      y
    );


    doc.setFont(
      "helvetica",
      "normal"
    );


    doc.text(
      String(item[1]),
      80,
      y
    );


    y += 9;

  });


  // ============================================
  // PROFIT RESULTS
  // ============================================

  y += 5;


  doc.setFillColor(
    230,
    230,
    230
  );


  doc.rect(
    15,
    y,
    180,
    8,
    "F"
  );


  doc.setFontSize(12);


  doc.text(
    "MINING PROFIT RESULTS",
    18,
    y + 6
  );


  y += 18;


  const profitInfo = [

    ["Estimated Daily Revenue:", dailyRevenue],

    ["Daily Electricity Cost:", electricityCost],

    ["Estimated Daily Profit:", dailyProfit],

    ["Estimated Monthly Profit:", monthlyProfit],

    ["Estimated Yearly Profit:", yearlyProfit]

  ];


  doc.setFontSize(10);


  profitInfo.forEach(function(item) {


    doc.setFont(
      "helvetica",
      "bold"
    );


    doc.text(
      item[0],
      20,
      y
    );


    doc.setFont(
      "helvetica",
      "normal"
    );


    doc.text(
      String(item[1]),
      95,
      y
    );


    y += 9;

  });


  // ============================================
  // MINING STATUS
  // ============================================

  y += 5;


  doc.setFillColor(
    230,
    230,
    230
  );


  doc.rect(
    15,
    y,
    180,
    8,
    "F"
  );


  doc.setTextColor(
    30,
    30,
    30
  );


  doc.setFontSize(12);


  doc.text(
    "MINING STATUS",
    18,
    y + 6
  );


  y += 18;


  doc.setFontSize(14);


  if (
    status.includes("PROFITABLE") &&
    !status.includes("NOT")
  ) {

    doc.setTextColor(
      30,
      150,
      70
    );

  }

  else {

    doc.setTextColor(
      200,
      50,
      50
    );

  }


  doc.text(
    status,
    105,
    y,
    {
      align: "center"
    }
  );


  // ============================================
  // FOOTER
  // ============================================

  doc.setTextColor(
    100,
    100,
    100
  );


  doc.setFontSize(8);


  doc.text(
    "OINANCE | OIN Bitcoin Mining Calculator",
    105,
    280,
    {
      align: "center"
    }
  );


  doc.text(
    "Powered by OinanceLink Technology",
    105,
    286,
    {
      align: "center"
    }
  );


  // ============================================
  // DOWNLOAD PDF
  // ============================================

  doc.save(
    "OINANCE-Mining-Report.pdf"
  );

}


// ============================================
// START APPLICATION
// ============================================

getExchangeRates();