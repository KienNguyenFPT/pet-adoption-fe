import { Event } from "../types/event";
import { Response } from "../types/common";

export const getAllEvents = async (): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Event/GetAllEvents`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};

export const getEventsByUser = async (userId: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Event/GetUserThatHasBeenEnrolled/Get/${userId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  return response.json();
};
export const addEvent = async (
  event: Omit<Event, "images">
): Promise<Event> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Event/CreateEvent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        id: event.id,
        startDate: event.startDate,
        endDate: event.endDate,
        eventName: event.eventName,
        description: event.description,
        eventStatus: event.eventStatus,
        eventType: event.eventType,
        location: event.location,
      }),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to add event");
  }
  return response.json();
};

export const getEventById = async (id: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Event/GetEventById/${id}`,
    {
      method: "GET",
      headers: {},
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get event");
  }
  return response.json();
};

export const updateEvent = async (
  event: Omit<Event, "images">
): Promise<Event> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Event/UpdateEvent`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          id: event.id,
          startDate: event.startDate,
          endDate: event.endDate,
          eventName: event.eventName,
          description: event.description,
          eventStatus: event.eventStatus,
          eventType: event.eventType,
          location: event.location,
        }),
      }
    );
    console.log(response);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to update event:", errorText);
      throw new Error("Failed to update event");
    }
    return response.json();
  } catch (error) {
    console.error("Error in updateEvent:", error);
    throw error;
  }
};
export const deleteEvent = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Event/DeleteEvent/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
};

export const deleteEventImage = async (
  idEvent: string,
  idPhoto: string
): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/EventImages/DeleteEventPhoto/Delete/${idEvent}?photoId=${idPhoto}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete photo");
  }
};
export const addEventImage = async (
  eventId: string,
  file: File
): Promise<Response> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/EventImages/AddPhotoForEvent/${eventId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to add event image");
  }
  return response.json();
};

export const userEnrollEvent = async (eventId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/Event/UserEnrollEvent/enroll/${eventId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  if (response.ok) {
    return response.json();
  } else {
    return {
      success: false,
      message: response.text(),
      error: true,
      errorMessages: "Failed to enroll in event",
    };
  }
};

export const getAllEventImages = async (eventId: string): Promise<Response> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_GATEWAY}/api/EventImages/GetEventImages/GetEventImages/${eventId}`,
    {
      method: "GET",
      headers: {
        // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load event images");
  }
  return response.json();
};
