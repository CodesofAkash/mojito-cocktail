export type MaintenanceData = {
  enabled?: boolean | null;
  heading?: string | null;
  message?: string | null;
} | null;

export function Maintenance({ data }: { data: MaintenanceData }) {
  return (
    <main className="standalone-page noisy">
      <h1>{data?.heading}</h1>
      {data?.message && <p>{data.message}</p>}
    </main>
  );
}
