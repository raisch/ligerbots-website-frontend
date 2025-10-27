export const GET_EVENTS = `
  query {
    event {
      id
      status
      start_date
      end_date
      name
      location
      publish_on
      auto_publish
      description
    }
  }
`;
