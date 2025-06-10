import jwt from 'jsonwebtoken';

export async function load({
  request, locals, cookies, params,
}) {
  const some_cookie = cookies.get('operator_token');


  let bookingSendBookingInvitations = false;
  let bookingConfirmDeclinePerformers = false;
  let bookingSendAvailsRequests = false;

  if (some_cookie) {
    try {
      const decoded = jwt.decode(some_cookie);
      bookingSendBookingInvitations = decoded.booking_send_booking_invitations || false;
      bookingConfirmDeclinePerformers = decoded.booking_confirm_decline_performers || false;
      bookingSendAvailsRequests = decoded.booking_send_avails_requests || false;
    } catch (error) {
      console.error('Failed to decode JWT:', error);
    }
  }

  return {
    token: some_cookie,
    venueID: params.venueID,
    eventID: params.eventID,
    bookingSendBookingInvitations,
    bookingConfirmDeclinePerformers,
    bookingSendAvailsRequests,
  };
}