import { prisma } from '@/lib/prisma';
import MapWrapper from '@/components/MapWrapper';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const terminals = await prisma.terminal.findMany({
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

  return (
    <div className="h-full w-full relative bg-[#0B0C10]">
      {/* Immersive full-bleed map */}
      <MapWrapper terminals={terminals} />
    </div>
  );
}
