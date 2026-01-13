
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = dotenv.parse(fs.readFileSync(envPath));
        for (const k in envConfig) process.env[k] = envConfig[k];
    }
} catch (e) {
    console.log("Could not load local env");
}

async function bulkSeed() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        console.error("Missing standard Supabase environment variables.");
        process.exit(1);
    }
    const supabase = createClient(url, key);

    console.log("🚀 Starting Bulk Seed (~1000 Tickers)...");

    const sectors = ['Technology', 'Healthcare', 'Energy', 'Real Estate', 'Financials'];
    const fakeData = [];

    // Generate 1000 fake tickers for testing pagination
    for (let i = 0; i < 1000; i++) {
        const char1 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const char2 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const char3 = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        const sym = `TEST${char1}${char2}${char3}${i}`; // e.g. TESTABC1

        fakeData.push({
            symbol: sym,
            name: `Test Comp ${sym}`,
            exchange: 'NASDAQ',
            type: 'stock',
            sector: sectors[Math.floor(Math.random() * sectors.length)]
        });
    }

    // Bulk Insert (chunks of 100)
    for (let i = 0; i < fakeData.length; i += 100) {
        const chunk = fakeData.slice(i, i + 100);
        const { error } = await supabase.from('tickers').upsert(chunk, { onConflict: 'symbol' });
        if (error) console.error("Error inserting chunk:", error.message);
        else console.log(`Inserted chunk ${i / 100 + 1}`);
    }

    console.log("✅ Bulk Seed Complete");
}

bulkSeed();
