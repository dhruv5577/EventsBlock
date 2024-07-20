// export async function fetchEvents({signal,searchterm}) {

//   let url = 'http://localhost:3000/events';

//   if (searchterm) {
//     url += '?search=' + searchterm;
//   }

//   const response = await fetch(url, { signal: signal });

//   if (!response.ok) {
//     const error = new Error('An error occurred while fetching the events');
//     error.code = response.status;
//     error.info = await response.json();
//     throw error;
//   }

//   const { events } = await response.json();

//   return events;
// }


export async function fetchEvents({ signal, searchTerm }) {
  console.log(searchTerm);
  let url = 'http://localhost:3000/events';

  if (searchTerm) {
    url += '?search=' + searchTerm;
  }

  const response = await fetch(url, { signal: signal });

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}


