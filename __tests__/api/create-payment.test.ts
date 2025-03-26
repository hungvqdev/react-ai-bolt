import { POST } from "@/app/api/create-payment/route";
import { NextRequest } from "next/server";
import axios from "axios";
import { generateSignature } from "@/utils/generateSignature";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock generateSignature
jest.mock("@/utils/generateSignature", () => ({
  generateSignature: jest.fn(),
}));

describe("API Create Payment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PAYOS_API_KEY = "PAYOS_API_KEY";
    process.env.PAYOS_CLIENT_ID = "PAYOS_CLIENT_ID";
    process.env.PAYOS_CHECKSUM_KEY = "PAYOS_CHECKSUM_KEY";
    process.env.NEXT_PUBLIC_BASE_URL = "http://localhost:3000";
  });

  it("Lỗi 400 khi thiếu dữ liệu bắt buộc", async () => {
    const req = new NextRequest("http://localhost:3000/api/create-payment", {
      method: "POST",
      body: JSON.stringify({
        amount: undefined,
        orderCode: undefined,
        description: undefined,
      }),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.status).toBe(400);
    expect(json).toEqual({ status: 400, message: "Thiếu dữ liệu bắt buộc!" });
  });

  it("Lỗi 500 khi thiếu API Key, Client ID hoặc Checksum Key", async () => {
    const keysToTest = [
      "PAYOS_API_KEY",
      "PAYOS_CLIENT_ID",
      "PAYOS_CHECKSUM_KEY",
    ];

    for (const key of keysToTest) {
      // Reset environment variables trước mỗi lần kiểm tra
      process.env.PAYOS_API_KEY = "PAYOS_API_KEY";
      process.env.PAYOS_CLIENT_ID = "PAYOS_CLIENT_ID";
      process.env.PAYOS_CHECKSUM_KEY = "PAYOS_CHECKSUM_KEY";

      // Xóa key cần kiểm tra
      delete process.env[key];

      const req = new NextRequest("http://localhost:3000/api/create-payment", {
        method: "POST",
        body: JSON.stringify({
          amount: 100000,
          orderCode: "123",
          description: "Thanh toán đơn hàng",
        }),
      });

      const response = await POST(req);
      const json = await response.json();

      expect(response.status).toBe(500);
      expect(json.status).toBe(500);
      expect(json).toEqual({
        status: 500,
        message: "Thiếu API Key, Client ID hoặc Checksum Key!",
      });
    }
  });

  it("Yêu cầu thanh toán thành công khi dữ liệu hợp lệ", async () => {
    (generateSignature as jest.Mock).mockReturnValue("mocked-signature");

    mockedAxios.post.mockResolvedValue({
      status: 200,
      data: {
        desc: "success",
        data: {
          paymentLink: "https://payos.vn/payment/123",
        },
        signature: "mocked-signature",
      },
    });

    const req = new NextRequest("http://localhost:3000/api/create-payment", {
      method: "POST",
      body: JSON.stringify({
        amount: 100000,
        orderCode: "123",
        description: "Thanh toán đơn hàng",
        buyerName: "Nguyen Van A",
        buyerEmail: "a@example.com",
        title: "Đơn hàng #123",
      }),
    });

    const response = await POST(req);
    const json = await response?.json();

    expect(response.status).toBe(200);
    expect(json.status).toBe(200);
    expect(json).toEqual({
      status: 200,
      result: {
        paymentLink: "https://payos.vn/payment/123",
      },
    });

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://api-merchant.payos.vn/v2/payment-requests",
      expect.objectContaining({
        orderCode: "123",
        amount: 100000,
        description: "Thanh toán đơn hàng",
        buyerName: "Nguyen Van A",
        buyerEmail: "a@example.com",
        title: "Đơn hàng #123",
        items: [{ name: "Đơn hàng #123", price: 100000, quantity: 1 }],
        cancelUrl: "http://localhost:3000/payment/cancel",
        returnUrl: "http://localhost:3000/payment/success",
        expiredAt: expect.any(Number),
        signature: "mocked-signature",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": "PAYOS_CLIENT_ID",
          "x-api-key": "PAYOS_API_KEY",
        },
      }
    );
    expect(generateSignature).toHaveBeenCalledWith(
      100000,
      "123",
      "Thanh toán đơn hàng",
      "http://localhost:3000/payment/cancel",
      "http://localhost:3000/payment/success",
      process.env.PAYOS_CHECKSUM_KEY
    );
  });

  it("nên trả về lỗi 500 khi PayOS trả về lỗi", async () => {
    (generateSignature as jest.Mock).mockReturnValue("mocked-signature");

    mockedAxios.post.mockReset();
    const mockErrorResponse = {
      status: 200,
      data: {
        desc: "Duplicate Order",
        data: null,
        signature: "mocked-signature",
      },
    };
    mockedAxios.post.mockResolvedValue(mockErrorResponse);

    const req = new NextRequest("http://localhost:3000/api/create-payment", {
      method: "POST",
      body: JSON.stringify({
        amount: 100000,
        orderCode: "123",
        description: "Thanh toán đơn hàng",
        buyerName: "Nguyen Van A",
        buyerEmail: "a@example.com",
        title: "Đơn hàng #123",
      }),
    });

    const response = await POST(req);
    const json = await response?.json();

    expect(response.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json).toEqual({
      status: 500,
      message: "Duplicate Order",
      error: mockErrorResponse.data,
    });

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://api-merchant.payos.vn/v2/payment-requests",
      expect.objectContaining({
        orderCode: "123",
        amount: 100000,
        description: "Thanh toán đơn hàng",
        buyerName: "Nguyen Van A",
        buyerEmail: "a@example.com",
        title: "Đơn hàng #123",
        items: [{ name: "Đơn hàng #123", price: 100000, quantity: 1 }],
        cancelUrl: "http://localhost:3000/payment/cancel",
        returnUrl: "http://localhost:3000/payment/success",
        expiredAt: expect.any(Number),
        signature: "mocked-signature",
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "x-client-id": "PAYOS_CLIENT_ID",
          "x-api-key": "PAYOS_API_KEY",
        },
      }
    );
  });

  it("Lỗi 500 khi có lỗi xảy ra trong quá trình xử lý", async () => {
    (generateSignature as jest.Mock).mockReturnValue("mocked-signature");

    const payosError = new Error("Lỗi hệ thống PayOS");
    mockedAxios.post.mockRejectedValue(payosError);

    const req = new NextRequest("http://localhost:3000/api/create-payment", {
      method: "POST",
      body: JSON.stringify({
        amount: 100000,
        orderCode: "123",
        description: "Thanh toán đơn hàng",
        buyerName: "Nguyen Van A",
        buyerEmail: "a@example.com",
        title: "Đơn hàng #123",
      }),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(500);
    expect(json.status).toBe(500);
    expect(json.result.message).toBe("Lỗi hệ thống PayOS");

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});