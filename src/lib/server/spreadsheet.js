import ExcelJS from "exceljs"
import Event from "./event"
import { prettyDate, prettyTime } from "$lib/util";
import trip from "./graphql/trip";
import { start } from "repl";

export const XLSX_MIME_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
const RIDE_NAME_HIGHLIGHT_COLOR = 'FFFFAF5F';
const DRIVER_HIGHLIGHT_COLOR = 'FF7FBFFF';
const RIDER_HIGHLIGHT_COLOR = 'FFBFDFFF';
const WARNING_HIGHLIGHT_COLOR = 'FFFF7F7F'

/**
 * @param {string} eventId
 */
export async function createCarpoolSheet(eventId) {
  let data = await getRiderListData(eventId);
  if (data instanceof Response) {
    console.error('Error generating rider list plain text:', data);
    return data;
  }
  let { name, timeRange, location, trips } = data;
  
  const workbook = new ExcelJS.Workbook();
  workbook.lastModifiedBy = workbook.creator = 'LigerBots Carpool System: Auto-Generated Spreadsheet';
  workbook.modified = workbook.created = new Date();

  const sheet = workbook.addWorksheet('Riders', {
    pageSetup: { orientation: 'landscape' },
    properties: { defaultColWidth: 25 }
  });

  sheet.getColumn(1).width = 2; // Spacer and headers

  sheet.getCell('A1').value = {
    richText: [
      { text: name || 'Carpool Event', font: { bold: true, size: 16 } }
    ]
  }
  sheet.getCell('A2').value = {
    richText: [
      { text: timeRange || '', font: { bold: true, italic: true, size: 12 } }
    ]
  }
  sheet.getCell('A3').value = {
    richText: [
      { text: location || '', font: { bold: true, italic: true, size: 12 } }
    ]
  }

  let totalRows = 3;

  for (let i = 0; i < trips.length; i++) {
    const trip = trips[i];
    const { rows, totalRows: newTotalRows } = createRows(trip, totalRows + 1);
    Object.entries(rows).forEach(([rowId, cells]) => {
      const row = sheet.getRow(Number(rowId));
      cells.forEach((data, index) => {
        console.log(data, rowId, index + 1)
        const cell = row.getCell(index + 1);
        let font, color;
        switch (data.type) {
          case 'trip':
            font = { bold: true, size: 14 };
            break;
          case 'ride':
            font = { bold: true, size: 12, family: 3, name: 'Consolas' };
            color = RIDE_NAME_HIGHLIGHT_COLOR;
            break;
          case 'driver':
            font = { family: 3, name: 'Consolas' };
            color = DRIVER_HIGHLIGHT_COLOR;
            break;
          case 'rider':
            font = { family: 3, name: 'Consolas' };
            color = RIDER_HIGHLIGHT_COLOR;
            break;
          case 'rider.warning':
            font = { family: 3, name: 'Consolas' };
            color = WARNING_HIGHLIGHT_COLOR;
            break;
          case 'empty':
            font = { family: 3, name: 'Consolas', italic: true };
            break;
          case 'none':
            font = { family: 3, name: 'Consolas' };
            break;
        }
        cell.value = data.text;
        if (font) cell.font = font;
        if (color) cell.style.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
        if (data.type === 'none') cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
    });
    totalRows = newTotalRows;
  }
  
  const file = await workbook.xlsx.writeBuffer().catch(err => {
    console.error('Error generating rider list spreadsheet buffer:', err);
    return new Response(`Could not create spreadsheet for event: Error generating spreadsheet file buffer`, { status: 500 });
  }).then(buffer => {
    if (buffer instanceof Response) return buffer;
    return new File([buffer], `${data.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'carpool'}.xlsx`, { type: XLSX_MIME_TYPE });
  });

  return file;
}

/**
 * @param {string} eventId
 */
async function getRiderListData(eventId) {
  let event;
  try {
    event = await Event.getEventById(eventId);
  } catch (error) {
    return new Response('Could not create spreadsheet for event: Error retrieving event data', { status: 500 });
  }

  if (!event) {
    return new Response('Could not create spreadsheet for event: Event not found', { status: 404 });
  }

  return {
    name: event.name || 'Carpool Event',
    timeRange: `${prettyDate(event.start_date)} to ${prettyDate(event.end_date)}`,
    location: event.location,
    trips: event.trips?.sort(
      (a, b) => a.item.departs_on.localeCompare(b.item.departs_on)
    ).map((/** @type {import("./trip").TripType} */ { item: { departs_from, destination, departs_on, departs_at, arrives_at, rides } }) => {
      let max = 0;
      let tripData = {
        location: `${departs_from} to ${destination}`,
        timeRange: `${prettyDate(departs_on)} from ${prettyTime(`${departs_on} ${departs_at}`)} to ${prettyTime(`${departs_on} ${arrives_at}`)}`,
        rides: rides.map(({ item: { ride: { name, driver, seats }, riders } }) => {
          let totalSize = seats + driver.length;
          if (totalSize > max) max = totalSize;
          return {
            name,
            riders: driver.map(d => ({ ...d, item: d.item || { firstname: '', lastname: '' } })).map(({ item: { firstname, lastname } }) => ({
              name: `${firstname} ${lastname}`,
              driver: true
            })).concat(riders.map(r => ({ ...r, item: r.item || { firstname: '', lastname: '' } })).map(({ item: { firstname, lastname } }) => ({
              name: `${firstname} ${lastname}`,
              driver: false
            }))),
            seats: riders.length,
            totalSeats: totalSize,
            maxSeats: seats,
            totalMaxSeats: seats + driver.length
          }
        }),
        maxSize: 0
      };
      tripData.maxSize = max;
      return tripData;
    }) || []
  };
}


const MAX_RIDE_COLUMN_SIZE = 20;

/**
 * @typedef {Exclude<Awaited<ReturnType<typeof getRiderListData>>, Response>} EventData
 * @typedef {EventData['trips'][number]} TripData
 * @typedef {TripData['rides'][number]} RideData
 * @typedef {RideData['riders'][number]} RiderData
 */

/**
 * @param {TripData} data
 * @param {number} startRow
 */
function createRows({ location, maxSize, rides, timeRange }, startRow) {
  let ridePages = rides.map(({ name, riders, seats, maxSeats }) => {
    if (seats < maxSeats) riders.push(...Array.from({ length: maxSeats - seats }, () => ({ name: '', driver: false })));
    let count = Math.max(maxSeats, seats);
    let pages = [riders.slice(0, MAX_RIDE_COLUMN_SIZE)];
    let pageId = 0;
    console.log(`Ride "${name}" has ${seats} riders (max ${maxSeats})`);
    console.log(count, pages.at(-1))
    while (count > MAX_RIDE_COLUMN_SIZE) {
      pageId++;
      pages.push(riders.slice(pageId * MAX_RIDE_COLUMN_SIZE, (pageId + 1) * MAX_RIDE_COLUMN_SIZE));
      count -= MAX_RIDE_COLUMN_SIZE;
      console.log(count, pages.at(-1))
    }
    return pages.map((page, i) => ({ name: i === 0 ? `${name} [${maxSeats}${seats > maxSeats ? '!' + seats : ''}]` : '', riders: page, count: page.length }));
  }).flat();
  let maxPageSize = Math.max(...ridePages.map(p => p.count), 0);

  /** @type {Record<number, { text: string, type: string }[]>} */
  const rows = {
    [startRow]: [{ text: '', type: 'none' }], // Spacer
    [startRow + 1]: [{ text: `${location} - ${timeRange}`, type: 'trip' }],
    [startRow + 2]: [{ text: '>', type: 'none' }].concat(ridePages.map(({ name }) => ({ text: name, type: 'ride' })))
  };

  if (maxPageSize === 0) {
    rows[startRow + 2].push({ text: 'no rides', type: 'empty' })
  }
  
  for (let i = 0; i < maxPageSize; i++) {
    let rowId = i + startRow + 3;
    rows[rowId] = [{ text: '|', type: 'none' }];
    ridePages.forEach(({ riders, count }) => {
      console.log(riders[i], count, i)
      if (count > i)
        rows[rowId].push({ text: riders[i].name || '', type: riders[i].driver ? 'driver' : 'rider' });
    })
  }

  return { rows, totalRows: startRow + 3 + maxPageSize };
}