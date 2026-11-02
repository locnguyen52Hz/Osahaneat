import { http, HttpResponse } from "msw/http";
import { delay } from "msw/utils/delay";
import endpoints from "../api/endpoints";

const ACTIVE_SCENARIO = "server-error";

const SEND_MESSAGE_URL = endpoints.messages.send;

export const handlers = [
  http.post(SEND_MESSAGE_URL, async ({ request }) => {
    console.log("[MSW] Intercepted request:", await request.clone().json());

    switch (ACTIVE_SCENARIO) {
      case "bad-request":
        return HttpResponse.json(
          { message: "Invalid message content" },
          { status: 400 },
        );

      case "network-error":
        return HttpResponse.error();

      case "slow":
        await delay(10_000);

        return HttpResponse.json({ message: "Late response" }, { status: 500 });

      case "server-error":
      default:
        return HttpResponse.json(
          { message: "Simulated Internal Server Error" },
          { status: 500 },
        );
    }
  }),
];
