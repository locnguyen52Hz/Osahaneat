import { http, HttpResponse } from "msw/http";
import { delay } from "msw/utils/delay";
import endpoints from "../api/endpoints";

const ACTIVE_SCENARIO = "SERVER_ERROR";

const SEND_MESSAGE_URL = endpoints.messages.send;

export const handlers = [
  // http.post(SEND_MESSAGE_URL, async ({ request }) => {
  //   // console.log("[MSW] Intercepted request:", await request.clone().json());

  //   switch (ACTIVE_SCENARIO) {
  //     case "BAD_REQUEST":
  //       return HttpResponse.json(
  //         { message: "Invalid message content" },
  //         { status: 400 },
  //       );

  //     case "NETWORK_ERROR":
  //       return HttpResponse.error();

  //     case "SLOW":
  //       await delay(10_000);

  //       return HttpResponse.json({ message: "Late response" }, { status: 500 });

  //     case "SERVER_ERROR":
  //     default:
  //       return HttpResponse.json(
  //         { message: "Simulated Internal Server Error" },
  //         { status: 500 },
  //       );
  //   }
  // }),
];
