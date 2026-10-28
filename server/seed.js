import { destinations } from "./seed-data/destinations.js";
import { testimonials } from "./seed-data/testimonials.js";

export async function seed(pool) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const [position, item] of destinations.entries()) {
      const { dates, ...data } = item;
      await client.query(
        "INSERT INTO destinations(id,data,price,duration) VALUES($1,$2,$3,$4) ON CONFLICT(id) DO UPDATE SET data=$2,price=$3,duration=$4",
        [
          item.id,
          JSON.stringify({ ...data, position }),
          item.price,
          item.duration,
        ],
      );
      // Keep the original dates and add next year's sample departures for the demo catalog.
      for (const date of [
        ...dates,
        ...dates.map(
          (date) => `${new Date().getUTCFullYear() + 1}${date.slice(4)}`,
        ),
      ]) {
        await client.query(
          "INSERT INTO departures VALUES($1,$2) ON CONFLICT DO NOTHING",
          [item.id, date],
        );
      }
    }
    for (const [index, item] of testimonials.entries()) {
      await client.query(
        "INSERT INTO reviews(id,name,quote,rating,trip,editorial) VALUES($1,$2,$3,$4,$5,true) ON CONFLICT DO NOTHING",
        [`editorial-${index}`, item.name, item.quote, item.rating, item.trip],
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
