import { prisma } from './prisma';

const COMMUNITIES = [
  "Kwali Central", "Bako", "Bukpe", "Dafa", "Gumbo", 
  "Kigbe", "Kilankwa", "Pai", "Sheda", "Wako", 
  "Yangoji", "Yebu", "Koroko", "Giri", "Awawa"
];

const BARRIERS = ["distance", "cost", "distrust", "forgetfulness", "cultural preference"];

// Seeds Terminals, Households, and Admin users if they don't exist
export async function seedSimulation() {
  const terminalCount = await prisma.terminal.count();
  
  if (terminalCount === 0) {
    console.log("Seeding simulation data...");
    
    // 1. Create an Admin and Panel user
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      await prisma.user.create({
        data: {
          email: "admin@kwali.gov.ng",
          password_hash: "password", // In a real app, hash this!
          role: "ADMIN"
        }
      });

      await prisma.user.create({
        data: {
          email: "panel@kwali.gov.ng",
          password_hash: "password",
          role: "PANEL"
        }
      });
    }

    // 2. Create 15 Terminals and their associated Stewards and Households
    for (const community of COMMUNITIES) {
      const terminal = await prisma.terminal.create({
        data: {
          community_name: community,
          latitude: 8 + Math.random(),
          longitude: 7 + Math.random()
        }
      });

      // Create a Steward User
      const stewardUser = await prisma.user.create({
        data: {
          email: `steward.${community.toLowerCase().replace(' ', '')}@kwali.gov.ng`,
          password_hash: "password",
          role: "STEWARD"
        }
      });

      // Create Steward Record
      await prisma.steward.create({
        data: {
          name: `${community} Steward`,
          userId: stewardUser.id,
          terminalId: terminal.id,
          status: "ACTIVE",
          eligibility_checklist_completed: true
        }
      });

      // Create 5-10 Households per community
      const numHouseholds = Math.floor(Math.random() * 6) + 5;
      for (let i = 0; i < numHouseholds; i++) {
        const hasConsent = Math.random() > 0.3; // 70% consent rate
        const household = await prisma.household.create({
          data: {
            community_name: community,
            stated_barrier: BARRIERS[Math.floor(Math.random() * BARRIERS.length)],
            consent_logged: hasConsent,
            terminalId: terminal.id
          }
        });

        if (hasConsent) {
          await prisma.householdContact.create({
            data: {
              householdId: household.id,
              phone_number: `+234${Math.floor(Math.random() * 9000000000)}`
            }
          });
        }
      }
    }
    console.log("Seeding complete.");
  }
}

// Generate one tick (e.g. 1 day) of data for all terminals
export async function simulateTick(dateOverride?: Date) {
  const terminals = await prisma.terminal.findMany({ include: { stewards: true } });
  const timestamp = dateOverride || new Date();

  for (const terminal of terminals) {
    // Determine pump status probabilistically
    const rand = Math.random();
    let pump_status = "OPERATIONAL";
    if (rand > 0.95) pump_status = "BROKEN";
    else if (rand > 0.85) pump_status = "DEGRADED";

    const flow_rate = pump_status === "BROKEN" ? 0 : (pump_status === "DEGRADED" ? Math.random() * 5 + 2 : Math.random() * 10 + 10);
    const water_quality = Math.random() > 0.9 ? "FAIL" : "PASS"; // 10% chance of bad quality
    const energy_use = pump_status === "BROKEN" ? 0 : flow_rate * 2.5;

    await prisma.sensorReading.create({
      data: {
        terminalId: terminal.id,
        timestamp,
        flow_rate,
        water_quality,
        energy_use,
        pump_status
      }
    });

    // Steward Activity (only if they have a steward)
    if (terminal.stewards.length > 0) {
      const steward = terminal.stewards[0];
      const transactions = pump_status === "BROKEN" ? 0 : Math.floor(Math.random() * 50) + 10;
      const revenue = transactions * 50; // 50 Naira per transaction
      
      let issue = null;
      if (pump_status === "BROKEN") issue = "Pump is not dispensing water";
      else if (water_quality === "FAIL") issue = "Water looks cloudy";
      else if (Math.random() > 0.9) issue = "Long queues today";

      await prisma.stewardActivity.create({
        data: {
          stewardId: steward.id,
          terminalId: terminal.id,
          timestamp,
          transactions_count: transactions,
          revenue,
          reported_issue: issue
        }
      });
    }
  }
}

// Generate historical time series
export async function runBackfill(days: number) {
  await seedSimulation();
  
  const today = new Date();
  
  // Create ticks going backwards from yesterday
  for (let i = days; i >= 1; i--) {
    const tickDate = new Date(today);
    tickDate.setDate(today.getDate() - i);
    await simulateTick(tickDate);
  }
  
  // And one for today
  await simulateTick(today);
}
