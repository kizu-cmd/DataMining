/**
 * API Service Layer
 * 
 * Configure API_BASE_URL to point to your Python backend.
 * All endpoints return typed data that the app already expects.
 * 
 * Example Python backend (FastAPI):
 *   GET  /api/menu-items        → [{ id, name, icon, category, price }]
 *   GET  /api/analysis           → { frequentItemsets, rules }
 *   POST /api/analysis           → { frequentItemsets, rules }  (body: { transactions })
 *   POST /api/orders             → { orderId, status }
 *   GET  /api/upsell?items=a,b   → [{ name, icon, confidence }]
 *   POST /api/promotions/activate → { status }
 *   POST /api/upsell/accept       → { status }
 *   POST /api/combos/create       → { status }
 *   POST /api/orders/bulk         → { inserted }
 */

// ⚡ CHANGE THIS to your Python backend URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const apiEnabled = () => API_BASE_URL.length > 0;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Menu Items ──────────────────────────────────────────────
export interface ApiMenuItem {
  id: string;
  name: string;
  icon: string;
  category: string;
  price: number;
}

export async function fetchMenuItems(): Promise<ApiMenuItem[]> {
  return request<ApiMenuItem[]>("/api/menu-items");
}

// ── Analysis ────────────────────────────────────────────────
export interface ApiAnalysisResult {
  frequentItemsets: { items: string[]; support: number; count: number }[];
  rules: { antecedent: string; consequent: string; support: number; confidence: number; lift: number }[];
}

export async function fetchAnalysis(): Promise<ApiAnalysisResult> {
  return request<ApiAnalysisResult>("/api/analysis");
}

export async function runAnalysisOnServer(transactions: string[][]): Promise<ApiAnalysisResult> {
  return request<ApiAnalysisResult>("/api/analysis", {
    method: "POST",
    body: JSON.stringify({ transactions }),
  });
}

// ── Orders ──────────────────────────────────────────────────
export interface OrderPayload {
  items: { id: string; name: string; price: number; quantity: number }[];
  total: number;
}

export interface OrderResponse {
  orderId: string;
  status: string;
}

export async function placeOrder(order: OrderPayload): Promise<OrderResponse> {
  return request<OrderResponse>("/api/orders", {
    method: "POST",
    body: JSON.stringify(order),
  });
}

// ── Bulk Transactions ─────────────────────────────
export interface BulkTransactionRow {
  order_id: string;
  item: string;
}

export async function ingestTransactions(rows: BulkTransactionRow[]): Promise<{ inserted: number }> {
  return request<{ inserted: number }>("/api/orders/bulk", {
    method: "POST",
    body: JSON.stringify({ rows }),
  });
}

// ── Upsell ──────────────────────────────────────────────────
export interface UpsellSuggestion {
  name: string;
  icon: string;
  confidence: number;
}

export async function fetchUpsellSuggestions(itemNames: string[]): Promise<UpsellSuggestion[]> {
  const params = new URLSearchParams({ items: itemNames.join(",") });
  return request<UpsellSuggestion[]>(`/api/upsell?${params}`);
}

export interface UpsellAcceptPayload {
  baseItem: string;
  suggestedItem: string;
}

export async function acceptUpsellSuggestion(payload: UpsellAcceptPayload): Promise<{ status: string }> {
  return request<{ status: string }>("/api/upsell/accept", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export interface CreateComboPayload {
  items: string[];
  support: number;
  confidence: number;
  source?: string;
}

export async function createCombo(payload: CreateComboPayload): Promise<{ status: string }> {
  return request<{ status: string }>("/api/combos/create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ── Promotions ─────────────────────────────────────────────
export interface ActivatePromotionPayload {
  id: string;
  description: string;
}

export async function activatePromotion(payload: ActivatePromotionPayload): Promise<{ status: string }> {
  return request<{ status: string }>("/api/promotions/activate", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
