import { prisma } from '@/lib/prisma';
import MapWrapper from '@/components/MapWrapper';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let terminals: any[] = [];
  try {
    terminals = await prisma.terminal.findMany({
      include: {
        stewards: true,
        sensorReadings: {
          orderBy: { timestamp: 'desc' },
          take: 14 // Get history for sparklines
        },
        stewardActivities: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      }
    });
  } catch (err) {
    console.error('Prisma error (map):', err);
    return (
      <div className="p-8">
        <h2 className="text-xl font-bold">Service unavailable</h2>
        <p className="text-sm text-slate-600 mt-2">Database is not configured in this environment. Configure `DATABASE_URL` or enable the SQLite adapter to view this page.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative bg-[#0B0C10]">
      {/* Immersive full-bleed map */}
      <MapWrapper terminals={terminals} />
    </div>
  );
}
