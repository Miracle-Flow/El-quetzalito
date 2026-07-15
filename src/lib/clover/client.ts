export interface CloverPrinter {
  id: string;
  name: string;
}

export type CloverPrintJobState = "CREATED" | "PRINTING" | "FAILED" | "DONE" | "UNKNOWN";

export interface CloverPrintResult {
  ok: boolean;
  status: number;
  jobId?: string;
  error?: string;
}

export interface CloverDeviceCall {
  deviceSerial: string;
}

export interface CloverPrintTextInput extends CloverDeviceCall {
  printerId: string;
  text: string[];
  idempotencyKey: string;
}

export interface CloverPrintImageInput extends CloverDeviceCall {
  printerId: string;
  base64Png: string;
  idempotencyKey: string;
}

export interface CloverConfig {
  baseUrl: string;
  posId: string;
  getAccessToken: () => Promise<string>;
}

export interface CloverClient {
  listPrinters: (input: CloverDeviceCall) => Promise<CloverPrinter[]>;
  printText: (input: CloverPrintTextInput) => Promise<CloverPrintResult>;
  printImage: (input: CloverPrintImageInput) => Promise<CloverPrintResult>;
  getPrintJobStatus: (
    input: CloverDeviceCall & { jobId: string },
  ) => Promise<{ state: CloverPrintJobState }>;
}

const PRINTERS_PATH = "/connect/v1/device/printers";
const PRINT_PATH = "/connect/v1/device/print";
const PRINT_JOB_STATUS_PATH = "/connect/v1/device/print/jobs";

export function createHttpCloverClient(config: CloverConfig): CloverClient {
  const baseHeaders = async (deviceSerial: string) => ({
    Authorization: `Bearer ${await config.getAccessToken()}`,
    "Content-Type": "application/json",
    "X-Clover-Device-Id": deviceSerial,
    "X-POS-Id": config.posId,
  });

  return {
    async listPrinters({ deviceSerial }) {
      const response = await fetch(`${config.baseUrl}${PRINTERS_PATH}`, {
        method: "POST",
        headers: await baseHeaders(deviceSerial),
      });

      const data = (await safeJson(response)) as { printers?: CloverPrinter[] } | null;
      return data?.printers ?? [];
    },

    async printText({ deviceSerial, printerId, text, idempotencyKey }) {
      const response = await fetch(`${config.baseUrl}${PRINT_PATH}`, {
        method: "POST",
        headers: {
          ...(await baseHeaders(deviceSerial)),
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ printDeviceId: printerId, text }),
      });

      return toPrintResult(response);
    },

    async printImage({ deviceSerial, printerId, base64Png, idempotencyKey }) {
      const response = await fetch(`${config.baseUrl}${PRINT_PATH}`, {
        method: "POST",
        headers: {
          ...(await baseHeaders(deviceSerial)),
          "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify({ printDeviceId: printerId, image: base64Png }),
      });

      return toPrintResult(response);
    },

    async getPrintJobStatus({ deviceSerial, jobId }) {
      const response = await fetch(`${config.baseUrl}${PRINT_JOB_STATUS_PATH}/${jobId}`, {
        headers: await baseHeaders(deviceSerial),
      });

      const data = (await safeJson(response)) as { state?: string } | null;
      return { state: toPrintJobState(data?.state) };
    },
  };
}

export function createLoggingCloverClient(): CloverClient {
  return {
    async listPrinters({ deviceSerial }) {
      console.info(`[clover stub] listPrinters device=${deviceSerial}`);
      return [{ id: "stub-printer", name: "Clover printer (stub)" }];
    },

    async printText({ deviceSerial, printerId, text, idempotencyKey }) {
      console.info(
        `[clover stub] printText device=${deviceSerial} printer=${printerId} key=${idempotencyKey}`,
        text,
      );
      return { ok: true, status: 200, jobId: `stub-${idempotencyKey}` };
    },

    async printImage({ deviceSerial, printerId, idempotencyKey }) {
      console.info(
        `[clover stub] printImage device=${deviceSerial} printer=${printerId} key=${idempotencyKey}`,
      );
      return { ok: true, status: 200, jobId: `stub-${idempotencyKey}` };
    },

    async getPrintJobStatus({ jobId }) {
      console.info(`[clover stub] getPrintJobStatus job=${jobId}`);
      return { state: "DONE" as const };
    },
  };
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function toPrintResult(response: Response): Promise<CloverPrintResult> {
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      error: await response.text().catch(() => response.statusText),
    };
  }

  const data = (await safeJson(response)) as { id?: string; jobId?: string } | null;
  return {
    ok: true,
    status: response.status,
    jobId: data?.id ?? data?.jobId,
  };
}

function toPrintJobState(value: string | undefined): CloverPrintJobState {
  if (value === "CREATED" || value === "PRINTING" || value === "FAILED") {
    return value;
  }
  return "UNKNOWN";
}
